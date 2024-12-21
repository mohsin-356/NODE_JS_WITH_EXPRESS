const nodemailer = require('nodemailer');
const sendEmail=async(option)=>{
    // Create a transporter object
    // Looking to send emails in production? Check out our Email API/SMTP product!
const transporter = nodemailer
  .createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  });
  //DEFINE MAIL OPTIONS
  const mailOptions = {
    from: process.env.EMAIL_FROM, // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.message, // plain text body
  };
  // Send email
  await transporter.sendMail(mailOptions);
};
module.exports=sendEmail;