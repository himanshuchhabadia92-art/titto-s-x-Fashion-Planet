import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_SMTP_USER,
    pass: process.env.GOOGLE_SMTP_PASS, // Use App Password if 2FA is enabled
  },
});

export const smtpConfigured = () => Boolean(process.env.GOOGLE_SMTP_USER && process.env.GOOGLE_SMTP_PASS);

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!smtpConfigured()) {
    // No SMTP credentials yet: print the email instead so flows can be tested locally.
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`[email not sent: SMTP not configured] to=${to} subject="${subject}" body="${text}"`);
    return { success: false, error: 'SMTP not configured' };
  }
  try {
    const info = await transporter.sendMail({
      from: `"Titto's X Fashion Planet" <${process.env.GOOGLE_SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
