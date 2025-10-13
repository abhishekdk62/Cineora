"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import {
  X,
  Camera,
  Phone,
  MapPin,
  Globe,
  Loader2,
  Check,
} from "lucide-react";
import { updateProfile } from "@/app/others/services/userServices/userServices";
import { IUser } from "./MyAccountContent";
import dynamic from "next/dynamic";

const MapLocationPicker = dynamic(() => import('../../../Leaflet/MapLocationPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-800 rounded-xl flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
  </div>
});

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

/* ---------- types ---------- */
interface EditFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  language: string;
  gender: "male" | "female" | "other" | "";
  phone: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  locationCity: string;
  locationState: string;
  profilePicture: string;
}

interface EditProfileModalProps {
  user: IUser;
  onClose: () => void;
  onDataUpdate?: () => Promise<void>;
}

/* ---------- helper functions ---------- */
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const pixelRatio = window.devicePixelRatio;
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.save();

  ctx.translate(-cropX, -cropY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.restore();
}

// Reverse geocoding function using Nominatim API
const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CineoraApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      return {
        city: address.city || address.town || address.village || address.municipality || '',
        state: address.state || address.region || address.province || '',
        country: address.country || ''
      };
    }
    
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}; 

/* ---------- component ---------- */
const EditProfileModal = ({ user, onClose, onDataUpdate }: EditProfileModalProps) => {
  /* ----- state ----- */
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    dateOfBirth: user.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
    language: user.language ?? "en",
    gender: user.gender ?? "",
    phone: user.phone ?? "",
    location: user.location, 
    locationCity: user.locationCity ?? "",
    locationState: user.locationState ?? "",
    profilePicture: user.profilePicture ?? "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [showCropModal, setShowCropModal] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const updateFormData = (updates: Partial<EditFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5_000_000) {
      toast.error("Image must be under 5 MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
      setShowCropModal(true);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const onCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop);
  };

  const handleCropConfirm = async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      toast.error("Please select a crop area");
      return;
    }

    try {
      await canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
      );

      previewCanvasRef.current.toBlob((blob) => {
        if (!blob) {
          toast.error("Failed to crop image");
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          setFormData(prev => ({
            ...prev,
            profilePicture: reader.result as string,
          }));
          setShowCropModal(false);
          setImgSrc('');
          toast.success("Image cropped successfully");
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.9);

    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error("Failed to crop image");
    }
  };

  /* ----- simple validation ----- */
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.locationCity.trim()) {
      newErrors.locationCity = "City is required";
    }

    if (!formData.locationState.trim()) {
      newErrors.locationState = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    // Update location coordinates immediately
    updateFormData({
      location: {
        type: "Point",
        coordinates: [lng, lat], 
      },
    });

    // Start reverse geocoding to get city and state
    setIsGeocodingLoading(true);
    
    try {
      const locationData = await reverseGeocode(lat, lng);
      
      if (locationData && (locationData.city || locationData.state)) {
        // Auto-fill city and state if found
        updateFormData({
          locationCity: locationData.city || formData.locationCity,
          locationState: locationData.state || formData.locationState,
        });
        
        // Clear any existing errors for these fields since they're now filled
        setErrors(prev => {
          const newErrors = { ...prev };
          if (locationData.city) delete newErrors.locationCity;
          if (locationData.state) delete newErrors.locationState;
          return newErrors;
        });
        
        toast.success(`Location updated: ${locationData.city}, ${locationData.state}`);
      } else {
        toast.warning("Location selected, but couldn't auto-detect city/state. Please fill manually.");
      }
    } catch (error) {
      console.error('Error getting location details:', error);
      toast.warning("Location selected, but couldn't auto-detect city/state. Please fill manually.");
    } finally {
      setIsGeocodingLoading(false);
    }
  }; 

  const onSave = async () => {
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Profile updated");
      if (onDataUpdate) await onDataUpdate(); 
      onClose();

    } catch (err: any) {
      if (err.response?.statusText?.includes('Payload Too Large')) {
        toast.error('Image size too large');
        return;
      }
      toast.error("Update failed — try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <>
      {/* Main Edit Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl">
          {/* header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className={`${lexendBold.className} text-2xl text-white`}>
                Edit Profile
              </h2>
              <p className={`${lexendSmall.className} text-gray-400`}>
                Update your personal information and preferences
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* content */}
          <div className="p-6 space-y-8">
            {/* avatar */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={
                    formData.profilePictureUrl ||
                    user.profilePictureUrl ||
                    "/api/placeholder/150/150"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                />
                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="hidden"
                  />
                </label>
              </div>
              <p className={`${lexendSmall.className} text-gray-400 mt-2`}>
                Click the camera icon to change your profile picture
              </p>
            </div>

            {/* form grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* personal details */}
              <div className="space-y-4">
                <h3 className={`${lexendBold.className} text-lg text-white border-b border-white/10 pb-2`}>
                  Personal Details
                </h3>

                <label className={`${lexendSmall.className} text-sm text-gray-200 block`}>
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={onInput}
                    placeholder="Enter your first name"
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:border-transparent backdrop-blur-sm ${
                      errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'
                    }`}
                  />
                  {errors.firstName && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.firstName}</span>
                  )}
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200 block`}>
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={onInput}
                    placeholder="Enter your last name"
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:border-transparent backdrop-blur-sm ${
                      errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'
                    }`}
                  />
                  {errors.lastName && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.lastName}</span>
                  )}
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200 block`}>
                  Date of Birth
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={onInput}
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:ring-2 focus:border-transparent backdrop-blur-sm ${
                      errors.dateOfBirth ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.dateOfBirth}</span>
                  )}
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200 block`}>
                  Gender
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={onInput}
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:ring-2 focus:border-transparent backdrop-blur-sm ${
                      errors.gender ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'
                    }`}
                  >
                    <option value="" className="bg-gray-800">Select Gender</option>
                    <option value="male" className="bg-gray-800">Male</option>
                    <option value="female" className="bg-gray-800">Female</option>
                    <option value="other" className="bg-gray-800">Other</option>
                  </select>
                  {errors.gender && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.gender}</span>
                  )}
                </label>
              </div>

              {/* contact & location */}
              <div className="space-y-4">
                <h3 className={`${lexendBold.className} text-lg text-white border-b border-white/10 pb-2`}>
                  Contact & Location
                </h3>

                <label className={`${lexendSmall.className} text-sm text-gray-200 block`}>
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onInput}
                    placeholder="Enter your phone number"
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:border-transparent backdrop-blur-sm ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.phone}</span>
                  )}
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200 block`}>
                  <MapPin className="w-4 h-4 inline mr-2" />
                  City
                  <div className="relative">
                    <input
                      type="text"
                      name="locationCity"
                      value={formData.locationCity}
                      onChange={onInput}
                      placeholder="Enter your city"
                      disabled={isGeocodingLoading}
                      className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:border-transparent backdrop-blur-sm ${
                        errors.locationCity ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'
                      } ${isGeocodingLoading ? 'opacity-50' : ''}`}
                    />
                    {isGeocodingLoading && (
                      <Loader2 className="absolute right-3 top-5 w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  {errors.locationCity && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.locationCity}</span>
                  )}
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200 block`}>
                  <MapPin className="w-4 h-4 inline mr-2" />
                  State
                  <div className="relative">
                    <input
                      type="text"
                      name="locationState"
                      value={formData.locationState}
                      onChange={onInput}
                      placeholder="Enter your state"
                      disabled={isGeocodingLoading}
                      className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:border-transparent backdrop-blur-sm ${
                        errors.locationState ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-blue-500'
                      } ${isGeocodingLoading ? 'opacity-50' : ''}`}
                    />
                    {isGeocodingLoading && (
                      <Loader2 className="absolute right-3 top-5 w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  {errors.locationState && (
                    <span className="text-red-400 text-xs mt-1 block">{errors.locationState}</span>
                  )}
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200 block`}>
                  <Globe className="w-4 h-4 inline mr-2" />
                  Preferred Language
                  <select
                    name="language"
                    value={formData.language}
                    onChange={onInput}
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                  >
                    <option value="en" className="bg-gray-800">English</option>
                    <option value="hi" className="bg-gray-800">हिंदी</option>
                    <option value="es" className="bg-gray-800">Español</option>
                    <option value="fr" className="bg-gray-800">Français</option>
                    <option value="de" className="bg-gray-800">Deutsch</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Map section */}
            <div className="space-y-4">
              <h3 className={`${lexendBold.className} text-lg text-white border-b border-white/10 pb-2 flex items-center gap-2`}>
                Location on Map
                {isGeocodingLoading && (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                )}
              </h3>
              <p className={`${lexendSmall.className} text-gray-400 mb-4`}>
                Click on the map to select your location. City and state will be auto-filled.
              </p>
              <MapLocationPicker
                onLocationSelect={handleMapLocationSelect}
                initialPosition={[
                  formData?.location?.coordinates?.[1] || 28.7041,
                  formData?.location?.coordinates?.[0] || 77.1025  
                ]}
              />
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className={`${lexendMedium.className} px-6 py-3 bg-white text-black hover:bg-white/5 border hover:text-white hover:border-gray-400 rounded-lg transition-all`}
            >
              Cancel
            </button>

            <button
              onClick={onSave}
              disabled={isLoading || isGeocodingLoading}
              className={`${lexendMedium.className} px-6 py-3 bg-white text-black hover:bg-white/5 border hover:text-white rounded-lg shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Crop Modal - same as before */}
      {showCropModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className={`${lexendBold.className} text-xl text-white`}>
                  Crop Profile Picture
                </h3>
                <p className={`${lexendSmall.className} text-gray-400`}>
                  Adjust the crop area to create a perfect square image
                </p>
              </div>
              <button
                onClick={() => setShowCropModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-center mb-6">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => onCropComplete(c)}
                  aspect={1}
                  minWidth={100}
                  minHeight={100}
                  className="max-w-full max-h-96"
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    style={{ maxHeight: '400px', maxWidth: '100%' }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>

              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() => setShowCropModal(false)}
                  className={`${lexendMedium.className} px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropConfirm}
                  className={`${lexendMedium.className} px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-lg transition-all flex items-center gap-2`}
                >
                  <Check className="w-4 h-4" />
                  Crop Image
                </button>
              </div>
            </div>
          </div>

          <canvas
            ref={previewCanvasRef}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </>
  );
};

export default EditProfileModal;
