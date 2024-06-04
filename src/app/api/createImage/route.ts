import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

export async function GET() {
  const res = await fetch("https://picsum.photos/200/300");
  const imageKit = new ImageKit({
    publicKey: "public_Q3dZtfJwKFFEtCU1tV4CHFcvstQ=",
    privateKey: "private_6FsbE5UG0raCVfW/Fg/TAkT4E+0=",
    urlEndpoint: "https://ik.imagekit.io/astroo",
  });

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const imageFile = await imageKit.upload({
    file: buffer,
    fileName: "randomfile",
  });

  return NextResponse.json({ url: imageFile.url }, { status: 201 });
}
