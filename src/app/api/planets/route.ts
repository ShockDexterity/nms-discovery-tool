import client from "@/lib/mongodb";
import { NextResponse } from "next/server";

import { ValidationError } from "@/lib/types";

export async function GET(request: Request) {
  const collection = client.db("NMSP").collection("planets");
  const planets = await collection.find().sort({ system: 1, name: 1 }).toArray();

  return NextResponse.json(planets);
}

export async function POST(request: Request) {
  const body = await request.json();

  console.log(body);

  try {
    // validate planet
    // if not valid, throw error
    // grab Planets collection, insertOne
    // if there is a warning, send warning in success response
    // if not, respond normally

    return NextResponse.json({ success: true, info: body });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    } else if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    } else {
      return NextResponse.json({ error: "Unknown Error" });
    }
  }
}
