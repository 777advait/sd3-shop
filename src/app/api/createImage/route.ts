import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { promptFormSchema } from "@/lib/definitions";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const body: z.infer<typeof promptFormSchema> = await request.json();
  const validation = promptFormSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const payload = new FormData();

  payload.append("prompt", body.prompt);
  payload.append("output_format", "png");

  const res = await fetch(
    `https://api.stability.ai/v2beta/stable-image/generate/${body.model}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${body.apiKey}`,
        accept: "image/*",
      },
      body: payload,
    }
  );

  if (!res.ok) {
    return NextResponse.json(await res.json(), { status: res.status });
  }

  const imageKit = new ImageKit({
    publicKey: process.env?.IMAGEKIT_PUB_KEY!,
    privateKey: process.env?.IMAGEKIT_PVT_KEY!,
    urlEndpoint: process.env?.IMAGEKIT_URL_ENDPOINT!,
  });

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const imageFile = await imageKit.upload({
    file: buffer,
    fileName: body.prompt,
  });

  return NextResponse.json(imageFile, { status: 201 });
}
