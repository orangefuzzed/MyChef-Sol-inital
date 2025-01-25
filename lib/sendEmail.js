import { MailerSend, Sender, Recipient, EmailParams } from 'mailersend';
import 'dotenv/config';

// Initialize MailerSend
const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY || '', 
});

export async function sendWelcomeEmail(userEmail = "Dishcovery User") {
    try {
        console.log("📨 [DEBUG] Sending Welcome Email to:", userEmail);

        const sender = new Sender("support@dishcoveryai.com", "Dishcovery Support");

        const emailParams = new EmailParams()
            .setFrom(sender)
            .setTo([new Recipient(userEmail)])
            .setSubject("🎉 Welcome to Dishcovery!")
            .setHtml(`
                <div style="font-family: Montserrat, sans-serif; text-align: center; padding: 20px;">
                <img src="https://dishcoveryai.app/images/dishcovery-full-logo_sm_02.png" alt="Dishcovery" style="width: 200px; margin-bottom: 20px;">
                    <h2 style="color: #00a39e; font-size: 24px;">Welcome to Dishcovery, ${userEmail}!</h2>
                    <p style="color: #333;">We're thrilled to have you join our community of food lovers and home chefs.</p>
                    <p style="color: #333;">Start exploring recipes, planning meals, and creating shopping lists effortlessly!</p>
                    <p style="color: #333;">If you haven't installed the app yet, please choose your device to install the app:</p>
                        <div className="flex space-x-4">
                            <a
                                href="https://dishcoveryai.app/dishcovery-install-iOS.html"
                                style="display: inline-block; background: #00a39e; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 8px;"
                            >
                                Apple iOS
                            </a>
                            <a
                                href="https://dishcoveryai.app/dishcovery-install-android.html"
                                style="display: inline-block; background: #00a39e; margin-left: 10px; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 8px;"
                            >
                                Android
                            </a>
                        </div>                        
                    <p style="font-size: 12px; color: #777; margin-top: 20px;">
                        Need help? Reach out to us at support@dishcoveryai.com.
                    </p>
                </div>
            `)
            .setText(`Welcome to Dishcovery, ${userEmail}!\n\nStart exploring the app, getting fantastic, unique recipes and join the commmunity!`);

        await mailerSend.email.send(emailParams);
        console.log("✅ [SUCCESS] Welcome Email Sent!");

    } catch (error) {
        console.error("🚨 [ERROR] Failed to send welcome email:", error);
    }
}
