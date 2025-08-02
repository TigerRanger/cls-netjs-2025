import { NextResponse } from "next/server";

const captchaAnswers: Record<string, string> = {}; // Ideally use a real store

export async function POST(request: Request) {
  try {
    const { captchaId, captchaAnswer } = await request.json();

    // Validate CAPTCHA
    if (captchaAnswers[captchaId] && captchaAnswers[captchaId] === captchaAnswer) {
      delete captchaAnswers[captchaId]; // Clean up used CAPTCHA
      return NextResponse.json({ success: true, message: "CAPTCHA validated successfully!" });
    }

    return NextResponse.json({ error: "Invalid CAPTCHA. Please try again." }, { status: 400 });
  } catch (error) {
    console.error("CAPTCHA validation error:", error);
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }
}
