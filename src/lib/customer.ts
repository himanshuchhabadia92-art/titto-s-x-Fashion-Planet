import { db } from "@/lib/db";
import { getCustomerId } from "@/lib/session";

/** The logged-in customer, or null for guests (also null if the cookie points at a customer that no longer exists). */
export async function getCurrentCustomer() {
  const id = await getCustomerId();
  return id ? db.customer.findUnique({ where: { id } }) : null;
}
