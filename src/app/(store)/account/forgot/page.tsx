import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentCustomer } from "@/lib/customer";

export default async function ForgotPage() {
  if (await getCurrentCustomer()) redirect("/account");
  return <AuthForm mode="forgot" />;
}
