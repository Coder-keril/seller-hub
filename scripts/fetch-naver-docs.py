#!/usr/bin/env python3
"""네이버 커머스API 문서를 로컬로 내려받아 텍스트로 저장한다.

apicenter.commerce.naver.com 은 Claude 의 조회 도구로 막혀 있다. 이 스크립트로
원문을 docs/naver/pages/ 에 텍스트로 저장하면 로컬 파일로 읽고 분석할 수 있다.

문서 사이트는 Docusaurus 3.7 이라 각 페이지 본문이 HTML 에 이미 렌더링돼 있다.
sitemap.xml 로 전체 목록을 받고, 각 페이지의 <article> 본문만 뽑아 저장한다.

실행:  python3 scripts/fetch-naver-docs.py
       python3 scripts/fetch-naver-docs.py --only auth,order    # 경로에 이 문자열이 든 것만
       python3 scripts/fetch-naver-docs.py --llms               # llms.txt 기준 (이쪽이 완전하다)
"""
import gzip
import html
import os
import re
import sys
import time
import urllib.error
import urllib.request

HOST = "https://apicenter.commerce.naver.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "naver", "pages")
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/131.0 Safari/537.36")


def get(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read()
    if r.headers.get("Content-Encoding") == "gzip":
        raw = gzip.decompress(raw)
    return raw.decode("utf-8", "replace")


def page_urls() -> list[str]:
    """sitemap 에서 문서 URL 목록. 없으면 한 페이지의 사이드바 링크로 대체한다."""
    for sm in (f"{HOST}/docs/sitemap.xml", f"{HOST}/sitemap.xml"):
        try:
            urls = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", get(sm))
        except urllib.error.URLError:
            continue
        if urls:
            print(f"sitemap: {sm} — {len(urls)}개")
            return sorted(set(urls))

    print("sitemap 없음 — 사이드바 링크로 대체")
    seen, queue, found = set(), [f"{HOST}/docs/introduction"], set()
    while queue:
        u = queue.pop()
        if u in seen:
            continue
        seen.add(u)
        try:
            body = get(u)
        except urllib.error.URLError:
            continue
        for href in re.findall(r'href=["\']?(/docs/[A-Za-z0-9/_.-]+)', body):
            full = HOST + href.split("#")[0]
            found.add(full)
            if full not in seen and len(seen) < 40:
                queue.append(full)
    return sorted(found)


BLOCK = re.compile(
    r"</(p|div|li|tr|h[1-6]|pre|section|article|table|thead|tbody|ul|ol|dl|dd|dt)\s*>",
    re.I)


def to_text(page: str) -> str:
    """<article> 본문만 남기고 태그를 벗긴다. 블록 경계는 줄바꿈으로."""
    m = re.search(r"<article[^>]*>(.*?)</article>", page, re.S | re.I)
    body = m.group(1) if m else page
    body = re.sub(r"<(script|style|svg|nav)\b.*?</\1>", " ", body, flags=re.S | re.I)
    body = re.sub(r"</t[dh]\s*>", "\t", body, flags=re.I)   # 표는 탭으로 구분
    body = BLOCK.sub("\n", body)
    body = re.sub(r"<br\s*/?>", "\n", body, flags=re.I)
    body = re.sub(r"<[^>]+>", "", body)
    body = html.unescape(body)
    body = re.sub(r"[ \t]+\n", "\n", body)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip()


def title_of(page: str) -> str:
    m = re.search(r"<title[^>]*>(.*?)</title>", page, re.S | re.I)
    return html.unescape(m.group(1)).strip() if m else ""


LLMS = os.path.join(ROOT, "docs", "naver", "llms")


def fetch_llms() -> None:
    """llms.txt 인덱스로 엔드포인트별 문서를 받는다.

    sitemap 경로보다 이쪽이 완전하다 — sitemap 에는 정산(pay-settle) 그룹이 빠져 있었다.
    본문도 요청·응답 스키마가 표로 정리돼 있어 HTML 본문보다 읽기 쉽다.
    """
    os.makedirs(LLMS, exist_ok=True)
    idx = get(f"{HOST}/llms/llms.txt")
    with open(os.path.join(LLMS, "llms.txt"), "w") as f:
        f.write(idx)
    names = sorted(set(re.findall(r"llms/([a-zA-Z0-9-]+)\.md", idx)))
    print(f"llms.txt 인덱스 — 문서 {len(names)}건")
    ok = skip = 0
    for n in names:
        path = os.path.join(LLMS, f"{n}.md")
        if os.path.exists(path) and os.path.getsize(path) > 500:
            skip += 1
            continue
        try:
            with open(path, "w") as f:
                f.write(get(f"{HOST}/llms/{n}.md"))
            ok += 1
        except urllib.error.URLError as e:
            print(f"  실패 {n} → {e}")
        time.sleep(0.3)
    print(f"받음 {ok}  이미있음 {skip}")


def main() -> None:
    if "--llms" in sys.argv:
        fetch_llms()
        return

    only = []
    if "--only" in sys.argv:
        only = [s.strip() for s in sys.argv[sys.argv.index("--only") + 1].split(",") if s.strip()]

    os.makedirs(OUT, exist_ok=True)
    urls = [u for u in page_urls() if "/docs" in u]
    if only:
        urls = [u for u in urls if any(k in u.lower() for k in only)]
    print(f"내려받을 페이지 {len(urls)}개 → {OUT}\n")

    index, ok, empty = [], 0, 0
    for i, u in enumerate(urls, 1):
        slug = u.replace(HOST, "").strip("/").replace("/", "_") or "index"
        try:
            page = get(u)
        except urllib.error.URLError as e:
            print(f"  [{i}/{len(urls)}] 실패 {u} — {e}")
            continue
        text = to_text(page)
        if len(text) < 200:
            empty += 1
            continue
        path = os.path.join(OUT, f"{slug}.md")
        with open(path, "w", encoding="utf-8") as f:
            f.write(f"<!-- {u} -->\n# {title_of(page)}\n\n{text}\n")
        index.append((slug, title_of(page), len(text), u))
        ok += 1
        if i % 20 == 0:
            print(f"  {i}/{len(urls)} …")
        time.sleep(0.15)   # 예의상 간격

    index.sort(key=lambda r: -r[2])
    with open(os.path.join(OUT, "_index.md"), "w", encoding="utf-8") as f:
        f.write("# 내려받은 페이지 (본문 길이 순)\n\n| 파일 | 제목 | 글자수 | 원문 |\n|---|---|---|---|\n")
        for slug, t, n, u in index:
            f.write(f"| `{slug}.md` | {t} | {n:,} | {u} |\n")

    print(f"\n완료 — {ok}개 저장, {empty}개 본문 없음")
    print(f"목록: {os.path.join(OUT, '_index.md')}\n")
    print("본문이 긴 페이지 15개:")
    for slug, t, n, _ in index[:15]:
        print(f"  {n:>7,}  {slug}")


if __name__ == "__main__":
    main()
