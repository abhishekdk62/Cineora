"use client"

import React, { useState, useEffect } from "react"
import { Lexend } from "next/font/google"
import { 
  Building, 
  Plus, 
  Search, 
  Power
} from "lucide-react"
import TheaterCard from "./TheaterCard"
import CreateTheaterModal from "./CreateTheaterModal"
import EditTheaterModal from "./EditTheaterModal"
import TheaterFilters from "./TheaterFilters"
import OwnerLayout from "../OwnerLayout"

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

const TheaterManager: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  })

  // Mock data - replace with API calls
  const mockTheaters: Theater[] = [
    {
      _id: "1",
      name: "Abhishek Cinemas",
      address: "123 Main Street, Downtown",
      city: "Kochi",
      state: "Kerala",
      phone: "7012941009",
      facilities: ["3D", "IMAX", "Dolby Atmos", "Parking", "Food Court"],
      isActive: true,
      createdAt: "2024-01-15T10:30:00.000Z",
      updatedAt: "2024-01-15T10:30:00.000Z"
    },
    {
      _id: "2",
      name: "DK Theater Complex",
      address: "456 Cinema Road, Mall Area",
      city: "Trivandrum",
      state: "Kerala",
      phone: "9876543210",
      facilities: ["4DX", "Recliner Seats", "AC", "Parking"],
      isActive: false,
      createdAt: "2024-02-20T14:15:00.000Z",
      updatedAt: "2024-02-20T14:15:00.000Z"
    }
  ]

  useEffect(() => {
    fetchTheaters()
  }, [])

  const fetchTheaters = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTheaters(mockTheaters)
      setStats({
        total: mockTheaters.length,
        active: mockTheaters.filter(t => t.isActive).length,
        inactive: mockTheaters.filter(t => !t.isActive).length
      })
      setIsLoading(false)
    }, 1000)
  }

  const filteredTheaters = theaters.filter(theater => {
    const matchesSearch = theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theater.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theater.state.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "active" && theater.isActive) ||
                         (selectedFilter === "inactive" && !theater.isActive)
    
    return matchesSearch && matchesFilter
  })

  const updateStats = (theaterList: Theater[]) => {
    setStats({
      total: theaterList.length,
      active: theaterList.filter(t => t.isActive).length,
      inactive: theaterList.filter(t => !t.isActive).length
    })
  }

  const handleToggleTheaterStatus = (theaterId: string) => {
    const updatedTheaters = theaters.map(theater => 
      theater._id === theaterId 
        ? { ...theater, isActive: !theater.isActive }
        : theater
    )
    setTheaters(updatedTheaters)
    updateStats(updatedTheaters)
  }

  const handleDeleteTheater = (theaterId: string) => {
    const updatedTheaters = theaters.filter(theater => theater._id !== theaterId)
    setTheaters(updatedTheaters)
    updateStats(updatedTheaters)
  }

  const handleCreateTheater = (newTheater: Theater) => {
    const updatedTheaters = [newTheater, ...theaters]
    setTheaters(updatedTheaters)
    updateStats(updatedTheaters)
    setShowCreateModal(false)
  }

  const handleEditTheater = (theater: Theater) => {
    setSelectedTheater(theater)
    setShowEditModal(true)
  }

  const handleSaveEditTheater = (updatedTheater: Theater) => {
    const updatedTheaters = theaters.map(t => 
      t._id === updatedTheater._id ? updatedTheater : t
    )
    setTheaters(updatedTheaters)
    updateStats(updatedTheaters)
    setShowEditModal(false)
    setSelectedTheater(null)
  }

  return (
    <OwnerLayout activeTab="theaters">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className={`${lexendBold.className} text-3xl text-white mb-2`}>
              Theater Management
            </h1>
            <p className={`${lexendSmall.className} text-gray-400`}>
              Manage your cinema theaters and their settings
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className={`${lexendMedium.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-medium`}
          >
            <Plus className="w-5 h-5" />
            Add New Theater
          </button>
        </div>

        {/* Theater Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                  Total Theaters
                </p>
                <p className={`${lexendBold.className} text-2xl text-white mt-1`}>
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                  Active Theaters
                </p>
                <p className={`${lexendBold.className} text-2xl text-green-400 mt-1`}>
                  {stats.active}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Power className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                  Inactive Theaters
                </p>
                <p className={`${lexendBold.className} text-2xl text-orange-400 mt-1`}>
                  {stats.inactive}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Power className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Theater Search and Filters */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Theater Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search theaters by name, city, or state..."
                className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
              />
            </div>

            {/* Theater Filters */}
            <TheaterFilters 
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
        </div>

        {/* Theater Grid */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTheaters.length === 0 ? (
            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-12 text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={`${lexendMedium.className} text-xl text-white mb-2`}>
                {searchQuery ? "No theaters found" : "No theaters yet"}
              </h3>
              <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
                {searchQuery 
                  ? `No theaters match "${searchQuery}"`
                  : "Add your first theater to get started"
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className={`${lexendMedium.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300`}
                >
                  Add Your First Theater
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTheaters.map((theater) => (
                <TheaterCard
                  key={theater._id}
                  theater={theater}
                  onToggleStatus={handleToggleTheaterStatus}
                  onDelete={handleDeleteTheater}
                  onEdit={handleEditTheater}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Theater Modal */}
      {showCreateModal && (
        <CreateTheaterModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateTheater}
        />
      )}

      {/* Edit Theater Modal */}
      {showEditModal && selectedTheater && (
        <EditTheaterModal 
          theater={selectedTheater}
          onClose={() => {
            setShowEditModal(false)
            setSelectedTheater(null)
          }}
          onSave={handleSaveEditTheater}
        />
      )}
    </OwnerLayout>
  )
}

export default TheaterManager
