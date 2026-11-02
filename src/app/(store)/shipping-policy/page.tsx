import type { Metadata } from "next";
import Link from "next/link";
import PolicyPage from "@/components/PolicyPage";
import { BUSINESS_NAME, DELIVERY_DAYS, DISPATCH_DAYS } from "@/lib/site";

export const metadata: Metadata = { title: "Shipping Policy - Titto's X Fashion Planet" };

export default function ShippingPolicy() {
  return (
    <PolicyPage title="Shipping Policy">
      <p>This policy explains how {BUSINESS_NAME} ships orders placed on this website.</p>

      <h2>Where we deliver</h2>
      <p>We deliver across India to any pincode serviced by our courier partners. Serviceability is checked when your order is placed.</p>

      <h2>Processing time</h2>
      <p>Orders are packed and handed to the courier within {DISPATCH_DAYS} business days after they are confirmed. Orders placed on Sundays or public holidays are processed on the next business day.</p>

      <h2>Delivery time</h2>
      <p>Once shipped, delivery usually takes {DELIVERY_DAYS} business days depending on your location. Delays can happen because of weather, strikes or courier issues, and these are outside our control.</p>

      <h2>Shipping charges</h2>
      <p>Any shipping charge is shown at checkout before you pay. There are no hidden charges added after you place your order.</p>

      <h2>Order updates</h2>
      <p>We email you when your order is confirmed and again when its status changes, for example when it is shipped or delivered. You can also see your orders under <Link href="/account">My Account</Link>.</p>

      <h2>Cash on delivery</h2>
      <p>Cash on delivery is available on eligible orders. Please keep the exact amount ready for the delivery person. Orders that are refused or not accepted at delivery may be cancelled, and repeated refusals may lead to cash on delivery being disabled for that customer.</p>

      <h2>Wrong address or failed delivery</h2>
      <p>Please check your address and phone number carefully before placing the order. If a delivery fails because of an incorrect address or because nobody was available, the courier will attempt delivery again. After the final attempt the parcel is returned to us and we will contact you to arrange re-shipping.</p>

      <h2>Damaged or missing parcels</h2>
      <p>If your parcel arrives damaged or tampered with, please do not accept it if possible and contact us right away. See our <Link href="/refund-policy">Refund &amp; Returns Policy</Link> for what happens next.</p>

      <h2>Contact</h2>
      <p>For any shipping question, see our <Link href="/contact">Contact Us</Link> page.</p>
    </PolicyPage>
  );
}
