import client from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { validate_system } from "@/lib/validators/system";
import { System, SystemNoId, ValidationError } from "@/lib/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const _id = new ObjectId(id);

  const collection = client.db("NMSP").collection("systems");
  const system = await collection.findOne({ _id });

  if (!system) {
    return NextResponse.json({
      error: `Unable to find system by _id ${_id.toString()}`,
    });
  }

  return NextResponse.json(system);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const _id = new ObjectId(id);

  const collection = client.db("NMSP").collection("systems");

  const systemToEdit: System = JSON.parse(JSON.stringify(await collection.findOne({ _id })));

  if (!systemToEdit) {
    return NextResponse.json(
      {
        error: "Trying to edit a system that does not exist",
      },
      { status: 400 },
    );
  }

  try {
    const data = await request.json();
    const { validSystem, warning } = validate_system(data);

    if (!validSystem) {
      throw new ValidationError("Unable to validate planet", 500);
    }

    Object.keys(validSystem).forEach((key: string) => {
      if (!(key in systemToEdit)) {
        delete validSystem[key as keyof SystemNoId];
      }
    });

    const result = await collection.updateOne({ _id }, { $set: validSystem });

    if (result.matchedCount < 1) {
      throw new ValidationError("Unable to find system to edit", 500);
    }

    if (result.modifiedCount < 1) {
      return NextResponse.json({ msg: "System unchanged", warn: true });
    }

    if (warning && warning !== "") {
      return NextResponse.json({ msg: warning, warn: true });
    }

    return NextResponse.json({
      msg: `Successfully edited planet ${validSystem.name}`,
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
  const { id } = await params;
  const _id = new ObjectId(id);

  const collection = client.db("NMSP").collection("systems");
  const system = await collection.findOneAndDelete(
    { _id },
    {
      projection: { name: 1 },
    },
  );

  if (!system) {
    return NextResponse.json({ error: "Unable to delete system" }, { status: 500 });
  }

  return NextResponse.json({
    msg: `Successfully deleted system ${system.name}`,
  });
}
