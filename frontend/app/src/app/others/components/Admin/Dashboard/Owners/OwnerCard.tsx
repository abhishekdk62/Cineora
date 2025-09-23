
"use client"

import React, { useEffect, useState } from "react"
import { Lexend } from "next/font/google"
import {
  User,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  Mail,
  Building,
  CreditCard,
  FileText,
  Clock,
  Shield,
  X,
  MapPin,
  Eye,
  ExternalLink,
  Banknote,
} from "lucide-react"
import { Owner } from "./OwnerManager"
import { getTheatersByOwnerIdAdmin } from "@/app/others/services/adminServices/theaterServices"

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
  onClick: (owner: Owner) => void
  className: string
}

interface OwnerCardProps {
  owner: Owner
  actions: ActionButton[]
  setViewThaeter: (id: string) => void
}

const OwnerCard: React.FC<OwnerCardProps> = ({ owner, actions, setViewThaeter }) => {
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

  interface Theatre {
    _id: string;
    name: string;
    address: string;
    location: {
      coordinates: [number, number];
      type: string;
    };
  }

  const [theatres, setTheaters] = useState<Theatre[]>([]);

  async function getTheatersByOwnerId() {
    const data = await getTheatersByOwnerIdAdmin(owner._id)
    setTheaters(data.data.theaters)
    console.log(data.data);
  }

  useEffect(() => {
    getTheatersByOwnerId()
  }, [])

  return (
    <>
      <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 hover:bg-gray-700/50 hover:border-yellow-500/30 transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header with photo and basic info */}
            <div className="flex items-center gap-4 mb-4">
              {owner.ownerPhotoUrl ? (
                <img
                  src={owner.ownerPhotoUrl}
                  alt={owner.ownerName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/30 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center border-2 border-yellow-500/30 shadow-lg">
                  <User className="text-gray-400" size={24} />
                </div>
              )}
              <div className="flex-1">
                <h3 className={`${lexend.className} text-xl font-medium text-white mb-2`}>
                  {owner.ownerName}
                </h3>
                <div className="flex flex-col gap-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    {owner.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    {owner.phone}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
                    owner.isActive
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {owner.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {owner.isActive ? 'Active' : 'Blocked'}
                  </span>
                  {owner.isVerified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Shield size={12} />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-700/30 p-3 rounded-lg border border-yellow-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-yellow-400" />
                  <span className="text-gray-400 text-xs">Joined</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {formatDate(owner.createdAt)}
                </p>
              </div>

              <div className="bg-gray-700/30 p-3 rounded-lg border border-yellow-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={14} className="text-green-400" />
                  <span className="text-gray-400 text-xs">Approved</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {formatDate(owner.approvedAt)}
                </p>
              </div>

              <div className="bg-gray-700/30 p-3 rounded-lg border border-yellow-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <Building size={14} className="text-blue-400" />
                  <span className="text-gray-400 text-xs">Theatres</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {owner.theatres.length}
                </p>
              </div>

              <div className="bg-gray-700/30 p-3 rounded-lg border border-yellow-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-purple-400" />
                  <span className="text-gray-400 text-xs">Last Login</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {owner.lastLogin ? formatDate(owner.lastLogin) : 'Never'}
                </p>
              </div>
            </div>

            {/* Action Links */}
            <div className="flex gap-6">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
              >
                <Eye size={14} />
                View Full Details
              </button>
              <button
                onClick={() => {
                  
                  setViewThaeter(owner.id)}}
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
              >
                <Building size={14} />
                View Theaters
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 ml-6">
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => action.onClick(owner)}
                  className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${action.className}`}
                  title={action.label}
                >
                  <Icon size={16} />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 border border-yellow-500/30 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-yellow-500/20 bg-gray-800/50">
              <div className="flex items-center gap-4">
                {owner.ownerPhotoUrl ? (
                  <img
                    src={owner.ownerPhotoUrl}
                    alt={owner.ownerName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/30 shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center border-2 border-yellow-500/30">
                    <User className="text-gray-400" size={24} />
                  </div>
                )}
                <div>
                  <h2 className={`${lexend.className} text-2xl text-yellow-400 font-medium`}>
                    {owner.ownerName}
                  </h2>
                  <p className="text-gray-300">{owner.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      owner.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {owner.isActive ? 'Active' : 'Blocked'}
                    </span>
                    {owner.isVerified && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Status Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 border border-yellow-500/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${owner.isActive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <CheckCircle className={owner.isActive ? "text-green-400" : "text-red-400"} size={16} />
                      </div>
                      <span className="text-gray-400 text-sm">Account Status</span>
                    </div>
                    <p className={`font-medium ${owner.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {owner.isActive ? 'Active Account' : 'Blocked Account'}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 border border-yellow-500/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${owner.isVerified ? 'bg-blue-500/20' : 'bg-red-500/20'}`}>
                        <Shield className={owner.isVerified ? "text-blue-400" : "text-red-400"} size={16} />
                      </div>
                      <span className="text-gray-400 text-sm">Verification</span>
                    </div>
                    <p className={`font-medium ${owner.isVerified ? 'text-blue-400' : 'text-red-400'}`}>
                      {owner.isVerified ? 'Verified Owner' : 'Not Verified'}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 border border-yellow-500/20 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-yellow-500/20 p-2 rounded-lg">
                        <Building className="text-yellow-400" size={16} />
                      </div>
                      <span className="text-gray-400 text-sm">Theatres</span>
                    </div>
                    <p className="text-white font-medium text-lg">{owner.theatres.length}</p>
                  </div>
                </div>

                {/* KYC Information */}
                <div className="bg-gray-800/50 border border-yellow-500/20 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="text-yellow-400" size={20} />
                    <h4 className={`${lexend.className} text-white text-lg font-medium`}>
                      KYC Information
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Aadhaar Number</span>
                      <p className="text-white font-medium">****{owner.aadhaar.slice(-4)}</p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">PAN Number</span>
                      <p className="text-white font-medium">{owner.pan}</p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="bg-gray-800/50 border border-yellow-500/20 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Banknote className="text-yellow-400" size={20} />
                    <h4 className={`${lexend.className} text-white text-lg font-medium`}>
                      Bank Details
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Account Holder</span>
                      <p className="text-white font-medium">
                        {owner.accountHolder || 'Not provided'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Bank Name</span>
                      <p className="text-white font-medium">
                        {owner.bankName || 'Not provided'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Account Number</span>
                      <p className="text-white font-medium">
                        {owner.accountNumber ? `****${owner.accountNumber.slice(-4)}` : 'Not provided'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">IFSC Code</span>
                      <p className="text-white font-medium">
                        {owner.ifsc || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* KYC Documents */}
                <div className="bg-gray-800/50 border border-yellow-500/20 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-yellow-400" size={20} />
                    <h4 className={`${lexend.className} text-white text-lg font-medium`}>
                      KYC Documents
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                      href={owner.aadhaarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-700/30 p-4 rounded-lg border border-yellow-500/20 hover:border-blue-500/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500/20 p-2 rounded-lg">
                          <FileText size={20} className="text-blue-400 group-hover:text-blue-300" />
                        </div>
                        <div>
                          <span className="text-white font-medium block">Aadhaar Card</span>
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            View document <ExternalLink size={12} />
                          </span>
                        </div>
                      </div>
                    </a>

                    <a
                      href={owner.panUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-700/30 p-4 rounded-lg border border-yellow-500/20 hover:border-green-500/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                          <FileText size={20} className="text-green-400 group-hover:text-green-300" />
                        </div>
                        <div>
                          <span className="text-white font-medium block">PAN Card</span>
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            View document <ExternalLink size={12} />
                          </span>
                        </div>
                      </div>
                    </a>

                    <a
                      href={owner.ownerPhotoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-700/30 p-4 rounded-lg border border-yellow-500/20 hover:border-purple-500/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-500/20 p-2 rounded-lg">
                          <User size={20} className="text-purple-400 group-hover:text-purple-300" />
                        </div>
                        <div>
                          <span className="text-white font-medium block">Owner Photo</span>
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            View photo <ExternalLink size={12} />
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

       
                {/* Activity Timeline */}
                <div className="bg-gray-800/50 border border-yellow-500/20 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="text-yellow-400" size={20} />
                    <h4 className={`${lexend.className} text-white text-lg font-medium`}>
                      Activity Timeline
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Registration Date</span>
                      <p className="text-white font-medium">{formatDateTime(owner.createdAt)}</p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Approval Date</span>
                      <p className="text-white font-medium">{formatDateTime(owner.approvedAt)}</p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Last Login</span>
                      <p className="text-white font-medium">
                        {owner.lastLogin ? formatDateTime(owner.lastLogin) : 'Never logged in'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <span className="text-gray-400 text-sm">Profile Updated</span>
                      <p className="text-white font-medium">{formatDateTime(owner.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-yellow-500/20 bg-gray-800/30 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 font-medium rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OwnerCard
