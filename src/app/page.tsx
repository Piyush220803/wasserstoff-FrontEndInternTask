import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/editor");
  return null;
}
