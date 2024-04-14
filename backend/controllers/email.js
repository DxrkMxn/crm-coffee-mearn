const cron = require('node-cron');
const nodemailer = require('nodemailer');
const EmailSchema = require("../models/Email");
const clients = require("../models/Client");
const errorHandler = require("../utils/errorHandler");

module.exports.getAll = async (req, res) => {
  try {
    const emails = await EmailSchema.find({});
    res.status(200).json(emails);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.getById = async (req, res) => {
  try {
    const email = await EmailSchema.findById(req.params.id);
    res.status(200).json(email);
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.create = async (req, res) => {
  try {
    const { name, subject, sendDate, templateUrl } = req.body;

    const email = new EmailSchema({
      name,
      subject,
      sendDate,
      templateUrl, 
    });

    await email.save();

    res.status(201).json(email);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.update = async (req, res) => {
  try {
    const updatedEmail = await EmailSchema.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body
        },
      },
      { new: true }
    );
    res.status(200).json(updatedEmail);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.remove = async (req, res) => {
  try {
    await EmailSchema.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Email deleted." });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.sendEmailToAll = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.crm-coffee.com',
      port: 587,
      secure: false,
      auth: {
        user: 'admin@crm-coffee.com',
        pass: '123456',
      },
    });

    const currentDate = new Date();

    const emailSchemas = await EmailSchema.find({ sendDate: currentDate });

    for (const emailSchema of emailSchemas) {
      const arrayMails = await clients.find({});

      for (const usr of arrayMails) {
        const mailOptions = {
          from: 'admin@crm-coffee.com',
          to: usr.email,
          subject: emailSchema.subject,
          html: emailSchema.templateUrl,
        };

        await transporter.sendMail(mailOptions);
      }
    }

    res.status(200).json({ message: "Emails sent successfully." });
  } catch (error) {
    errorHandler(res, error);
  }
};

cron.schedule('0 0 * * *', async () => {
  try {
    const currentDate = new Date();

    const emailSchemas = await EmailSchema.find({ sendDate: currentDate });

    emailSchemas.forEach(async (emailSchema) => {
      const transporter = nodemailer.createTransport({
      });

      const mailOptions = {
      };

      await transporter.sendMail(mailOptions);
    });

  } catch (error) {
    console.error('Error en la tarea periódica:', error);
  }
});