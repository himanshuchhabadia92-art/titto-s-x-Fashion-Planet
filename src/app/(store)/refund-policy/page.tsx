import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { BUSINESS_NAME, REFUND_DAYS, RETURN_WINDOW_DAYS } from "@/lib/site";

export const metadata: Metadata = { title: "Refund & Returns Policy - Titto's X Fashion Planet" };

export default function RefundPolicy() {
  return (
    <PolicyPage title="Refund & Returns Policy">
      <p>We want you to be happy with your purchase from {BUSINESS_NAME}. This policy explains cancellations, returns and refunds.</p>

      <h2>Cancelling an order</h2>
      <p>You can cancel an order before it is shipped by contacting us through the <Link href="/contact">Contact Us</Link> page with your order number. Once an order has been shipped it can no longer be cancelled, but you may be able to return it as described below.</p>

      <h2>Returns</h2>
      <p>You can request a return within {RETURN_WINDOW_DAYS} days of delivery if:</p>
      <ul>
        <li>the item is damaged or defective,</li>
        <li>you received the wrong item, size or colour, or</li>
        <li>the item does not match what was shown on the website.</li>
      </ul>
      <p>Returned items must be unused, unwashed and in their original condition with all tags and packaging. Please contact us within the return window with your order number and clear photos of the item so we can arrange the return.</p>

      <h2>Items that cannot be returned</h2>
      <ul>
        <li>Items that have been worn, washed, altered or damaged after delivery.</li>
        <li>Items without their original tags or packaging.</li>
        <li>Items marked as non-returnable at the time of purchase.</li>
      </ul>

      <h2>Refunds</h2>
      <p>After we receive and inspect the returned item, we will tell you whether the refund is approved. Approved refunds are sent within {REFUND_DAYS} business days.</p>
      <ul>
        <li><b>Paid online (UPI, card, netbanking):</b> refunded to the original payment method.</li>
        <li><b>Cash on delivery:</b> refunded by bank transfer or UPI to the account details you share with us.</li>
      </ul>
      <p>Your bank may take a few more days to show the amount in your account.</p>

      <h2>Exchanges</h2>
      <p>If you need a different size, contact us within the return window. Exchanges depend on stock availability. If the size is not available we will refund you instead.</p>

      <h2>Damaged in transit</h2>
      <p>If your parcel arrives damaged, please contact us within 48 hours of delivery with photos of the parcel and the item, and we will arrange a replacement or refund.</p>

      <h2>Contact</h2>
      <p>For help with a return or refund, see our <Link href="/contact">Contact Us</Link> page.</p>
    </PolicyPage>
  );
}
