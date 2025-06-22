import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login");

  return <main className="min-h-screen flex flex-col items-center "></main>;
}
