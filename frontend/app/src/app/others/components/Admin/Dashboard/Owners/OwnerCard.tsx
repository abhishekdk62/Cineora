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
  MapPin
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
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header with photo and basic info */}
            <div className="flex items-center gap-4 mb-4">
              {owner.ownerPhotoUrl ? (
                <img
                  src={owner.ownerPhotoUrl}
                  alt={owner.ownerName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center border-2 border-gray-600">
                  <User className="text-gray-400" size={24} />
                </div>
              )}
              <div className="flex-1">
                <h3 className={`${lexend.className} text-xl font-semibold text-white mb-1`}>
                  {owner.ownerName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    {owner.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    {owner.phone}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${owner.isActive
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                    }`}>
                    {owner.isActive ? 'Active' : 'Blocked'}
                  </span>
                  {owner.isVerified && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/50">
                      <CheckCircle size={12} className="inline mr-1" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs">Joined</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {formatDate(owner.createdAt)}
                </p>
              </div>

              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs">Approved</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {formatDate(owner.approvedAt)}
                </p>
              </div>

              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Building size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs">Theatres</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {owner.theatres.length}
                </p>
              </div>

              <div className="bg-[#2a2a2a] p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs">Last Login</span>
                </div>
                <p className="text-white text-sm font-medium">
                  {owner.lastLogin ? formatDate(owner.lastLogin) : 'Never'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="text-[#e78f03] hover:text-orange-400 text-sm font-medium transition-colors"
            >
              View Full Details
            </button>
            <button
              onClick={() => setViewThaeter(owner._id)}
              className="text-[#e78f03] ml-10 hover:text-orange-400 text-sm font-medium transition-colors"
            >
              View Theaters
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 ml-6">
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => action.onClick(owner)}
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

      {/* Detailed Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-600">
              <div className="flex items-center gap-4">
                {owner.ownerPhotoUrl ? (
                  <img
                    src={owner.ownerPhotoUrl}
                    alt={owner.ownerName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center border-2 border-gray-600">
                    <User className="text-gray-400" size={24} />
                  </div>
                )}
                <div>
                  <h2 className={`${lexend.className} text-2xl font-bold text-white`}>
                    {owner.ownerName}
                  </h2>
                  <p className="text-gray-400">{owner.email}</p>
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
                      <CheckCircle className={owner.isActive ? "text-green-400" : "text-red-400"} size={16} />
                      <span className="text-gray-400 text-sm">Account Status</span>
                    </div>
                    <p className={`font-medium ${owner.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {owner.isActive ? 'Active' : 'Blocked'}
                    </p>
                  </div>

                  <div className="bg-[#2a2a2a] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className={owner.isVerified ? "text-green-400" : "text-red-400"} size={16} />
                      <span className="text-gray-400 text-sm">Verification</span>
                    </div>
                    <p className={`font-medium ${owner.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                      {owner.isVerified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>

                  <div className="bg-[#2a2a2a] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="text-blue-400" size={16} />
                      <span className="text-gray-400 text-sm">Theatres</span>
                    </div>
                    <p className="text-white font-medium text-lg">{owner.theatres.length}</p>
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
                      <p className="text-white font-medium">****{owner.aadhaar.slice(-4)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">PAN Number:</span>
                      <p className="text-white font-medium">{owner.pan}</p>
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
                        {owner.accountHolder || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Bank Name:</span>
                      <p className="text-white font-medium">
                        {owner.bankName || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Account Number:</span>
                      <p className="text-white font-medium">
                        {owner.accountNumber ? `****${owner.accountNumber.slice(-4)}` : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">IFSC Code:</span>
                      <p className="text-white font-medium">
                        {owner.ifsc || 'Not provided'}
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
                      href={owner.aadhaarUrl}
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
                      href={owner.panUrl}
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

                    <a
                      href={owner.ownerPhotoUrl}
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
                  </div>
                </div>

                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h4 className={`${lexend.className} text-white text-lg font-medium mb-4 flex items-center gap-2`}>
                    <Building size={20} />
                    Theatre Information
                  </h4>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Total Theatres:</span>
                    <span className="text-white font-medium text-2xl">{theatres.length}</span>
                  </div>
                  {theatres.length === 0 ? (
                    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-600 text-center">
                      <Building size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-400">No theatres registered yet</p>
                      <p className="text-gray-500 text-sm mt-1">Owner can add theatres from their dashboard</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {theatres.map((theatre) => (
                        <div key={theatre._id} className="bg-[#1a1a1a] p-4 rounded border border-gray-600">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="text-white font-medium text-lg mb-2">{theatre.name}</h5>
                              <p className="text-gray-400 text-sm mb-3">{theatre.address}</p>
                            </div>
                            <a
                              href={`https://www.google.com/maps?q=${theatre.location.coordinates[1]},${theatre.location.coordinates[0]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                            >
                              <MapPin size={14} />
                              View on Maps
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity & Timeline */}
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <h4 className={`${lexend.className} text-white text-lg font-medium mb-4 flex items-center gap-2`}>
                    <Clock size={20} />
                    Activity Timeline
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400">Registration Date:</span>
                        <p className="text-white font-medium">{formatDateTime(owner.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Approval Date:</span>
                        <p className="text-white font-medium">{formatDateTime(owner.approvedAt)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Last Login:</span>
                        <p className="text-white font-medium">
                          {owner.lastLogin ? formatDateTime(owner.lastLogin) : 'Never logged in'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Profile Updated:</span>
                        <p className="text-white font-medium">{formatDateTime(owner.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-600 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-[#e78f03] hover:bg-orange-600 text-black font-medium rounded-lg transition-colors"
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
