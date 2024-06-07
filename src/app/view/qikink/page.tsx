import { generateAccessToken } from "@/actions/qikink-order";
import Container from "@/components/Container";
import React from "react";

async function getOrders() {
  "use server";

  const res = await fetch("https://api.qikink.com/api/order", {
    headers: {
      ClientId: process.env.QIKINK_CLIENT_ID!,
      Accesstoken: await generateAccessToken(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return;
  }

  return await res.json();
}

export default async function QikinkPage() {
  const orders = await getOrders();
  return (
    <Container>
      {orders ? (
        <pre>{JSON.stringify(orders, null, 2)}</pre>
      ) : (
        <p>Failed to fethc orders!</p>
      )}
    </Container>
  );
}
