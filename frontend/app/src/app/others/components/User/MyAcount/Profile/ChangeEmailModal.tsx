"use client";

import { useState, useEffect } from "react";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface EmailChangeData {
  newEmail: string;
  otp: string;
}

interface ChangeEmailModalProps {
  currentEmail: string;
  onClose: () => void;
}

const ChangeEmailModal = ({ currentEmail, onClose }: ChangeEmailModalProps) => {
  const [emailLoading, setEmailLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  const [emailData, setEmailData] = useState<EmailChangeData>({
    newEmail: '',
    otp: '',
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
    setEmailError('');
  };

  const handleSendOTP = async () => {
    if (!emailData.newEmail || emailData.newEmail === currentEmail) {
      setEmailError('Please enter a valid new email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailLoading(true);
    try {
      // Add your API call here to send OTP
      console.log('Sending OTP to:', emailData.newEmail);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOtpSent(true);
      setOtpTimer(300); // 5 minutes timer
      setEmailError('');
      
    } catch (error) {
      setEmailError('Failed to send OTP. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!emailData.otp || emailData.otp.length !== 6) {
      setEmailError('Please enter a valid 6-digit OTP');
      return;
    }

    setEmailLoading(true);
    try {
      // Add your API call here to verify OTP and change email
      console.log('Verifying OTP and changing email:', emailData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSuccess('Email changed successfully!');
      setEmailData({ newEmail: '', otp: '' });
      setOtpSent(false);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setEmailError('Invalid OTP. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleClose = () => {
    setEmailData({ newEmail: '', otp: '' });
    setOtpSent(false);
    setOtpTimer(0);
    setEmailError('');
    setEmailSuccess('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative w-full max-w-md bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className={`${lexendBold.className} text-xl text-white`}>
                Change Email
              </h2>
              <p className={`${lexendSmall.className} text-gray-400`}>
                Update your email address
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {emailError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className={`${lexendSmall.className} text-red-400 text-sm`}>
                {emailError}
              </p>
            </div>
          )}

          {emailSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className={`${lexendSmall.className} text-green-400 text-sm flex items-center gap-2`}>
                <CheckCircle className="w-4 h-4" />
                {emailSuccess}
              </p>
            </div>
          )}

          <div>
            <label className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}>
              Current Email
            </label>
            <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 backdrop-blur-sm">
              {currentEmail}
            </div>
          </div>

          <div>
            <label className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}>
              New Email Address
            </label>
            <input
              type="email"
              name="newEmail"
              value={emailData.newEmail}
              onChange={handleEmailChange}
              disabled={otpSent}
              className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="Enter new email address"
            />
          </div>

          {!otpSent ? (
            <button
              onClick={handleSendOTP}
              disabled={emailLoading || !emailData.newEmail}
              className={`${lexendMedium.className} w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {emailLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          ) : (
            <>
              <div>
                <label className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}>
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={emailData.otp}
                  onChange={handleEmailChange}
                  maxLength={6}
                  className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                  placeholder="Enter 6-digit OTP"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                    OTP sent to {emailData.newEmail}
                  </p>
                  {otpTimer > 0 && (
                    <span className={`${lexendSmall.className} text-blue-400 text-xs`}>
                      Expires in {formatTimer(otpTimer)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSendOTP}
                  disabled={emailLoading || otpTimer > 0}
                  className={`${lexendMedium.className} flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {otpTimer > 0 ? `Resend (${formatTimer(otpTimer)})` : 'Resend OTP'}
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={emailLoading || emailData.otp.length !== 6}
                  className={`${lexendMedium.className} flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {emailLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Change'
                  )}
                </button>
              </div>

              {/* OTP Requirements */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <p className={`${lexendSmall.className} text-gray-300 text-xs mb-2`}>
                  OTP Guidelines:
                </p>
                <ul className={`${lexendSmall.className} text-gray-400 text-xs space-y-1`}>
                  <li>• Check your email inbox and spam folder</li>
                  <li>• OTP is valid for 5 minutes</li>
                  <li>• Enter the 6-digit code exactly as received</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
          <button
            onClick={handleClose}
            className={`${lexendMedium.className} px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailModal;
