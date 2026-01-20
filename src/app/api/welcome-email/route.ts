import nodemailer from "nodemailer";

// read env variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // use TLS, not SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(to: string, name: string) {
  await transporter.sendMail({
    from: `"AnubisPaws" <${process.env.SMTP_USER}>`,
    to,
    subject: `Welcome to AnubisPaws, ${name}!`,
    text: `Hi ${name}, Welcome to AnubisPaws! We are thrilled to have you join our pet-loving community.`,
    html: `<h1>Welcome, ${name}!</h1><p>We are thrilled to have you join AnubisPaws. Enjoy exploring our platform!</p>`,
  });
}
