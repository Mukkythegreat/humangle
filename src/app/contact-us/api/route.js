import { transporter, mailOptions } from '@/config/nodemailer';
import moment from "moment";

const generateEmailContent = ({ name, email, phoneNumber, message }) => ({
    text: `
        Name: ${name}
        Email: ${email}
        Phone Number: ${phoneNumber}
        Message: ${message}
    `,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f4f4f4; padding: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
                <p style="margin-bottom: 10px;"><strong>Name:</strong> ${name}</p>
                <p style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
                <p style="margin-bottom: 10px;"><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p style="margin-bottom: 10px;"><strong>Message:</strong></p>
                <p style="margin-bottom: 20px;">${message}</p>
                <hr style="border: 0; border-top: 1px solid #ddd;">
                <p style="font-size: 12px; color: #888;">This email was generated from the contact form on the FOI website.</p>
            </div>
        </div>
    `,
});

export async function POST(req) {
    try {
        const body = await req.json();
        console.log(body);

        // Send email
        const emailContent = generateEmailContent(body);

        const mailOptionsWithContent = {
            ...mailOptions,
            ...emailContent,
            to: process.env.CONTACT_EMAIL_RECIPIENT,
            subject: `New message from ${body.name} - ${moment().format('MMMM Do YYYY, h:mm:ss a')}`,
        };

        await transporter.sendMail(mailOptionsWithContent);

        return new Response(JSON.stringify({ message: 'Email sent successfully' }, { status: 200 }));
    } catch (error) {
        console.error('An error occurred during email sending:', error);

        return new Response(JSON.stringify({ error: 'Internal server error' }, { status: 500 }));
    }
};