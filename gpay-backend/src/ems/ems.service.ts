import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmsService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  async sendTransactionEmail(recipientEmail: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: 'your-email@gmail.com', // Sender address
      to: recipientEmail,  // Receiver address
      subject,             // Email Subject
      text,                // Email body
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Send OTP email
  async sendOtpEmailForTransaction(email: string, otp: string): Promise<void> {
    const subject = 'OTP for Transaction Verification';
    const text = `Your OTP for the transaction is: ${otp}. It is valid for 5 minutes.`;

    await this.sendTransactionEmail(email, subject, text);
  }

  // Send a confirmation email on transaction completion
  async sendTransactionSuccessEmail(email: string, transactionId: number, amount: number): Promise<void> {
    const subject = 'Transaction Successful';
    const text = `Your transaction of ${amount} was successful. Transaction ID: ${transactionId}.`;

    await this.sendTransactionEmail(email, subject, text);
  }
  async sendOtpEmail(to: string, otp: string) {
    const mailOptions = {
      from: `"FlexiPay" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your OTP Code',
      html: `
        <h3>OTP Verification</h3>
        <p>Your OTP code is: <b>${otp}</b></p>
        <p>This code will expire in 5 minutes.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      Logger.log(`OTP email sent to ${to}`);
    } catch (err) {
      Logger.error(`Error sending OTP email to ${to}`, err);
      throw err;
    }
  }
}
