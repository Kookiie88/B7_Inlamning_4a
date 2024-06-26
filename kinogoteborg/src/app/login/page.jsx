import LoginForm from "../components/userComponents/LoginForm";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/profile");
  }

  return (
    <main className="grid place-items-center h-screen">
      <LoginForm />
    </main>
  );
}
