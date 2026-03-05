const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const nodemailer = require("nodemailer");

/**
 * Sends an email when a new contact form submission is added to Firestore.
 * Configure via .env in functions/:
 *
 *   MAIL_TO=your@email.com
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=587
 *   SMTP_USER=your@gmail.com
 *
 * For SMTP_PASS (App Password), use:
 *   firebase functions:secrets:set SMTP_PASS
 *
 * For Gmail: Use an App Password (not your regular password).
 * Create one at: https://myaccount.google.com/apppasswords
 */
exports.sendContactEmail = onDocumentCreated(
  "contactMessages/{docId}",
  async (event) => {
    logger.info("sendContactEmail triggered", {
      docId: event.params?.docId,
    });

    const snap = event.data;
    if (!snap) {
      logger.warn("No data in event");
      return null;
    }

    const data = snap.data();
    const { name = "", email = "", message = "" } = data;

    logger.info("Contact form payload received", {
      name,
      email,
      messageLength: message ? String(message).length : 0,
    });

    const to = process.env.MAIL_TO || "";
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER || "";
    const pass = process.env.SMTP_PASS || "";

    logger.info("Email configuration loaded", {
      hasTo: !!to,
      host,
      port,
      hasUser: !!user,
      hasPass: !!pass,
    });

    if (!to || !user || !pass) {
      logger.error("Email not configured. Set MAIL_TO, SMTP_USER in .env and run: firebase functions:secrets:set SMTP_PASS");
      return null;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    try {
      await transporter.verify();
      logger.info("SMTP transporter verification succeeded");
    } catch (verifyErr) {
      logger.error("SMTP transporter verification FAILED", {
        message: verifyErr.message,
        stack: verifyErr.stack,
      });
      throw verifyErr;
    }

    const mailOptions = {
      from: `"Kamala-Deville Website" <${user}>`,
      to,
      subject: `Contact form: ${name} (${email})`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
    };

    try {
      logger.info("Attempting to send contact form email", {
        to,
        from: user,
        subject: mailOptions.subject,
      });
      const info = await transporter.sendMail(mailOptions);
      logger.info("Contact form email sent successfully", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });
    } catch (err) {
      logger.error("Failed to send contact email", {
        message: err.message,
        stack: err.stack,
        code: err.code,
        command: err.command,
      });
      throw err;
    }

    return null;
  }
);

function escapeHtml(text) {
  if (!text) return "";
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(text).replace(/[&<>"']/g, (c) => map[c]);
}
