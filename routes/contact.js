const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/contact
router.post("/", async (req, res) => {
  const { email, phone, message } = req.body;

  if (!email || !phone || !message) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use App Password here!
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // or your receiving email
      subject: "New Contact Form Message",
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
