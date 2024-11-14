import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Configure the transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: process.env.EMAIL_SERVER_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: "programmermdhasan@gmail.com",
      to: "programmerhasan.bd@gmail.com",
      subject: "Hello from Gmail SMTP",
      text: "This is a plain text email body",
      html: "<p>This is an HTML email body</p>",
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
  return NextResponse.json({ msg: "success" });
}
