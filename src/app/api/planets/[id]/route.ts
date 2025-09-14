import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { validate_planet } from "@/lib/validators/planet";

import { Planet, PlanetNoId, ValidationError } from "@/lib/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const _id = new ObjectId((await params).id);

  const collection = client.db("NMSP").collection("planets");
  const planet = await collection.findOne({ _id });

  if (!planet) {
    return NextResponse.json({
      error: `Unable to find planet _id ${_id.toString()}`,
    });
  }

  return NextResponse.json(planet);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const _id = new ObjectId(id);

  const collection = client.db("NMSP").collection("planets");
  const planetToEdit: Planet = JSON.parse(JSON.stringify(await collection.findOne({ _id })));

  if (!planetToEdit) {
    return NextResponse.json(
      {
        error: "Cannot edit a planet that does not exist",
      },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const { valid_planet, warning } = validate_planet(body, true);

    if (!valid_planet) {
      throw new ValidationError("Unable to validate planet", 500);
    }

    Object.keys(valid_planet).forEach((key: string) => {
      if (!(key in planetToEdit)) {
        delete valid_planet[key as keyof PlanetNoId];
      }
    });

    const result = await collection.updateOne({ _id }, { $set: valid_planet });

    if (result.matchedCount < 1) {
      throw new ValidationError("Unable to find planet to edit", 500);
    }

    if (result.modifiedCount < 1) {
      return NextResponse.json({ msg: "Planet unchanged", warn: true });
    }

    if (warning && warning !== "") {
      return NextResponse.json({ msg: warning, warn: true });
    }

    return NextResponse.json({
      msg: `Successfully edited planet ${valid_planet.name}`,
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const _id = new ObjectId((await params).id);

  const collection = client.db("NMSP").collection("planets");
  const planet = await collection.findOneAndDelete(
    { _id },
    {
      projection: { name: 1 },
    },
  );

  // const planet = await collection.findOne({ _id });

  if (!planet) {
    return NextResponse.json({ error: "Unable to delete planet" }, { status: 500 });
  }

  return NextResponse.json({
    msg: `Successfully deleted planet ${planet.name}`,
  });
}
