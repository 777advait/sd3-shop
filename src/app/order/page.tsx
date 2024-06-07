import React from "react";
import Container from "@/components/Container";
import Image from "next/image";
import OrderForm from "@/components/order/OrderForm";

export default function OrderPage({
  searchParams,
}: {
  searchParams: { image: string };
}) {
  const imgSrc = `${process.env.IMAGEKIT_URL_ENDPOINT}/${searchParams.image}`;
  return (
    <Container>
      <div className="flex justify-between">
        <Image
          src={imgSrc}
          alt="order image"
          height={512}
          width={512}
          className="rounded-md"
        />
        <OrderForm designUrl={imgSrc} />
      </div>
    </Container>
  );
}
