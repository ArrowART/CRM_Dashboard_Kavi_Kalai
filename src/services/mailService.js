import nodemailer from 'nodemailer'
const sendMail = (data, text) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PW
      },
      tls: {
        rejectUnauthorized: false
      }
    })
    const otp = Math.floor(1000 + Math.random() * 9000)
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: data.Email,
      subject: 'DMark app OTP',
      text: text + otp
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error)
      } else {
        console.log('Email Sent')
        resolve({ status: 'Email Sent', otp })
      }
    })
  })
}
export default sendMail
