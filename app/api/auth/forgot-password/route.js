import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import clientPromise from '../../../../lib/mongodb';
import { MailerSend, Sender, Recipient, EmailParams } from 'mailersend';
import 'dotenv/config';

// Initialize MailerSend with API Key
const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY || '', // Ensuring API key is always a string
});

export async function POST(req) {
    try {
        const { email } = await req.json();
        const client = await clientPromise;
        const db = client.db("recipe-meal-app");

        // Verify user exists
        const user = await db.collection("users").findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "Email not found" }, { status: 404 });
        }

        // Generate password reset token & expiry (valid for 30 min)
        const resetToken = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); 

        // Store reset token in MongoDB
        await db.collection("users").updateOne(
            { email },
            { $set: { resetToken, resetTokenExpires: expiresAt } }
        );

        // Define sender
        const sender = new Sender("support@dishcoveryai.com", "Dishcovery Support");

        // Define email parameters
        const emailParams = new EmailParams()
            .setFrom(sender)
            .setTo([new Recipient(email, "Dishcovery User")])
            .setSubject("Reset Your Dishcovery Password")
            .setHtml(`
                <div style="font-family: Montserrat, sans-serif; text-align: center; padding: 20px;">
                    <img src="https://dishcoveryai.app/images/dishcovery-full-logo_sm_02.png" alt="Dishcovery" style="width: 200px; margin-bottom: 20px;">
                    <h2 style="color: #00a39e;">Reset Your Password</h2>
                    <p style="color: #333;">Click the button below to reset your password.</p>
                    <a href="https://dishcoveryai.app/reset-password?token=${resetToken}" 
                        style="display: inline-block; background: #00a39e; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Reset Password
                    </a>
                    <p style="font-size: 12px; color: #777; margin-top: 20px;">
                        If you did not request this, please ignore this email.
                    </p>
                </div>
            `)
            .setText(`Click here to reset: https://dishcoveryai.app/reset-password?token=${resetToken}`);

        // Send email
        await mailerSend.email.send(emailParams);

        return NextResponse.json({ message: "Reset email sent" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
