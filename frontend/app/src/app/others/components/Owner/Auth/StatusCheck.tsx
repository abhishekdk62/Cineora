
"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Lexend } from "next/font/google";
 
import { getOwnerRequestStatus } from "../../../services/ownerServices/ownerServices";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

export default function KYCStatusCheck() {
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>(null);
  const [error, setError] = useState("");

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStatus(null);

    try {
      const result = await getOwnerRequestStatus(requestId);
      
      if (result.success) {
        setStatus(result.data);
      } else {
        setError(result.message);
      }
    } catch (error: string) {
      setError(error.response?.data?.message || "Failed to check status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'pending': return 'text-yellow-400';
      case 'under_review': return 'text-blue-400';
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case 'pending': return '⏳';
      case 'under_review': return '👀';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-md border rounded-4xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Check KYC Status</h2>
        <p className={`${lexendSmall.className} text-gray-300`}>
          Enter your request ID to check status
        </p>
      </div>

      <form onSubmit={handleCheckStatus} className="space-y-4">
        <div>
          <label className={`${lexendSmall.className} block text-sm font-medium text-gray-200 mb-2`}>
            Request ID
          </label>
          <input
            type="text"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            className={`${lexendSmall.className} w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500`}
            placeholder="Enter your request ID"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-3 ${
            loading ? "bg-gray-500" : "bg-white hover:bg-gray-100"
          } text-black font-semibold rounded-lg transition-colors disabled:cursor-not-allowed`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Checking...
            </div>
          ) : (
            "Check Status"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-400 text-sm text-center bg-red-900/20 border border-red-500/20 rounded-lg p-3">
          {error}
        </div>
      )}

      {status && (
        <div className="mt-6 bg-white/10 border border-white/20 rounded-lg p-4">
          <div className="text-center">
            <div className="text-4xl mb-2">{getStatusIcon(status.status)}</div>
            <h3 className={`text-lg font-semibold ${getStatusColor(status.status)} mb-2`}>
              {status.status.charAt(0).toUpperCase() + status.status.slice(1).replace('_', ' ')}
            </h3>
            <p className={`${lexendSmall.className} text-gray-300 text-sm mb-4`}>
              Submitted: {new Date(status.submittedAt).toLocaleDateString()}
            </p>
            
            {status.reviewedAt && (
              <p className={`${lexendSmall.className} text-gray-300 text-sm mb-2`}>
                Reviewed: {new Date(status.reviewedAt).toLocaleDateString()}
              </p>
            )}
            
            {status.rejectionReason && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                <p className={`${lexendSmall.className} text-red-300 text-sm`}>
                  <strong>Rejection Reason:</strong> {status.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
