import { redirect } from "next/navigation";
import { HOME_HREF } from "./(app)/nav-items";

export default function Home() {
  redirect(HOME_HREF);
}
