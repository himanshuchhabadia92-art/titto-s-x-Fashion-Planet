import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderError, createOrder, parseCheckout, sendConfirmationFor } from "@/lib/orders";
import { createRazorpayOrder } from "@/lib/razorpay";
import { getCustomerId } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const input = parseCheckout(await request.json().catch(() => null));
    const order = await createOrder(input, await getCustomerId());

    if (input.paymentMethod === "COD") {
      await sendConfirmationFor(order.id);
      return NextResponse.json({ publicId: order.publicId });
    }

    try {
      const rp = await createRazorpayOrder(order.total, `order_${order.id}`);
      await db.order.update({ where: { id: order.id }, data: { razorpayOrderId: rp.id } });
      return NextResponse.json({
        publicId: order.publicId,
        razorpay: { keyId: process.env.RAZORPAY_KEY_ID, orderId: rp.id, amount: order.total * 100 },
      });
    } catch (err) {
      console.error(err);
      await db.order.delete({ where: { id: order.id } });
      return NextResponse.json(
        { error: "Online payment is unavailable right now. Please try again or choose Cash on Delivery." },
        { status: 502 },
      );
    }
  } catch (err) {
    if (err instanceof OrderError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
