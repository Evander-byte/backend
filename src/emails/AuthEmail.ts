import { transport } from "../config/mails/nodemailer"

type EmailType = {
  name: string
  email: string
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async(user: EmailType) => {
    const email = await transport.sendMail({
      from: "CashTracker <admin@cashtracker.com>",
      to: user.email,
      subject: "CashTracker - Confirm your cuenta",
      html: `
        <p>Hello, ${user.name}. You are created an account in CashTracker</p>
        <p>Go to the link to complete the verification</p>
        <a href="#">Confirm my account</a>
        <p>Use this code: <b>${user.token}</b></p>
      `
    })
    console.log("Message sended", email.messageId)
  }
}