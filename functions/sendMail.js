var nodemailer = require("nodemailer");
const fs = require("fs");

module.exports = {
  sendMail: function (senderName, senderEmail, recipient, subject, text, html, filename, content) {
    const transporter = nodemailer.createTransport({
      port: 587,
      host: "smtp.ziggo.nl",
      secure: false,
      auth: { user: "vandelftit@ziggo.nl", pass: "5328N9o9!" },
      tls: { rejectUnauthorized: false },
    });

    if (filename && content) {
      var mailOptions = {
        from: senderName + " <" + senderEmail + ">",
        to: recipient,
        subject: subject,
        text: text,
        html: html,
        attachments: [{ filename: filename, content: fs.createReadStream(content) }],
      };
    } else {
      var mailOptions = {
        from: senderName + " <" + senderEmail + ">",
        to: recipient,
        subject: subject,
        text: text,
        html: html,
      };
    }

    transporter.sendMail(mailOptions, function (err, info) {
      console.log(info);
      if (err) console.log(err);
    });
  },
};
