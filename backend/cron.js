const Email = require("./models/Email");

require("dotenv").config();
const nodemailer = require("nodemailer");

class CronEmail {
  transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_SECRET,
    },
  });

  constructor() {}

  async sendMail(documents) {
    const emails = [];
    const subject = documents[0].subject;
    const htmlBody = documents[0].htmlBody;
    const arrayMails = await clients.find({});
    for (const document of arrayMails) {
      emails.push(document.email);
    }
    try {
      const sendInformation = await this.transporter.sendMail({
        to: emails,
        subject: subject,
        html: htmlBody,
        attachments: attachments,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

const EmailService = async () => {
  const fecha = new Date();
  try {
    const query = {
      sendDate: {
        $date: {
          $year: fecha.getFullYear,
          $month: fecha.getMonth,
          $day: fecha.getDay,
        },
      },
    };
    const documents = await Email.find(query);
    if (!documents) return "No hay correos para enviar";
    const emailSer = new CronEmail();
    await emailSer.sendMail(documents);
    return `Correos enviados el dia ${fecha}`;
  } catch (error) {
    return error;
  }
};

const cronEmail = EmailService()
module.exports = cronEmail;
