import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { sendEmail } from "@/app/lib/email";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save();
    console.log("hello", "user");

    // TODO: Send email with reset token
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`,
      html: `
        <h1>Password Reset Request</h1>
        <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    });

    return NextResponse.json({ message: "Password reset email sent" });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
