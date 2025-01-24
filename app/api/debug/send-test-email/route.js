import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "../../../../lib/sendEmail";

export async function GET(req) {
    try {
        const testEmail = "waltwise@pm.me"; // Replace with your email
        console.log("📨 [DEBUG] Sending test welcome email to:", testEmail);

        await sendWelcomeEmail(testEmail, "Test User");

        return NextResponse.json({ message: "Test email sent!" }, { status: 200 });
    } catch (error) {
        console.error("🚨 [ERROR] Test email failed:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
