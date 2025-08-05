import * as nodemailer from 'nodemailer';
import { config } from '../config';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendOTPEmail(email: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Cineora App" <${config.email.auth.user}>`,
        to: email,
        subject: 'Email Verification - OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin: 0;">Cineora</h1>
                <p style="color: #666; margin: 5px 0;">Welcome to Cineora!</p>
              </div>
              
              <h2 style="color: #333; text-align: center;">Email Verification</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Thank you for signing up with Cineora! To complete your registration, please verify your email address using the OTP code below:
              </p>
              
              <div style="background-color: #f0f8ff; padding: 25px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #4CAF50;">
                <p style="margin: 0; color: #333; font-size: 14px; margin-bottom: 10px;">Your verification code is:</p>
                <div style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  ⚠️ <strong>Important:</strong> This OTP will expire in <strong>5 minutes</strong>. Please enter it soon to verify your account.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.5;">
                If you didn't create an account with Cineora, please ignore this email or contact our support team.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <div style="text-align: center; color: #999; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Cineora. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
              </div>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // NEW: KYC Request Submitted Email
  async sendKYCSubmittedEmail(email: string, ownerName: string, requestId: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Cineora App" <${config.email.auth.user}>`,
        to: email,
        subject: 'KYC Request Submitted Successfully',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin: 0;">Cineora</h1>
                <p style="color: #666; margin: 5px 0;">Cinema Owner Portal</p>
              </div>
              
              <h2 style="color: #333; text-align: center;">KYC Request Submitted</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Dear ${ownerName},
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Thank you for submitting your KYC (Know Your Customer) request to become a cinema owner on Cineora platform.
              </p>
              
              <div style="background-color: #e8f5e8; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px solid #4CAF50;">
                <div style="color: #4CAF50; font-size: 48px; margin-bottom: 10px;">✓</div>
                <p style="margin: 0; color: #2e7d32; font-size: 18px; font-weight: bold;">Request Submitted Successfully!</p>
                <p style="margin: 10px 0 0 0; color: #388e3c; font-size: 14px;">Request ID: <strong>${requestId}</strong></p>
              </div>
              
              <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1976d2; margin: 0 0 15px 0;">What happens next?</h3>
                <ul style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li>Our team will review your submitted documents</li>
                  <li>Verification process typically takes 2-3 business days</li>
                  <li>You will receive an email notification once the review is complete</li>
                  <li>If approved, your owner account will be created with login credentials</li>
                </ul>
              </div>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  📧 <strong>Keep this email for your records.</strong> You can use the Request ID to track your application status.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.5;">
                If you have any questions or need assistance, please don't hesitate to contact our support team.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <div style="text-align: center; color: #999; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Cineora. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
              </div>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('KYC submitted email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('KYC submitted email sending failed:', error);
      return false;
    }
  }

  // NEW: KYC Request Rejected Email
  async sendKYCRejectedEmail(email: string, ownerName: string, rejectionReason: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Cineora App" <${config.email.auth.user}>`,
        to: email,
        subject: 'KYC Request Update - Action Required',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin: 0;">Cineora</h1>
                <p style="color: #666; margin: 5px 0;">Cinema Owner Portal</p>
              </div>
              
              <h2 style="color: #d32f2f; text-align: center;">KYC Request Update</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Dear ${ownerName},
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Thank you for your interest in becoming a cinema owner on the Cineora platform. After careful review of your submitted documents, we need to inform you about your application status.
              </p>
              
              <div style="background-color: #ffebee; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px solid #f44336;">
                <div style="color: #f44336; font-size: 48px; margin-bottom: 10px;">⚠</div>
                <p style="margin: 0; color: #c62828; font-size: 18px; font-weight: bold;">Application Requires Attention</p>
              </div>
              
              <div style="background-color: #ffcdd2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #d32f2f; margin: 0 0 15px 0;">Reason for Review:</h3>
                <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
                  ${rejectionReason}
                </p>
              </div>
              
              <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1976d2; margin: 0 0 15px 0;">What you can do:</h3>
                <ul style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li>Review the feedback provided above</li>
                  <li>Prepare the required documents or corrections</li>
                  <li>Submit a new application with the updated information</li>
                  <li>Contact our support team if you need assistance</li>
                </ul>
              </div>
              
              <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  💡 <strong>Tip:</strong> Ensure all documents are clear, valid, and match the information provided in your application.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.5;">
                We appreciate your understanding and look forward to your updated application. Our support team is available if you need any clarification.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <div style="text-align: center; color: #999; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Cineora. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
              </div>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('KYC rejected email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('KYC rejected email sending failed:', error);
      return false;
    }
  }

  // NEW: Owner Account Created Email with Random Password
  async sendOwnerWelcomeEmail(email: string, ownerName: string, tempPassword: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Cineora App" <${config.email.auth.user}>`,
        to: email,
        subject: 'Welcome to Cineora - Your Owner Account is Ready!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin: 0;">Cineora</h1>
                <p style="color: #666; margin: 5px 0;">Cinema Owner Portal</p>
              </div>
              
              <h2 style="color: #4CAF50; text-align: center;">🎉 Welcome to Cineora!</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Dear ${ownerName},
              </p>
              
              <p style="color: #666; font-size: 16px; line-height: 1.5;">
                Congratulations! Your KYC application has been approved and your cinema owner account has been successfully created.
              </p>
              
              <div style="background-color: #e8f5e8; padding: 20px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px solid #4CAF50;">
                <div style="color: #4CAF50; font-size: 48px; margin-bottom: 10px;">✅</div>
                <p style="margin: 0; color: #2e7d32; font-size: 18px; font-weight: bold;">Account Created Successfully!</p>
              </div>
              
              <div style="background-color: #f0f8ff; padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #2196F3;">
                <h3 style="color: #1976d2; margin: 0 0 20px 0; text-align: center;">Your Login Credentials</h3>
                <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                  <p style="margin: 0; color: #333; font-size: 14px;"><strong>Email:</strong> ${email}</p>
                </div>
                <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                  <p style="margin: 0; color: #333; font-size: 14px;"><strong>Temporary Password:</strong></p>
                  <div style="font-size: 24px; font-weight: bold; color: #1976d2; letter-spacing: 2px; font-family: 'Courier New', monospace; text-align: center; margin: 10px 0;">
                    ${tempPassword}
                  </div>
                </div>
              </div>
              
              <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  🔒 <strong>Important Security Notice:</strong> This is a temporary password. For your account security, please change this password immediately after your first login.
                </p>
              </div>
              
              <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1976d2; margin: 0 0 15px 0;">Getting Started:</h3>
                <ul style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li>Log in to your owner dashboard using the credentials above</li>
                  <li>Change your password to something secure and memorable</li>
                  <li>Complete your profile setup</li>
                  <li>Add your cinema listings and start managing bookings</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="#" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Login to Dashboard
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.5;">
                Welcome to the Cineora family! We're excited to have you on board and look forward to helping you manage your cinema business successfully.
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <div style="text-align: center; color: #999; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Cineora. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
              </div>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Owner welcome email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Owner welcome email sending failed:', error);
      return false;
    }
  }
}
