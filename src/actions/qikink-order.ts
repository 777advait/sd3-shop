import { payloadSchema } from "@/lib/definitions";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export async function generateAccessToken() {
  "use server";
  const body = new URLSearchParams();

  body.append("ClientId", process.env.QIKINK_CLIENT_ID!);
  body.append("client_secret", process.env.QIKINK_CLIENT_SECRET!);

  const res = await fetch("https://api.qikink.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  });

  if (!res.ok) {
    return { error: "Failed to generate access token" };
  }

  return (await res.json()).Accesstoken;
}

function createPayload(data: z.infer<typeof payloadSchema>) {
  return {
    order_number: uuidv4().replace(/-/g, "").slice(0, 15),
    qikink_shipping: "1",
    gateway: "Prepaid",
    total_order_value: "350",
    line_items: [
      {
        search_from_my_products: 0,
        print_type_id: 1,
        quantity: "1",
        price: "350",
        sku: "MLlCv-Bk-L",
        designs: [
          {
            design_code: uuidv4().replace(/-/g, "").slice(0, 15),
            width_inches: "7",
            height_inches: "7",
            placement_sku: data.placement === "front" ? "fr" : "bk",
            design_link: data.designUrl,
            mockup_link: data.designUrl,
          },
        ],
      },
    ],
    shipping_address: {
      first_name: data.firstName,
      last_name: data.lastName,
      address1: data.address1,
      address2: data.address2,
      phone: data.phone,
      email: data.email,
      city: data.city,
      zip: data.zip,
      province: data.region,
      country_code: data.country,
    },
  };
}

export async function createQikinkOrder(data: z.infer<typeof payloadSchema>) {
  "use server";
  const payload = createPayload(data);
  const accessToken = await generateAccessToken();

  const res = await fetch("https://api.qikink.com/api/order/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ClientId: process.env.QIKINK_CLIENT_ID!,
      Accesstoken: accessToken,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { error: "Unable to create order!" };
  }

  return await res.json();
}
