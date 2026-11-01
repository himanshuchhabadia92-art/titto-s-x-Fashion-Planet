import CheckoutForm from "@/components/CheckoutForm";
import { getCurrentCustomer } from "@/lib/customer";

export default async function CheckoutPage() {
  const customer = await getCurrentCustomer();
  return <CheckoutForm prefill={customer ? { name: customer.name, email: customer.email, phone: customer.phone } : undefined} />;
}
