const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1)create transporter
  const transporter = nodemailer.createTransport({
    /* service: 'Gmail', */
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //activate in gmail 'less secure app' option //sendgrid and mailgun are better email options for prod apps
  });

  //2) define the email options
  const mailOptions = {
    from: 'Manish <manish@manish.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };

  //3) actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
