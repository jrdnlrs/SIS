const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, service, message } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !service) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await resend.emails.send({
      from: process.env.CONTACT_SENDER,
      to: process.env.CONTACT_RECEIVER,
      replyTo: email,
      subject: `New Quote Request — ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1117; color: #e8eaf0; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #C98A2E, #9a6018); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; color: #fff; letter-spacing: 2px; text-transform: uppercase;">New Quote Request</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Supreme Infotech Solutions</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #7a8499; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 140px;">Full Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #e8eaf0; font-size: 15px;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #7a8499; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #e8eaf0; font-size: 15px;"><a href="mailto:${email}" style="color: #C98A2E;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #7a8499; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #e8eaf0; font-size: 15px;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #7a8499; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Service</td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
                  <span style="background: rgba(201,138,46,0.15); color: #C98A2E; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${service}</span>
                </td>
              </tr>
            </table>

            ${message ? `
            <div style="margin-top: 24px;">
              <p style="color: #7a8499; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Message</p>
              <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px; color: #e8eaf0; font-size: 14px; line-height: 1.7;">${message}</div>
            </div>
            ` : ''}

            <div style="margin-top: 32px; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #C98A2E, #9a6018); color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">Reply to ${firstName}</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
            <p style="margin: 0; color: #7a8499; font-size: 12px;">Supreme Infotech Solutions · supremeinfotech.com</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Quote email error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}