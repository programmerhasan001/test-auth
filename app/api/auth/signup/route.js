import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { signToken } from "@/app/lib/jwt";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const token = signToken({ userId: user._id, email: user?.email });

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
