"use client";
import React, { useState } from "react";
import { Mail, Shield, Eye, CheckCircle, ArrowLeft } from "lucide-react";
import { Lexend } from "next/font/google";
import EmailStep from "./EmailStep";
import OTPStep from "../common/OTPStep";
import PasswordStep from "./PasswordStep";
import SuccessStep from "./SuccessStep";
import { AxiosError } from "axios";

const lexend = Lexend({ weight: "500", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });

type Step = "email" | "otp" | "password" | "success";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onSubmitEmail: (email: string) => Promise<void>;
  onSubmitOTP: (otp: string) => Promise<void>;
  onSubmitNewPassword: (
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  onComplete: () => void;
}

export default function ForgotPassword({
  onBackToLogin,
  onSubmitEmail,
  onSubmitOTP,
  onSubmitNewPassword,
  onComplete,
}: ForgotPasswordProps) {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const next = (step: Step) => setCurrentStep(step);

  return (
    <div className="w-full max-w-md">
      {currentStep === "email" && (
        <button
          onClick={onBackToLogin}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className={lexendSmall.className}>Back to Login</span>
        </button>
      )}

      <StepIndicator current={currentStep} />

      {currentStep === "email" && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          loading={loading}
          error={error}
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            try {
              await onSubmitEmail(email);
              next("otp");
            } catch (err: unknown) {
              if(err instanceof AxiosError)
              {
                setError("Failed to send reset code. Please try again.");
              }
            } finally {
              setLoading(false);
            }
          }}
        />
      )}

      {currentStep === "otp" && (
        <OTPStep
          email={email}
          otp={otp}
          setOtp={setOtp}
          loading={loading}
          error={error}
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            try {
              await onSubmitOTP(otp);
              next("password");
            } catch (err: unknown) {
              if(err instanceof AxiosError)
              {

                setError( "Invalid verification code. Please try again.");
              }
            } finally {
              setLoading(false);
            }
          }}
          onResend={async () => {
            try {
              setLoading(true);
              setError("");
              setOtp(""); 
              await onSubmitEmail(email); 
            } catch (err: unknown) {
              if(err instanceof AxiosError)
              {

                setError( "Failed to resend code. Please try again.");
              }
            } finally {
              setLoading(false);
            }
          }}
        />
      )}

      {currentStep === "password" && (
        <PasswordStep
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          loading={loading}
          error={error}
          onSubmit={async (e) => {
            e.preventDefault();
            if (password !== confirmPassword) {
              setError("Passwords do not match");
              return;
            }
            if (password.length < 6) {
              setError("Password must be at least 6 characters long");
              return;
            }
            setLoading(true);
            setError("");
            try {
              await onSubmitNewPassword(password, confirmPassword);
              next("success");
              setTimeout(onComplete, 2000);
            } catch (err: unknown) {
              if(err instanceof AxiosError)
              {

                setError( "Failed to reset password. Please try again.");
              }
            } finally {
              setLoading(false);
            }
          }}
        />
      )}

      {currentStep === "success" && (
        <SuccessStep onComplete={onComplete}  />
      )}
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: "email", label: "Email", icon: Mail },
    { key: "otp", label: "Verify", icon: Shield },
    { key: "password", label: "Reset", icon: Eye },
    { key: "success", label: "Done", icon: CheckCircle },
  ];

  const idx = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, i) => {
        const active = i === idx;
        const done = i < idx;
        const Icon = s.icon;

        return (
          <React.Fragment key={s.key}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                active
                  ? "border-blue-400 bg-blue-400/20 text-blue-400"
                  : done
                  ? "border-green-400 bg-green-400/20 text-green-400"
                  : "border-white/20 bg-white/5 text-gray-400"
              }`}
            >
              <Icon size={16} />
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-3 ${
                  done ? "bg-green-400/40" : "bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
