import nodemailer from 'nodemailer';

type WelcomeEmailOptions = {
    name: string;
    email: string;
};

function getWelcomeEmailTemplate(name: string): string {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="color: #4A5568; text-align: center;">Welcome to ID Batcher!</h1>
          <p>Hi ${name},</p>
          <p>We are thrilled to have you on board. Your account has been successfully created by an administrator.</p>
          <p>You can now log in to your account and start processing your ID cards. If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br/>The ID Batcher Team</p>
        </div>
      </div>
    `;
}

export async function sendWelcomeEmail({ name, email }: WelcomeEmailOptions): Promise<void> {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        to: email,
        subject: 'Welcome to ID Batcher!',
        html: getWelcomeEmailTemplate(name),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send welcome email to ${email}:`, error);
        // In a production app, you might want to handle this more gracefully
        // For now, we just log the error. The user creation shouldn't fail because of this.
    }
}
