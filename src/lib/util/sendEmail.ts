import * as nodemailer from "nodemailer";
import { SendMailOptions } from "nodemailer";
import emailConfig from "../../config/email";

export default async (email: string, title: string, content: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { ...emailConfig }
  });

  const sendMailOptions: SendMailOptions = {
    from: emailConfig.user,
    to: email,
    subject: title,
    text: content
  };

  await transporter.sendMail(sendMailOptions);
};
