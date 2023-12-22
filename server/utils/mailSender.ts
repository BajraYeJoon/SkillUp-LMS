import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

import dotenv from "dotenv";

dotenv.config();

interface MailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

// Mail sending function
const mailSend = async (options: MailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "0"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  //Get the path of the template
  const templatePath = path.join(__dirname, `../mail/`, template);

  //Render the template
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default mailSend;
