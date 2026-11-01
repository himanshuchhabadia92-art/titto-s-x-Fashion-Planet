import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { markPaid } from "@/lib/orders";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const publicId = body?.publicId;
  const paymentId = body?.razorpay_payment_id;
  const signature = body?.razorpay_signature;
  if (typeof publicId !== "string" || typeof paymentId !== "string" || typeof signature !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const order = await db.order.findUnique({ where: { publicId } });
  if (!order?.razorpayOrderId || !verifyRazorpaySignature(order.razorpayOrderId, paymentId, signature)) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  await markPaid(order.id, paymentId);
  return NextResponse.json({ publicId });
}
