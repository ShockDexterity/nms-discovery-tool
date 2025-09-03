import client from "@/lib/mongodb";
import { NextResponse } from "next/server";

import { ValidationError } from "@/lib/types";

export async function GET(request: Request) {
  const collection = client.db("NMSP").collection("systems");
  const systems = await collection.find().sort({ system: 1, name: 1 }).toArray();

  return NextResponse.json(systems);
}
