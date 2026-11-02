import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { BUSINESS_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Terms & Conditions - Titto's X Fashion Planet" };

export default function Terms() {
  return (
    <PolicyPage title="Terms & Conditions">
      <p>By using this website and placing an order, you agree to these terms. Please read them carefully. The website is operated by {BUSINESS_NAME}.</p>

      <h2>Using the website</h2>
      <p>You agree to use the website only for lawful purposes and to give accurate information when you order or create an account. You are responsible for keeping your account password safe.</p>

      <h2>Products and prices</h2>
      <p>We try to show our products, colours and sizes as accurately as possible, but colours may look slightly different on your screen. All prices are in Indian Rupees (INR). Prices and availability can change without notice. If a product is listed at a wrong price or is out of stock, we may cancel the order and refund any amount paid.</p>

      <h2>Orders</h2>
      <p>Placing an order is an offer to buy. An order is confirmed when you receive our confirmation email. We may refuse or cancel an order, for example because of stock issues, pricing errors or suspected fraud.</p>

      <h2>Payment</h2>
      <p>You can pay online by UPI, credit or debit card or netbanking through Razorpay, or choose cash on delivery on eligible orders. Online orders are confirmed only after the payment succeeds.</p>

      <h2>Shipping, returns and refunds</h2>
      <p>Delivery is covered by our <Link href="/shipping-policy">Shipping Policy</Link>. Cancellations, returns and refunds are covered by our <Link href="/refund-policy">Refund &amp; Returns Policy</Link>. Both form part of these terms.</p>

      <h2>Intellectual property</h2>
      <p>All logos, designs, graphics, images and text on this website belong to {BUSINESS_NAME} or its licensors. You may not copy or use them for commercial purposes without our written permission.</p>

      <h2>Limitation of liability</h2>
      <p>To the extent permitted by law, we are not liable for indirect or consequential losses arising from your use of the website. Our total liability for any order is limited to the amount you paid for that order.</p>

      <h2>Privacy</h2>
      <p>How we handle your information is explained in our <Link href="/privacy-policy">Privacy Policy</Link>.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of the courts in India.</p>

      <h2>Changes to these terms</h2>
      <p>We may update these terms from time to time. The date at the top of this page shows when they were last changed.</p>

      <h2>Contact</h2>
      <p>For questions about these terms, see our <Link href="/contact">Contact Us</Link> page.</p>
    </PolicyPage>
  );
}
