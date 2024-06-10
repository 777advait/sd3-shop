import { createPrintifyOrder } from "@/actions/printify-order";
import { createQikinkOrder } from "@/actions/qikink-order";
import { payloadSchema } from "@/lib/definitions";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const body: z.infer<typeof payloadSchema> = await request.json();
  const validation = payloadSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation, { status: 400 });
  }

  const order =
    body.country === "IN"
      ? await createQikinkOrder(body)
      : await createPrintifyOrder(body);

  if (order?.error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }

  return NextResponse.json(order, { status: 201 });
}
