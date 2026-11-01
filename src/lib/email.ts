import { sendEmail } from "@/lib/nodemailer";
import { SITE_NAME, formatPrice } from "@/lib/site";

type OrderForEmail = {
  id: number;
  total: number;
  status: string;
  paymentMethod: string;
  shipName: string;
  shipAddress: string;
  shipCity: string;
  shipState: string;
  shipPincode: string;
  customer: { name: string; email: string };
  items: { name: string; size: string; quantity: number; price: number }[];
};

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function layout(heading: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#111">
    <h2 style="background:#000;color:#fff;padding:16px;margin:0">${esc(SITE_NAME)}</h2>
    <div style="padding:16px"><h3>${heading}</h3>${body}</div></div>`;
}

function summary(o: OrderForEmail) {
  const rows = o.items
    .map(
      (i) =>
        `<tr><td style="padding:4px 0">${esc(i.name)} (${esc(i.size)}) × ${i.quantity}</td><td align="right">${formatPrice(i.price * i.quantity)}</td></tr>`,
    )
    .join("");
  return `<table width="100%" style="border-collapse:collapse">${rows}
    <tr><td style="padding-top:8px"><b>Total</b></td><td align="right"><b>${formatPrice(o.total)}</b></td></tr></table>
    <p>Payment: ${o.paymentMethod === "COD" ? "Cash on delivery" : "Paid online"}</p>
    <p>Shipping to:<br>${esc(o.shipName)}<br>${esc(o.shipAddress)}<br>${esc(o.shipCity)}, ${esc(o.shipState)} ${esc(o.shipPincode)}</p>`;
}

export async function sendOrderConfirmation(o: OrderForEmail) {
  await sendEmail(
    o.customer.email,
    `Order #${o.id} confirmed - ${SITE_NAME}`,
    layout(
      `Thanks ${esc(o.customer.name)}, your order #${o.id} is confirmed!`,
      summary(o),
    ),
  );
}

const STATUS_TEXT: Record<string, string> = {
  PROCESSING: "is being prepared",
  SHIPPED: "has been shipped",
  DELIVERED: "has been delivered",
  CANCELLED: "has been cancelled",
};

export async function sendOrderStatusEmail(o: OrderForEmail) {
  const text = STATUS_TEXT[o.status];
  if (!text) return;
  await sendEmail(
    o.customer.email,
    `Order #${o.id} update - ${SITE_NAME}`,
    layout(`Your order #${o.id} ${text}`, summary(o)),
  );
}

export async function sendOtpEmail(email: string, code: string, purpose: "SIGNUP" | "RESET") {
  const what = purpose === "SIGNUP" ? "verify your email" : "reset your password";
  return sendEmail(
    email,
    `${code} is your ${SITE_NAME} code`,
    layout(
      "Your verification code",
      `<p>Use this code to ${what}:</p><p style="font-size:32px;font-weight:bold;letter-spacing:6px">${code}</p><p>It expires in 10 minutes. If you did not request it, you can ignore this email.</p>`,
    ),
  );
}
