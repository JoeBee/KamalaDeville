const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const nodemailer = require("nodemailer");

/**
 * Sends an email when a new contact form submission is added to Firestore.
 * Configure SMTP via Firebase config before deploying:
 *
 *   firebase functions:config:set mail.to="your@email.com"
 *   firebase functions:config:set smtp.host="smtp.gmail.com"
 *   firebase functions:config:set smtp.port="587"
 *   firebase functions:config:set smtp.user="your@gmail.com"
 *   firebase functions:config:set smtp.pass="your-app-password"
 *
 * For Gmail: Use an App Password (not your regular password).
 * Create one at: https://myaccount.google.com/apppasswords
 */
exports.sendContactEmail = onDocumentCreated("contactMessages/{docId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    logger.warn("No data in event");
    return null;
  }

  const data = snap.data();
  const { name = "", email = "", message = "" } = data;

  const functions = require("firebase-functions");
  const cfg = functions.config();
  const to = cfg.mail?.to;
  const host = cfg.smtp?.host || "smtp.gmail.com";
  const port = parseInt(cfg.smtp?.port || "587", 10);
  const user = cfg.smtp?.user;
  const pass = cfg.smtp?.pass;

  if (!to || !user || !pass) {
    logger.error("Email not configured. Set mail.to, smtp.user, and smtp.pass via firebase functions:config:set");
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
    await transporter.sendMail(mailOptions);
    logger.info("Contact form email sent successfully");
  } catch (err) {
    logger.error("Failed to send contact email:", err);
    throw err;
  }

  return null;
});

function escapeHtml(text) {
  if (!text) return "";
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(text).replace(/[&<>"']/g, (c) => map[c]);
}
