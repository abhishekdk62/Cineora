"use client"

import React, { useState } from "react"
import { Lexend } from "next/font/google"
import { X, Building, MapPin, Phone, Plus, Loader2 } from "lucide-react"

const lexendBold   = Lexend({ weight: "700", subsets: ["latin"] })
const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] })
const lexendSmall  = Lexend({ weight: "300", subsets: ["latin"] })

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

interface EditTheaterModalProps {
  theater: Theater
  onClose: () => void
  onSave: (updated: Theater) => void
}

const facilityOptions = [
  "3D","IMAX","4DX","Dolby Atmos","Dolby Vision",
  "Parking","Food Court","AC","Recliner Seats",
  "Premium Seating","Wheelchair Access","Online Booking"
]

const EditTheaterModal: React.FC<EditTheaterModalProps> = ({ theater, onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ ...theater })
  const [newFacility, setNewFacility] = useState("")

  /* ---------- helpers ---------- */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addFacility = (f: string) => {
    if (!formData.facilities.includes(f))
      setFormData(prev => ({ ...prev, facilities: [...prev.facilities, f] }))
  }

  const removeFacility = (f: string) =>
    setFormData(prev => ({ ...prev, facilities: prev.facilities.filter(x => x !== f) }))

  const addCustom = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      addFacility(newFacility.trim())
      setNewFacility("")
    }
  }

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API latency – replace with real API call later
    setTimeout(() => {
      onSave({ ...formData, updatedAt: new Date().toISOString() })
      setIsLoading(false)
    }, 1500)
  }

  /* ---------- UI ---------- */
  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 pb-10">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl mx-4 h-[80vh] max-h-[600px] min-h-[500px]">
        <div className="backdrop-blur-sm bg-black/90 rounded-3xl border border-gray-500/30 shadow-2xl h-full flex flex-col">

          {/* header */}
          <div className="flex-shrink-0 p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${lexendBold.className} text-2xl text-white`}>Edit Theater</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* body */}
          <div className="flex-1 overflow-y-auto px-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div>
                <label className={`${lexendMedium.className} text-white text-sm mb-2 block`}>Theater Name *</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInput}
                    required
                    className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none`}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className={`${lexendMedium.className} text-white text-sm mb-2 block`}>Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInput}
                    rows={3}
                    required
                    className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none resize-none`}
                  />
                </div>
              </div>

              {/* City / State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`${lexendMedium.className} text-white text-sm mb-2 block`}>City *</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInput}
                    required
                    className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`${lexendMedium.className} text-white text-sm mb-2 block`}>State *</label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleInput}
                    required
                    className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={`${lexendMedium.className} text-white text-sm mb-2 block`}>Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInput}
                    required
                    className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none`}
                  />
                </div>
              </div>

              {/* Facilities */}
              <div>
                <label className={`${lexendMedium.className} text-white text-sm mb-2 block`}>Facilities</label>

                <div className="mb-3 flex flex-wrap gap-2">
                  {facilityOptions.map(f => (
                    <button
                      key={f}
                      type="button"
                      disabled={formData.facilities.includes(f)}
                      onClick={() => addFacility(f)}
                      className={`${lexendSmall.className} px-3 py-1 rounded-lg text-xs transition ${
                        formData.facilities.includes(f)
                          ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* custom facility */}
                <div className="flex gap-2 mb-3">
                  <input
                    value={newFacility}
                    onChange={e => setNewFacility(e.target.value)}
                    placeholder="Add custom facility"
                    onKeyPress={e => e.key === "Enter" && (e.preventDefault(), addCustom())}
                    className={`${lexendSmall.className} flex-1 px-3 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none`}
                  />
                  <button type="button" onClick={addCustom} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* selected */}
                {formData.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.facilities.map(f => (
                      <span key={f} className={`${lexendSmall.className} px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs flex items-center gap-1`}>
                        {f}
                        <button onClick={() => removeFacility(f)} className="hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* footer */}
          <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-500/30">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={`${lexendMedium.className} flex-1 py-3 rounded-xl border border-gray-500/30 text-gray-300 hover:bg-white/10`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`${lexendMedium.className} flex-1 bg-white text-black py-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditTheaterModal
