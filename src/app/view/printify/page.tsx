import Container from "@/components/Container";
import React from "react";

async function getOrders() {
  "use server";

  const res = await fetch(
    `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`,
    {
      headers: {
        authorization: `Bearer ${process.env.PRINTIFY_ACCESS_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return;
  }

  return await res.json();
}

export default async function PrintifyPage() {
  const orders = await getOrders();
  return (
    <Container>
      {orders ? (
        <pre>{JSON.stringify(orders, null, 2)}</pre>
      ) : (
        <p>Failed to fetch orders!</p>
      )}
    </Container>
  );
}
