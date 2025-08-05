"use client"

import React, { useState } from "react"
import { Lexend } from "next/font/google"
import { 
  X, 
  Building, 
  MapPin, 
  Phone, 
  Plus,
  Loader2
} from "lucide-react"

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
})

const lexendMedium = Lexend({
  weight: "500",
  subsets: ["latin"],
})

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
})

interface Theater {
  _id: string
  name: string
  address: string
  city: string
  state: string
  phone: string
  facilities: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CreateTheaterModalProps {
  onClose: () => void
  onSuccess: (theater: Theater) => void
}

const CreateTheaterModal: React.FC<CreateTheaterModalProps> = ({ 
  onClose, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    facilities: [] as string[]
  })

  const [newFacility, setNewFacility] = useState("")

  const facilityOptions = [
    "3D", "IMAX", "4DX", "Dolby Atmos", "Dolby Vision", 
    "Parking", "Food Court", "AC", "Recliner Seats", 
    "Premium Seating", "Wheelchair Access", "Online Booking"
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddFacility = (facility: string) => {
    if (!formData.facilities.includes(facility)) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, facility]
      }))
    }
  }

  const handleRemoveFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facility)
    }))
  }

  const handleAddCustomFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }))
      setNewFacility("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newTheater: Theater = {
        _id: Date.now().toString(),
        ...formData,
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      onSuccess(newTheater)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pb-10">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 h-[80vh] max-h-[600px] min-h-[500px]">
        <div className="backdrop-blur-sm bg-black/90 rounded-3xl border border-gray-500/30 shadow-2xl h-full flex flex-col">
          
          {/* Header */}
          <div className="flex-shrink-0 p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${lexendBold.className} text-2xl text-white`}>
                Add New Theater
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Theater Name */}
              <div>
                <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
                  Theater Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter theater name"
                    className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    rows={3}
                    className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 resize-none`}
                    required
                  />
                </div>
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
                    required
                  />
                </div>
                <div>
                  <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
                    required
                  />
                </div>
              </div>

              {/* Facilities */}
              <div>
                <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
                  Facilities
                </label>
                
                {/* Quick Add Facilities */}
                <div className="mb-3">
                  <p className={`${lexendSmall.className} text-gray-400 text-xs mb-2`}>
                    Quick add:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {facilityOptions.map((facility) => (
                      <button
                        key={facility}
                        type="button"
                        onClick={() => handleAddFacility(facility)}
                        disabled={formData.facilities.includes(facility)}
                        className={`${lexendSmall.className} px-3 py-1 rounded-lg text-xs transition-all duration-200 ${
                          formData.facilities.includes(facility)
                            ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Facility */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    placeholder="Add custom facility"
                    className={`${lexendSmall.className} flex-1 px-3 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/50 text-sm`}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomFacility())}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFacility}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Selected Facilities */}
                {formData.facilities.length > 0 && (
                  <div>
                    <p className={`${lexendSmall.className} text-gray-400 text-xs mb-2`}>
                      Selected facilities:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.facilities.map((facility) => (
                        <span
                          key={facility}
                          className={`${lexendSmall.className} px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs flex items-center gap-1`}
                        >
                          {facility}
                          <button
                            type="button"
                            onClick={() => handleRemoveFacility(facility)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-500/30">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`${lexendMedium.className} flex-1 py-3 rounded-xl border border-gray-500/30 text-gray-300 hover:bg-white/10 transition-all duration-300 font-medium`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !formData.name || !formData.address || !formData.city || !formData.state || !formData.phone}
                className={`${lexendMedium.className} flex-1 bg-white text-black py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Theater...
                  </>
                ) : (
                  "Create Theater"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTheaterModal
