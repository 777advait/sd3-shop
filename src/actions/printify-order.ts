import { payloadSchema } from "@/lib/definitions";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

function createPayload(data: z.infer<typeof payloadSchema>) {
  return {
    external_id: uuidv4().replace(/-/g, "").slice(0, 15),
    line_items: [
      {
        print_provider_id: 45,
        blueprint_id: 795,
        variant_id: 75020,
        print_areas: {
          [data.placement]: data.designUrl,
        },
        quantity: 1,
      },
    ],
    shipping_method: 1,
    is_printify_express: false,
    is_economy_shipping: false,
    send_shipping_notification: true,
    address_to: {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      region: data.region,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      zip: data.zip,
    },
  };
}

export async function createPrintifyOrder(data: z.infer<typeof payloadSchema>) {
  const payload = createPayload(data);

  const res = await fetch(
    `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.PRINTIFY_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    return { error: "Unable to create order!" };
  }

  return await res.json();
}
