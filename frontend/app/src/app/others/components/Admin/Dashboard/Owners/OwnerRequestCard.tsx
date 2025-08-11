"use client"

import React, { useState } from "react"
import { Lexend } from "next/font/google"
import { 
  User, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar, 
  Phone, 
  Mail, 
  CreditCard, 
  Building, 
  FileText,
  Clock,
  Shield,
  X
} from "lucide-react"
import { OwnerRequest } from "./OwnerManager"

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
})

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
})

interface ActionButton {
  label: string
  icon: React.ElementType
  onClick: (request: OwnerRequest) => void
  className: string
}

interface OwnerRequestCardProps {
  request: OwnerRequest
  actions: ActionButton[]
  showProcessedInfo?: boolean
  showRejectionReason?: boolean
}

const OwnerRequestCard: React.FC<OwnerRequestCardProps> = ({ 
  request, 
  actions, 
  showProcessedInfo = false,
  showRejectionReason = false 
}) => {
  const [showModal, setShowModal] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      {/* Main Card - Minimal Details for Listing */}
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header with photo and basic info */}
            <div className="flex items-center gap-4 mb-4">
              {request.ownerPhotoUrl ? (
                <img
                  src={request.ownerPhotoUrl}
                  alt={request.ownerName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center border-2 border-gray-600">
                  <User className="text-gray-400" size={24} />
                </div>
              )}
              <div className="flex-1">
                <h3 className={`${lexend.className} text-xl font-semibold text-white mb-1`}>
                  {request.ownerName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    {request.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    {request.phone}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                    request.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                    'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  {request.emailVerified && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/50">
                      <CheckCircle size={12} className="inline mr-1" />
                      Email Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs">Submitted</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {formatDate(request.submittedAt)}
                </p>
              </div>
              
              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs">PAN</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {request.pan}
                </p>
              </div>
              
              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs">Documents</span>
                </div>
                <div className="flex gap-1">
                  <span className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded text-xs">ID</span>
                  <span className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded text-xs">PAN</span>
                  {request.ownerPhotoUrl && (
                    <span className="bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded text-xs">Photo</span>
                  )}
                </div>
              </div>

              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs">Status</span>
                </div>
                <div className="flex items-center gap-1">
                  {request.emailVerified ? (
                    <CheckCircle size={14} className="text-green-400" />
                  ) : (
                    <XCircle size={14} className="text-red-400" />
                  )}
                  <span className={`text-xs ${request.emailVerified ? 'text-green-400' : 'text-red-400'}`}>
                    {request.emailVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Show rejection reason if exists */}
            {showRejectionReason && request.rejectionReason && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle size={14} className="text-red-400" />
                  <span className="text-red-400 font-medium text-sm">Rejection Reason:</span>
                </div>
                <p className="text-red-300 text-sm">{request.rejectionReason}</p>
              </div>
            )}

            {/* View Details button */}
            <button
              onClick={() => setShowModal(true)}
              className="text-[#e78f03] hover:text-orange-400 text-sm font-medium transition-colors"
            >
              View Full Details
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 ml-6">
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => action.onClick(request)}
                  className={`p-3 rounded-lg text-white transition-colors ${action.className} flex items-center justify-center`}
                  title={action.label}
                >
                  <Icon size={16} />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detailed Modal - Complete Information */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-600">
              <div className="flex items-center gap-4">
                {request.ownerPhotoUrl ? (
                  <img
                    src={request.ownerPhotoUrl}
                    alt={request.ownerName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center border-2 border-gray-600">
                    <User className="text-gray-400" size={24} />
                  </div>
                )}
                <div>
                  <h2 className={`${lexend.className} text-2xl font-bold text-white`}>
                    {request.ownerName}
                  </h2>
                  <p className="text-gray-400">{request.email}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                    request.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                    'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="text-gray-400" size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                
                {/* Status Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#2a2a2a] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className={request.status === 'approved' ? "text-green-400" : request.status === 'pending' ? "text-yellow-400" : "text-red-400"} size={16} />
                      <span className="text-gray-400 text-sm">Request Status</span>
                    </div>
                    <p className={`font-medium ${
                      request.status === 'approved' ? 'text-green-400' : 
                      request.status === 'pending' ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </p>
                  </div>
                  
                  <div className="bg-[#2a2a2a] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className={request.emailVerified ? "text-green-400" : "text-red-400"} size={16} />
                      <span className="text-gray-400 text-sm">Email Verification</span>
                    </div>
                    <p className={`font-medium ${request.emailVerified ? 'text-green-400' : 'text-red-400'}`}>
                      {request.emailVerified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                  
                  <div className="bg-[#2a2a2a] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-blue-400" size={16} />
                      <span className="text-gray-400 text-sm">OTP Code</span>
                    </div>
                    <p className="text-white font-medium font-mono text-lg">{request.otp}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h4 className={`${lexend.className} text-white text-lg font-medium mb-4 flex items-center gap-2`}>
                    <Phone size={20} />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">Owner Name:</span>
                      <p className="text-white font-medium">{request.ownerName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email Address:</span>
                      <p className="text-white font-medium">{request.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Phone Number:</span>
                      <p className="text-white font-medium">{request.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email Status:</span>
                      <div className="flex items-center gap-2">
                        {request.emailVerified ? (
                          <CheckCircle size={16} className="text-green-400" />
                        ) : (
                          <XCircle size={16} className="text-red-400" />
                        )}
                        <p className={`font-medium ${request.emailVerified ? 'text-green-400' : 'text-red-400'}`}>
                          {request.emailVerified ? 'Verified' : 'Not Verified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KYC Information */}
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h4 className={`${lexend.className} text-white text-lg font-medium mb-4 flex items-center gap-2`}>
                    <CreditCard size={20} />
                    KYC Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">Aadhaar Number:</span>
                      <p className="text-white font-medium font-mono">{request.aadhaar}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">PAN Number:</span>
                      <p className="text-white font-medium font-mono">{request.pan}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Request ID:</span>
                      <p className="text-white font-medium text-sm font-mono">{request._id}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">OTP Code:</span>
                      <p className="text-white font-medium font-mono">{request.otp}</p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h4 className={`${lexend.className} text-white text-lg font-medium mb-4 flex items-center gap-2`}>
                    <Building size={20} />
                    Bank Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">Account Holder:</span>
                      <p className="text-white font-medium">
                        {request.accountHolder || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Bank Name:</span>
                      <p className="text-white font-medium">
                        {request.bankName || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Account Number:</span>
                      <p className="text-white font-medium">
                        {request.accountNumber || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">IFSC Code:</span>
                      <p className="text-white font-medium">
                        {request.ifsc || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* KYC Documents */}
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h4 className={`${lexend.className} text-white text-lg font-medium mb-4 flex items-center gap-2`}>
                    <FileText size={20} />
                    KYC Documents
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                      href={request.aadhaarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-blue-400 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-blue-400 group-hover:text-blue-300" />
                        <div>
                          <span className="text-white font-medium">Aadhaar Card</span>
                          <p className="text-gray-400 text-sm">Click to view document</p>
                        </div>
                      </div>
                    </a>
                    
                    <a
                      href={request.panUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-green-400 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-green-400 group-hover:text-green-300" />
                        <div>
                          <span className="text-white font-medium">PAN Card</span>
                          <p className="text-gray-400 text-sm">Click to view document</p>
                        </div>
                      </div>
                    </a>
                    
                    {request.ownerPhotoUrl ? (
                      <a
                        href={request.ownerPhotoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-purple-400 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <User size={20} className="text-purple-400 group-hover:text-purple-300" />
                          <div>
                            <span className="text-white font-medium">Owner Photo</span>
                            <p className="text-gray-400 text-sm">Click to view photo</p>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 opacity-50">
                        <div className="flex items-center gap-3">
                          <User size={20} className="text-gray-500" />
                          <div>
                            <span className="text-gray-500 font-medium">Owner Photo</span>
                            <p className="text-gray-500 text-sm">Not provided</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification & Agreement Status */}
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h4 className={`${lexend.className} text-white text-lg font-medium mb-4 flex items-center gap-2`}>
                    <Shield size={20} />
                    Verification & Agreement Status
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg">
                      {request.emailVerified ? (
                        <CheckCircle className="text-green-400" size={16} />
                      ) : (
                        <XCircle className="text-red-400" size={16} />
                      )}
                      <span className="text-sm text-gray-400">
                        Email {request.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg">
                      {request.declaration ? (
                        <CheckCircle className="text-green-400" size={16} />
                      ) : (
                        <XCircle className="text-red-400" size={16} />
                      )}
                      <span className="text-sm text-gray-400">Declaration Accepted</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg">
                      {request.agree ? (
                        <CheckCircle className="text-green-400" size={16} />
                      ) : (
                        <XCircle className="text-red-400" size={16} />
                      )}
                      <span className="text-sm text-gray-400">Terms Agreed</span>
                    </div>
                  </div>
                </div>

                {/* Request Information */}
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h4 className={`${lexend.className} text-white text-lg font-medium mb-4 flex items-center gap-2`}>
                    <Clock size={20} />
                    Request Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400">Request Submitted:</span>
                        <p className="text-white font-medium">{formatDateTime(request.submittedAt)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Created Date:</span>
                        <p className="text-white font-medium">{formatDateTime(request.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Last Updated:</span>
                        <p className="text-white font-medium">{formatDateTime(request.updatedAt)}</p>
                      </div>
                      {request.reviewedAt && (
                        <div>
                          <span className="text-gray-400">Reviewed At:</span>
                          <p className="text-white font-medium">{formatDateTime(request.reviewedAt)}</p>
                        </div>
                      )}
                    </div>
                    
                    {request.reviewedBy && (
                      <div>
                        <span className="text-gray-400">Reviewed By (Admin ID):</span>
                        <p className="text-white font-medium text-sm font-mono">{request.reviewedBy}</p>
                      </div>
                    )}
                    
                    {request.rejectionReason && (
                      <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                        <span className="text-red-400 font-medium">Rejection Reason:</span>
                        <p className="text-red-300 mt-1">{request.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Information */}
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h4 className={`${lexend.className} text-white text-lg font-medium mb-4 flex items-center gap-2`}>
                    <Shield size={20} />
                    System Information
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-400">Request ID:</span>
                      <span className="text-white font-mono text-sm break-all">{request._id}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-400">OTP Code:</span>
                      <span className="text-white font-mono text-sm">{request.otp}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-400">Current Status:</span>
                      <span className={`font-medium ${
                        request.status === 'approved' ? 'text-green-400' : 
                        request.status === 'pending' ? 'text-yellow-400' : 
                        'text-red-400'
                      }`}>
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-400">Email Verified:</span>
                      <span className={`font-medium ${request.emailVerified ? 'text-green-400' : 'text-red-400'}`}>
                        {request.emailVerified ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-400">Declaration:</span>
                      <span className={`font-medium ${request.declaration ? 'text-green-400' : 'text-red-400'}`}>
                        {request.declaration ? 'ACCEPTED' : 'NOT ACCEPTED'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">Terms Agreement:</span>
                      <span className={`font-medium ${request.agree ? 'text-green-400' : 'text-red-400'}`}>
                        {request.agree ? 'AGREED' : 'NOT AGREED'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-600 flex justify-between items-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                Close
              </button>
              <div className="flex gap-3">
                {actions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setShowModal(false)
                        action.onClick(request)
                      }}
                      className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${action.className}`}
                    >
                      <Icon size={16} />
                      {action.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OwnerRequestCard
