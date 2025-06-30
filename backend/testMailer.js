  import nodemailer from "nodemailer";
  import dotenv from "dotenv";

  dotenv.config(); // Load variabel .env

  const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com", // Brevo SMTP
      port: 587,
      secure: false, 
      auth: {
          user: process.env.SMTP_USER, // Email dari Brevo
          pass: process.env.SMTP_PASS, // API Key dari Brevo
      },
  });
    
    
    const mailOptions = {
      from: `"Portal Berita" <putraardi431@gmail.com>`,
      to: "rizhalokal55@gmail.com",
      subject: "Reset Password",
      html: `
        <h3>Reset Password</h3>
        <p>Klik link di bawah untuk mereset password Anda:</p>
        <a href="http://localhost:3000/reset-password?token=your-token" target="_blank">
          Reset Password
        </a>
        <p>Link berlaku selama 15 menit.</p>
      `,
    };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Gagal mengirim email:", error);
    } else {
      console.log("📨 Email terkirim:", info.response);
    }
  });
