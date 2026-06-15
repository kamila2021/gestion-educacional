import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@edumanager.com';
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT || '2525');
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;

    if (host) {
      const config: any = {
        host,
        port,
        secure: port === 465,
      };

      if (user && pass) {
        config.auth = { user, pass };
      }

      this.transporter = nodemailer.createTransport(config);
    } else {
      console.warn('EmailService: No EMAIL_HOST provided. Emails will be logged to the console.');
    }
  }

  async sendInvitationEmail(to: string, institutionName: string, link: string): Promise<void> {
    const subject = `Invitación para unirte a ${institutionName} en EduManager`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2c3e50; text-align: center;">¡Te damos la bienvenida a EduManager!</h2>
        <p>Hola,</p>
        <p>Has sido invitado a formar parte de la institución <strong>${institutionName}</strong> como profesor en la plataforma de gestión académica EduManager.</p>
        <p>Para completar tu registro, configurar tu contraseña y acceder a tu panel de control, por favor haz clic en el siguiente botón:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Completar Registro</a>
        </div>
        <p style="color: #7f8c8d; font-size: 12px; text-align: center;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="color: #3498db; word-break: break-all; text-align: center; font-size: 14px;"><a href="${link}">${link}</a></p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
        <p style="color: #95a5a6; font-size: 12px; text-align: center;">Este enlace es válido por 7 días. Si no has solicitado esta cuenta, puedes ignorar este correo.</p>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: this.fromEmail,
          to,
          subject,
          html,
        });
        console.log(`Email de invitación enviado con éxito a ${to}`);
      } catch (err: any) {
        console.error(`Error al enviar correo vía SMTP a ${to}:`, err.message);
        console.log(`[DESARROLLO - FALLBACK] Enlace de invitación para ${to}: ${link}`);
      }
    } else {
      console.log(`--------------------------------------------------`);
      console.log(`[CONSOLA DE CORREOS - DESARROLLO]`);
      console.log(`Para: ${to}`);
      console.log(`Asunto: ${subject}`);
      console.log(`Enlace de Registro: ${link}`);
      console.log(`--------------------------------------------------`);
    }
  }
}
