import { transporter, mailOptions } from '@/config/nodemailer';
import moment from "moment";

const generateEmailContent = ({ name, email, phoneNumber, stateOfOrigin, lga, subject, file, stage, requestId, message }) => {
    let emailSubject = '';
    let emailText = '';
    let emailHTML = '';

    const fullFileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/storage/v1/object/public/${file}`;
    const encodedFileUrl = encodeURI(fullFileUrl);

    switch (stage) {
        case 'Email Confirmation':
            emailSubject = `Confirm Your Email Address`;
            emailText = `Dear ${name},\n\nPlease confirm your email address by clicking the following link: ${process.env.NEXT_PUBLIC_CONFIRMATION_URL}?requestId=${requestId}&stage=Verifying\n\nRegards,\nHumAngle FOI`;
            emailHTML = `
                <div style="font-family: Arial, sans-serif;">
                    <div style="background-color: #f4f4f4; padding: 20px;">
                        <h2 style="color: #333; margin-bottom: 30px;">Confirm Your Email Address</h2>
                        <p style="margin-bottom: 20px;">Dear ${name},</p>
                        <p style="margin-bottom: 10px;">Please confirm your email address by clicking the following link:</p>
                        <p style="margin-bottom: 10px;"><a href="${process.env.NEXT_PUBLIC_CONFIRMATION_URL}?requestId=${requestId}">Confirm Email</a></p>
                        <hr style="margin: 25px 0; border: 0; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #888;">This email was generated from the FOI website.</p>
                    </div>
                </div>
            `;
            break;
        case 'Verifying':
            emailSubject = `Request Submitted: Request ID ${requestId}`;
            emailText = `Dear ${name},\n\nYour FOI request has been submitted successfully. Your request ID is ${requestId}. Your resquest is in the ${stage} stage. Once it is verified, we will let you know.\n\nDetails:\nName: ${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nState of Origin: ${stateOfOrigin}\nLGA: ${lga}\n\nSubject: ${subject}\nDocument: ${encodedFileUrl}\n\nRegards,\nHumAngle FOI`;
            emailHTML = `
                <div style="font-family: Arial, sans-serif;">
                    <div style="background-color: #f4f4f4; padding: 20px;">
                        <h2 style="color: #333; margin-bottom: 30px;">Request Submitted</h2>
                        <p style="margin-bottom: 20px;">Dear ${name},</p>
                        <p style="margin-bottom: 10px;">Your FOI request has been submitted successfully. Your request ID is ${requestId}. Your resquest is in the ${stage} stage. Once it is verified, we will let you know.</p>
                        <p style="margin-top: 40px; margin-bottom: 10px;"><strong>Details:</strong></p>
                        <p style="margin-bottom: 10px;"><strong>Name:</strong> ${name}</p>
                        <p style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
                        <p style="margin-bottom: 10px;"><strong>Phone Number:</strong> ${phoneNumber}</p>
                        <p style="margin-bottom: 10px;"><strong>State of Origin:</strong> ${stateOfOrigin}</p>
                        <p style="margin-bottom: 10px;"><strong>LGA:</strong> ${lga}</p>
                        <p style="margin-top: 40px; margin-bottom: 10px;"><strong>Subject:</strong> ${subject}</p>
                        <p style="margin-bottom: 10px;"><strong>Document:</strong> <a href="${encodedFileUrl}">${fullFileUrl}</a></p>
                        <hr style="margin: 25px 0; border: 0; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #888;">This email was generated from the FOI website.</p>
                    </div>
                </div>
            `;
            break;
        case 'Rejected':
            emailSubject = `Request Rejected: Request ID ${requestId}`;
            emailText = `Dear ${name},\n\nYour FOI request with request ID ${requestId} and subject; ${subject} has been rejected. The reason for rejection is because it did not meet our guidelines. To learn more about it, visit our FAQ page.\n\nRegards,\nHumAngle FOI`;
            emailHTML = `
                <div style="font-family: Arial, sans-serif;">
                    <div style="background-color: #f4f4f4; padding: 20px;">
                        <h2 style="color: #333; margin-bottom: 30px;">Request Rejected</h2>
                        <p style="margin-bottom: 20px;">Dear ${name},</p>
                        <p style="margin-bottom: 10px;">Your FOI request with request ID ${requestId} and subject; ${subject} has been rejected. The reason for rejection is because it did not meet our guidelines. To learn more about it, visit our FAQ page.</p>
                        <hr style="margin: 25px 0; border: 0; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #888;">This email was generated from the FOI website.</p>
                    </div>
                </div>
            `;
            break;
        case 'Processing':
            emailSubject = `Request Processing: Request ID ${requestId}`;
            emailText = `Dear ${name},\n\nYour FOI request with request ID ${requestId} and subject; ${subject} is currently in the processing stage. What this means is that we have reviewed it and sent it to the respective organization for feedback. We will keep you updated on the progress.\n\nRegards,\nHumAngle FOI`;
            emailHTML = `
                <div style="font-family: Arial, sans-serif;">
                    <div style="background-color: #f4f4f4; padding: 20px;">
                        <h2 style="color: #333; margin-bottom: 30px;">Request Processing</h2>
                        <p style="margin-bottom: 20px;">Dear ${name},</p>
                        <p style="margin-bottom: 10px;">Your FOI request with request ID ${requestId} and subject; ${subject} is currently in the processing stage. What this means is that we have reviewed it and sent it to the respective organization for feedback. We will keep you updated on the progress.</p>
                        <hr style="margin: 25px 0; border: 0; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #888;">This email was generated from the FOI website.</p>
                    </div>
                </div>
            `;
            break;
        case 'Responded':
            emailSubject = `Request Responded: Request ID ${requestId}`;
            emailText = `Dear ${name},\n\nYour FOI request with request ID ${requestId} and subject; ${subject} has been responded to. We will contact you on how to share the response with you.\n\nRegards,\nHumAngle FOI`;
            emailHTML = `
                <div style="font-family: Arial, sans-serif;">
                    <div style="background-color: #f4f4f4; padding: 20px;">
                        <h2 style="color: #333; margin-bottom: 30px;">Request Responded</h2>
                        <p style="margin-bottom: 20px;">Dear ${name},</p>
                        <p style="margin-bottom: 10px;">Your FOI request with request ID ${requestId} and subject; ${subject} has been responded to. We will contact you on how to share the response with you.</p>
                        <hr style="margin: 25px 0; border: 0; border-top: 1px solid #ddd;">
                        <p style="font-size: 12px; color: #888;">This email was generated from the FOI website.</p>
                    </div>
                </div>
            `;
            break;
        default:
            break;
    }

    return { subject: emailSubject, text: emailText, html: emailHTML };
};

export async function POST(req) {
    try {
        const body = await req.json();
        console.log(body);

        // Send email
        const emailContent = generateEmailContent(body);

        // Check if email content is empty
        if (!emailContent.subject || !emailContent.text || !emailContent.html) {
            return new Response(JSON.stringify({ message: 'No email content to send' }), { status: 200 });
        }

        const mailOptionsWithContent = {
            ...mailOptions,
            ...emailContent,
            to: [
                body.email,
                process.env.CONTACT_EMAIL_RECIPIENT,
            ],
            subject: emailContent.subject || `New message from ${body.name} - ${moment().format('MMMM Do YYYY, h:mm:ss a')}`,
        };

        await transporter.sendMail(mailOptionsWithContent);

        return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
    } catch (error) {
        console.error('An error occurred during email sending:', error);

        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
};
