import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to_email, subject, message }) => {
  try {
    await transporter.sendMail({
      from: `"TalentMatch AI" <${process.env.EMAIL_USER}>`,
      to: to_email,
      subject,
      text: message,
    });

    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Email error ❌", err);
  }
};