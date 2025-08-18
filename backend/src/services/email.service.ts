import * as nodemailer from "nodemailer";
import { config } from "../config";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
async sendTheaterVerifiedEmail(email: string, theaterName: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"Cineora App" <${config.email.auth.user}>`,
      to: email,
      subject: "Theater Verified Successfully - Cineora",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">Cineora</h1>
              <p style="color: #666; margin: 5px 0;">Theater Management Platform</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background-color: #d4edda; padding: 20px; border-radius: 50%; display: inline-block; margin-bottom: 20px;">
                <span style="font-size: 40px; color: #28a745;">✓</span>
              </div>
              <h2 style="color: #28a745; margin: 0;">Theater Verified Successfully!</h2>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5; text-align: center;">
              Congratulations! Your theater <strong>${theaterName}</strong> has been successfully verified and is now active on our platform.
            </p>
            
            <div style="background-color: #d1ecf1; padding: 20px; margin: 25px 0; border-radius: 8px; border-left: 4px solid #17a2b8;">
              <h3 style="color: #0c5460; margin-top: 0;">What's Next?</h3>
              <ul style="color: #0c5460; margin: 0; padding-left: 20px;">
                <li>Your theater is now visible to customers</li>
                <li>You can start adding movie shows and schedules</li>
                <li>Manage bookings through your dashboard</li>
                <li>Update theater information as needed</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; margin-bottom: 20px;">Ready to get started?</p>
              <div style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Access Your Dashboard
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5; text-align: center;">
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Cineora. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log("Theater verified email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Theater verified email sending failed:", error);
    return false;
  }
}

async sendTheaterRejectedEmail(email: string, theaterName: string, rejectionReason?: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"Cineora App" <${config.email.auth.user}>`,
      to: email,
      subject: "Theater Application Rejected - Cineora",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">Cineora</h1>
              <p style="color: #666; margin: 5px 0;">Theater Management Platform</p>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background-color: #f8d7da; padding: 20px; border-radius: 50%; display: inline-block; margin-bottom: 20px;">
                <span style="font-size: 40px; color: #dc3545;">✗</span>
              </div>
              <h2 style="color: #dc3545; margin: 0;">Theater Application Rejected</h2>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5; text-align: center;">
              We regret to inform you that your theater application for <strong>${theaterName}</strong> has been rejected.
            </p>
            
            ${rejectionReason ? `
              <div style="background-color: #f8d7da; padding: 20px; margin: 25px 0; border-radius: 8px; border-left: 4px solid #dc3545;">
                <h3 style="color: #721c24; margin-top: 0;">Rejection Reason:</h3>
                <p style="color: #721c24; margin: 0; font-size: 14px; line-height: 1.5;">
                  ${rejectionReason}
                </p>
              </div>
            ` : ''}
            
            <div style="background-color: #fff3cd; padding: 20px; margin: 25px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin-top: 0;">Next Steps:</h3>
              <ul style="color: #856404; margin: 0; padding-left: 20px; font-size: 14px;">
                <li>Review the rejection reason carefully</li>
                <li>Address the mentioned concerns</li>
                <li>Resubmit your application with the necessary improvements</li>
                <li>Contact our support team if you need clarification</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #666; margin-bottom: 20px;">Ready to resubmit?</p>
              <div style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Submit New Application
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5; text-align: center;">
              We appreciate your interest in joining Cineora. Please don't hesitate to contact our support team if you have any questions.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Cineora. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log("Theater rejected email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Theater rejected email sending failed:", error);
    return false;
  }
}

  async sendOTPEmail(email: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Cineora App" <${config.email.auth.user}>`,
        to: email,
        subject: "Email Verification - OTP Code",
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
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  }

  async sendKYCSubmittedEmail(
    email: string,
    ownerName: string,
    requestId: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Cineora App" <${config.email.auth.user}>`,
        to: email,
        subject: "KYC Request Submitted Successfully",
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
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("KYC submitted email sending failed:", error);
      return false;
    }
  }
  async sendEmailChangeOTP(
    email: string,
    otp: string,
    oldEmail: string
  ): Promise<boolean> {
    try {
      const expiryMinutes = Math.floor(config.otpExpiry / 1000 / 60);
      const mailOptions = {
        from: `"Cineora Security" <${config.email.auth.user}>`,
        to: email,
        subject: "Confirm your new Cineora email address",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">Cineora</h1>
              <p style="color: #666; margin: 5px 0;">Email Change Verification</p>
            </div>
            
            <h2 style="color: #333; text-align: center;">Confirm Your New Email</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              We received a request to change your Cineora account email from 
              <strong>${oldEmail}</strong> to <strong>${email}</strong>.
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              To confirm this change, please enter the verification code below:
            </p>
            
            <div style="background-color: #f0f8ff; padding: 25px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #4CAF50;">
              <p style="margin: 0; color: #333; font-size: 14px; margin-bottom: 10px;">Your verification code is:</p>
              <div style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                ⚠️ <strong>Important:</strong> This code will expire in <strong>${expiryMinutes} minutes</strong>.
              </p>
            </div>
            
            <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; border-left: 4px solid #f44336; margin: 20px 0;">
              <p style="margin: 0; color: #c62828; font-size: 14px;">
                🔒 <strong>Security Notice:</strong> If you didn't request this email change, please secure your account immediately by changing your password.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              If you didn't request this change, please ignore this email or contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Cineora. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Email change OTP sending failed:", error);
      return false;
    }
  }

  async sendKYCRejectedEmail(
    email: string,
    ownerName: string,
    rejectionReason: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Cineora App" <${config.email.auth.user}>`,
        to: email,
        subject: "KYC Request Update - Action Required",
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
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("KYC rejected email sending failed:", error);
      return false;
    }
  }

  async sendOwnerWelcomeEmail(
    email: string,
    ownerName: string,
    tempPassword: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Cineora App" <${config.email.auth.user}>`,
        to: email,
        subject: "Welcome to Cineora - Your Owner Account is Ready!",
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
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Owner welcome email sending failed:", error);
      return false;
    }
  }
  async sendEmailChangeSuccessNotification(
    newEmail: string,
    oldEmail: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Cineora Security" <${config.email.auth.user}>`,
        to: newEmail,
        subject: "Email Successfully Changed - Cineora Account",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">Cineora</h1>
              <p style="color: #666; margin: 5px 0;">Account Security Update</p>
            </div>
            
            <h2 style="color: #4CAF50; text-align: center;">✅ Email Successfully Changed</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Your Cineora account email has been successfully changed.
            </p>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0; border: 2px solid #4CAF50;">
              <h3 style="color: #2e7d32; margin: 0 0 15px 0; text-align: center;">Email Change Details</h3>
              <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Previous Email:</strong> ${oldEmail}</p>
              </div>
              <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>New Email:</strong> ${newEmail}</p>
              </div>
              <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Changed On:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin: 0 0 15px 0;">✅ What this means:</h3>
              <ul style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Your account is now associated with this new email address</li>
                <li>Future login attempts should use this new email</li>
                <li>All account notifications will be sent to this email</li>
                <li>Your account remains secure and verified</li>
              </ul>
            </div>
            
            <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; border-left: 4px solid #f44336; margin: 20px 0;">
              <p style="margin: 0; color: #c62828; font-size: 14px;">
                🔒 <strong>Security Notice:</strong> If you didn't make this change, please contact our support team immediately to secure your account.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              Thank you for keeping your account information up to date. If you have any questions or concerns, please don't hesitate to contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Cineora. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Email change success notification failed:", error);
      return false;
    }
  }

  async sendPasswordResetOTP(
    email: string,
    otp: string,
    userName: string
  ): Promise<boolean> {
    try {
      const expiryMinutes = Math.floor(config.otpExpiry / 1000 / 60);
      const mailOptions = {
        from: `"Cineora Security" <${config.email.auth.user}>`,
        to: email,
        subject: "Reset Your Cineora Password",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">Cineora</h1>
              <p style="color: #666; margin: 5px 0;">Password Reset Request</p>
            </div>
            
            <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Hello ${userName},
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              We received a request to reset your Cineora account password. To proceed with the password reset, please use the verification code below:
            </p>
            
            <div style="background-color: #f0f8ff; padding: 25px; text-align: center; margin: 25px 0; border-radius: 8px; border: 2px dashed #4CAF50;">
              <p style="margin: 0; color: #333; font-size: 14px; margin-bottom: 10px;">Your password reset code is:</p>
              <div style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                ⚠️ <strong>Important:</strong> This code will expire in <strong>${expiryMinutes} minutes</strong>.
              </p>
            </div>
            
            <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; border-left: 4px solid #f44336; margin: 20px 0;">
              <p style="margin: 0; color: #c62828; font-size: 14px;">
                🔒 <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact our support team to secure your account.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              If you didn't request this password reset, no action is needed on your part.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Cineora. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Password reset OTP sent successfully:", info.messageId);
      return true;
    } catch (error) {
      console.error("Password reset OTP sending failed:", error);
      return false;
    }
  }

  async sendPasswordChangeConfirmation(
    email: string,
    userName: string
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Cineora Security" <${config.email.auth.user}>`,
        to: email,
        subject: "Your Cineora Password Has Been Changed",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin: 0;">Cineora</h1>
              <p style="color: #666; margin: 5px 0;">Password Change Confirmation</p>
            </div>
            
            <h2 style="color: #4CAF50; text-align: center;">✅ Password Successfully Changed</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Hello ${userName},
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Your Cineora account password has been successfully changed.
            </p>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0; border: 2px solid #4CAF50;">
              <div style="text-align: center;">
                <div style="color: #4CAF50; font-size: 48px; margin-bottom: 10px;">🔐</div>
                <p style="margin: 0; color: #2e7d32; font-size: 18px; font-weight: bold;">Password Updated Successfully</p>
                <p style="margin: 10px 0 0 0; color: #388e3c; font-size: 14px;">Changed on: ${new Date().toLocaleString()}</p>
              </div>
            </div>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin: 0 0 15px 0;">✅ What this means:</h3>
              <ul style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Your account is now secured with your new password</li>
                <li>Please use your new password for future logins</li>
                <li>Your account remains fully protected</li>
              </ul>
            </div>
            
            <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; border-left: 4px solid #f44336; margin: 20px 0;">
              <p style="margin: 0; color: #c62828; font-size: 14px;">
                🔒 <strong>Security Notice:</strong> If you didn't make this change, please contact our support team immediately to secure your account.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              Thank you for keeping your account secure. If you have any questions or concerns, please don't hesitate to contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Cineora. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </div>
      `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(
        "Password change confirmation sent successfully:",
        info.messageId
      );
      return true;
    } catch (error) {
      console.error("Password change confirmation sending failed:", error);
      return false;
    }
  }
}

export interface IEmailService {
  sendOTPEmail(email: string, otp: string): Promise<boolean>;
  sendEmailChangeOTP(email: string, otp: string, oldEmail: string): Promise<boolean>;
  sendPasswordResetOTP(email: string, otp: string, userName: string): Promise<boolean>;
  sendTheaterVerifiedEmail(email: string, theaterName: string): Promise<boolean>
  sendTheaterRejectedEmail(email: string, theaterName: string, rejectionReason?: string): Promise<boolean>
  sendKYCSubmittedEmail(email: string, ownerName: string, requestId: string): Promise<boolean>;
  sendKYCRejectedEmail(email: string, ownerName: string, rejectionReason: string): Promise<boolean>;
  sendOwnerWelcomeEmail(email: string, ownerName: string, tempPassword: string): Promise<boolean>;
  sendEmailChangeSuccessNotification(newEmail: string, oldEmail: string): Promise<boolean>;
  sendPasswordChangeConfirmation(email: string, userName: string): Promise<boolean>;
}
