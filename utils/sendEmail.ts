import nodemailer from "nodemailer";

export const sendEmail = async (
  htmlTemplate: string,
  subject: string,
  email: string
): Promise<boolean> => {

    console.log({
        htmlTemplate,
        subject,
        email})
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_EMAIL_ADDRESS,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.APP_EMAIL_ADDRESS,
      to: email,
      subject,
      html: htmlTemplate,
    };

      const result = await transporter.sendMail(mailOptions);
      console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
