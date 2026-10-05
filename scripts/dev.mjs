#!/usr/bin/env node
// next dev 래퍼 — "- Network:" 줄 아래에 실제 외부 IP URL 을 한 줄 덧붙인다.
//
// next 는 `--hostname 0.0.0.0` 일 때 "http://0.0.0.0:3009" 을 찍는데 그 주소로는
// 다른 기기에서 못 들어간다. 사내 개발머신을 LAN 에서 띄워 쓰므로 실제 IP 가 필요하다.
// (merrycoco-admin 의 같은 래퍼를 가져왔다.)
import { spawn } from "node:child_process";
import os from "node:os";

const PORT = process.env.PORT ?? "3009";

const ip = Object.values(os.networkInterfaces())
  .flat()
  .find((n) => n && n.family === "IPv4" && !n.internal)?.address;

const child = spawn("next", ["dev", "--hostname", "0.0.0.0", "--port", PORT], {
  env: { ...process.env, FORCE_COLOR: process.env.FORCE_COLOR ?? "1" },
  stdio: ["inherit", "pipe", "pipe"],
});

const ANSI = /\x1B\[[0-9;]*m/g;
const NETWORK_LINE = /- Network:\s+http:\/\/0\.0\.0\.0:\d+/;
let injected = false;

function makeProcessor(out) {
  let buf = "";
  return (chunk) => {
    buf += chunk.toString();
    let i;
    while ((i = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, i + 1);
      buf = buf.slice(i + 1);
      out.write(line);
      if (!injected && ip && NETWORK_LINE.test(line.replace(ANSI, ""))) {
        out.write(`- Network URL:   http://${ip}:${PORT}\n`);
        injected = true;
      }
    }
  };
}

child.stdout.on("data", makeProcessor(process.stdout));
child.stderr.on("data", makeProcessor(process.stderr));

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});

for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(sig, () => child.kill(sig));
}
