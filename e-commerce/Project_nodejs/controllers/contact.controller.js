const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "Vothanarern@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "gigy tbom hquw ofmi",
  },
});

const addContact = async (req, res) => {
  try {
    const { emailUser, message, name } = req.body;

    // Validate inputs
    if (!emailUser || !message) {
      return res.status(400).json({
        status: "fail",
        message: "Email and message are required",
      });
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || emailUser,
      to: process.env.EMAIL_ADMIN || "vothanarern@gmail.com",
      replyTo: emailUser,
      subject: "New Contact Form Submission" + name,
      text: `From: ${emailUser}\n\nMessage:\n${message}`,
      html: `<p><strong>From:</strong> ${emailUser}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    console.log("Message sent: %s", info.messageId);

    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (err) {
    console.error("Error while sending mail:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to send email",
      error: err.message,
    });
  }
};

module.exports = { addContact };
