import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PolicyPage from "@/components/PolicyPage";
import InstagramIcon from "@/components/InstagramIcon";
import {
  BUSINESS_ADDRESS,
  BUSINESS_NAME,
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
} from "@/lib/site";

export const metadata: Metadata = { title: "Contact Us - Titto's X Fashion Planet" };

const row = "flex items-start gap-3 py-4 border-b border-gray-200";

export default function ContactPage() {
  return (
    <PolicyPage title="Contact Us" showUpdated={false}>
      <p>Questions about an order, sizing or a product? Reach out to {BUSINESS_NAME} and we will get back to you as soon as we can.</p>

      <div className="mt-6 border-t border-gray-200 text-black">
        <div className={row}>
          <Phone size={20} className="mt-1 shrink-0" />
          <div>
            <p className="!mb-0 font-bold">Phone</p>
            <a href={`tel:${PHONE_TEL}`} className="font-normal">{PHONE_DISPLAY}</a>
          </div>
        </div>
        <div className={row}>
          <MessageCircle size={20} className="mt-1 shrink-0" />
          <div>
            <p className="!mb-0 font-bold">WhatsApp</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-normal">Chat with us on WhatsApp</a>
          </div>
        </div>
        {CONTACT_EMAIL && (
          <div className={row}>
            <Mail size={20} className="mt-1 shrink-0" />
            <div>
              <p className="!mb-0 font-bold">Email</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-normal">{CONTACT_EMAIL}</a>
            </div>
          </div>
        )}
        <div className={row}>
          <InstagramIcon size={20} className="mt-1 shrink-0" />
          <div>
            <p className="!mb-0 font-bold">Instagram</p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="font-normal">{INSTAGRAM_HANDLE}</a>
          </div>
        </div>
        {BUSINESS_ADDRESS && (
          <div className={row}>
            <MapPin size={20} className="mt-1 shrink-0" />
            <div>
              <p className="!mb-0 font-bold">Business address</p>
              <p className="!mb-0 font-normal whitespace-pre-line">{BUSINESS_ADDRESS}</p>
            </div>
          </div>
        )}
      </div>

      <h2>Order help</h2>
      <p>Please keep your order number handy when you contact us. You can find it in your confirmation email and under My Account.</p>
    </PolicyPage>
  );
}
