import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { BUSINESS_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy - Titto's X Fashion Planet" };

export default function PrivacyPolicy() {
  return (
    <PolicyPage title="Privacy Policy">
      <p>{BUSINESS_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what information we collect when you use this website, how we use it and the choices you have.</p>

      <h2>Information we collect</h2>
      <ul>
        <li><b>Details you give us:</b> your name, email address, phone number and delivery address when you place an order or create an account.</li>
        <li><b>Account details:</b> your email, phone and an encrypted password if you create an account.</li>
        <li><b>Order details:</b> the items you buy, order value, payment method and order status.</li>
        <li><b>Browser storage:</b> your cart and wishlist are saved in your own browser, and a cookie keeps you logged in.</li>
      </ul>

      <h2>Payments</h2>
      <p>Online payments are processed by Razorpay. Your card, UPI or bank details are entered on Razorpay&apos;s secure page and are never stored on our servers. We only receive a confirmation that your payment was successful, along with a payment reference.</p>

      <h2>How we use your information</h2>
      <ul>
        <li>To process and deliver your orders and send order and shipping updates.</li>
        <li>To send one-time verification codes when you sign up or reset your password.</li>
        <li>To manage your account and help with support requests.</li>
        <li>To prevent fraud and keep the website secure.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We do not sell your personal information. We share only what is needed with service providers that help us run the store, such as our payment gateway, courier partners, and email and hosting providers. They may use your information only to provide their service to us.</p>

      <h2>Emails</h2>
      <p>We send transactional emails such as order confirmations, shipping updates and verification codes. We do not send marketing emails unless you ask us to.</p>

      <h2>Data security and retention</h2>
      <p>We use reasonable technical measures to protect your information, including encrypted passwords and secure connections. We keep order records for as long as needed for accounting, legal and support purposes.</p>

      <h2>Your choices</h2>
      <p>You can ask us to correct or delete your personal information, subject to records we must keep by law. You can also clear your cart and wishlist at any time by clearing your browser data. Contact us through the <Link href="/contact">Contact Us</Link> page for any request.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The date at the top of this page shows when it was last changed.</p>
    </PolicyPage>
  );
}
