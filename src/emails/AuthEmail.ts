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
  static sendRecoverPasswordMail = async (user: EmailType) => {
      const email = await transport.sendMail({
      from: "CashTracker <admin@cashtracker.com>",
      to: user.email,
      subject: "CashTracker - Recover password",
      html: `
        <p>Hello, ${user.name}. Have you tried recover your password?</p>
        <p>If you dont want recover your password ignore this email</p>
        <p>If you want recover your password click below</p>
        <a href="#">Recover password</a>
        <p>Use this code: <b>${user.token}</b></p>
      `
    })
    console.log("Message sended", email.messageId)
  }
}