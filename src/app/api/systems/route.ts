import client from "@/lib/mongodb";
import { NextResponse } from "next/server";

import { validate_system } from "@/lib/validators/system";

import { ValidationError } from "@/lib/types";

export async function GET(request: Request) {
  const collection = client.db("NMSP").collection("systems");
  const systems = await collection.find().sort({ system: 1, name: 1 }).toArray();

  return NextResponse.json(systems);
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const { validSystem, warning } = validate_system(data);

    if (!validSystem) {
      throw new ValidationError("Unable to validate system", 500);
    }

    const collection = client.db("NMSP").collection("systems");
    await collection.insertOne(validSystem);

    if (warning && warning !== "") {
      return NextResponse.json({ msg: warning, warn: true });
    }

    return NextResponse.json({
      msg: `Successfully added system ${validSystem.name}`,
    });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    } else if (error instanceof Error) {
      return NextResponse.json({ error: error.message });
    } else {
      return NextResponse.json({ error: "Unknown Error" });
    }
  }
}
