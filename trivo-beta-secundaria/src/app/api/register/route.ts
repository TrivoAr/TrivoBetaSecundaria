// app/api/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password, firstname, lastname, rol, telnumber } = await request.json();

    // Validaciones básicas
    if (!email || !password || !firstname || !lastname || !rol) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const userFound = await User.findOne({ email });
    if (userFound) return NextResponse.json({ message: "Email already exists" }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 12);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstname)}&length=1&background=random&color=fff&size=128`;

    const user = new User({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      imagen: avatarUrl,
      rol,
      telnumber,
    });

    const savedUser = await user.save();

    return NextResponse.json(
      {
        email: savedUser.email,
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        createdAt: savedUser.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Duplicate key (race condition)
    if (error.code === 11000) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    console.error("Register error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
