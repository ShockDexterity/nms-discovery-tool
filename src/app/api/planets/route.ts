import client from "@/lib/mongodb";
import { NextResponse } from "next/server";

import { validate_planet } from "@/lib/validators/planet";

import { ValidationError } from "@/lib/types";

export async function GET(request: Request) {
  const collection = client.db("NMSP").collection("planets");
  const planets = await collection.find().sort({ system: 1, name: 1 }).toArray();

  return NextResponse.json(planets);
}

export async function POST(request: Request) {
  const body = await request.json();

  // console.log(body);

  try {
    const { valid_planet, warning } = validate_planet(body);

    if (!valid_planet) {
      throw new ValidationError("Unable to validate planet", 500);
    }

    const collection = client.db("NMSP").collection("planets");
    await collection.insertOne(valid_planet);

    if (warning && warning !== "") {
      return NextResponse.json({ msg: warning, warn: true });
    }

    return NextResponse.json({
      msg: `Successfully added planet ${valid_planet.name}`,
    });
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
