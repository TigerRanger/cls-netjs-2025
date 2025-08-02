// src/app/api/captcha/route.ts
import { createCanvas } from "canvas";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  const canvas = createCanvas(150, 40); // Picture size
  const ctx = canvas.getContext("2d");

  // Background color
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, 150, 40);

  // Generate random CAPTCHA text
  const text = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Draw CAPTCHA text
  ctx.font = "20px Verdana";
  ctx.fillStyle = "#339";
  ctx.fillText(text, 25, 30);

  // Draw random lines
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 150, Math.random() * 50);
    ctx.lineTo(Math.random() * 150, Math.random() * 50);
    ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
    ctx.lineWidth = Math.random() * 2 + 1;
    ctx.stroke();
  }

  // Random dots for noise
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 200;
    const y = Math.random() * 50;
    ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  const token = crypto.createHash("sha256").update(text).digest("hex");
  const image = canvas.toDataURL();

  return NextResponse.json({ image, token });
}
