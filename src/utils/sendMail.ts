import nodeMailer from 'nodemailer'

// Models: User
import '@/models/UserModel'

// SEND MAIL CORE
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_MAIL,
    pass: process.env.MAIL_APP_PASSWORD,
  },
})

// Send Mail Core
export async function sendMail(to: string | string[], subject: string, html: string) {
  console.log('- Send Mail -')

  await transporter.sendMail({
    from: 'EFEL <no-reply@efel.vercel.app>',
    to: to,
    subject: subject,
    html: html,
  })
}
