import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const from = `${process.env.EMAIL_SENDER_NAME}  <${process.env.EMAIL_SENDER_USERNAME}>`;
    const mailOptions = {
        from,
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};
