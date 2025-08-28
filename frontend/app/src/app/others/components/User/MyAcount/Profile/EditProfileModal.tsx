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
  Crop as CropIcon,
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

/* ---------- component ---------- */
const EditProfileModal = ({ user, onClose, onDataUpdate }: EditProfileModalProps) => {
  /* ----- state ----- */
  const [isLoading, setIsLoading] = useState(false);
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

  /* ----- validation ----- */
  const validate = (d: EditFormData): string => {
    if (!d.firstName.trim()) return "First name is required";
    if (!d.lastName.trim()) return "Last name is required";
    if (!d.dateOfBirth) return "Date of birth is required";
    if (!d.gender) return "Please select a gender";
    if (!d.phone.trim()) return "Phone number is required";
    if (!d.locationCity.trim()) return "City is required";
    if (!d.locationState.trim()) return "State is required";
    return "";
  };

  const isFormValid = !validate(formData);

  const handleMapLocationSelect = (lat: number, lng: number) => {
    updateFormData({
      location: {
        type: "Point",
        coordinates: [lng, lat], 
      },
    });
  };

  const onSave = async () => {
    const errMsg = validate(formData);
    if (errMsg) {
      toast.error(errMsg);
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
                    formData.profilePicture ||
                    user.profilePicture ||
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

                <label className={`${lexendSmall.className} text-sm text-gray-200`}>
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={onInput}
                    placeholder="Enter your first name"
                    maxLength={50}
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                  />
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200`}>
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={onInput}
                    placeholder="Enter your last name"
                    maxLength={50}
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                  />
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200`}>
                  Date of Birth
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={onInput}
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                  />
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200`}>
                  Gender
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={onInput}
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                  >
                    <option value="" className="bg-gray-800">Select Gender</option>
                    <option value="male" className="bg-gray-800">Male</option>
                    <option value="female" className="bg-gray-800">Female</option>
                    <option value="other" className="bg-gray-800">Other</option>
                  </select>
                </label>
              </div>

              {/* contact & location */}
              <div className="space-y-4">
                <h3 className={`${lexendBold.className} text-lg text-white border-b border-white/10 pb-2`}>
                  Contact & Location
                </h3>

                <label className={`${lexendSmall.className} text-sm text-gray-200`}>
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onInput}
                    placeholder="Enter your phone number"
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                  />
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200`}>
                  <MapPin className="w-4 h-4 inline mr-2" />
                  City
                  <input
                    type="text"
                    name="locationCity"
                    value={formData.locationCity}
                    onChange={onInput}
                    placeholder="Enter your city"
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                  />
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200`}>
                  <MapPin className="w-4 h-4 inline mr-2" />
                  State
                  <input
                    type="text"
                    name="locationState"
                    value={formData.locationState}
                    onChange={onInput}
                    placeholder="Enter your state"
                    className={`${lexendMedium.className} mt-2 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm`}
                  />
                </label>

                <label className={`${lexendSmall.className} text-sm text-gray-200`}>
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

            {/* ✅ Fixed map section */}
            {formData.location && (
              <div className="space-y-4">
                <h3 className={`${lexendBold.className} text-lg text-white border-b border-white/10 pb-2`}>
                  Location on Map
                </h3>
                <MapLocationPicker
                  onLocationSelect={handleMapLocationSelect}
                  initialPosition={[
                    formData.location.coordinates[1] || 28.7041,
                    formData.location.coordinates[0] || 77.1025  
                  ]}
                />
              </div>
            )}
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className={`${lexendMedium.className} px-6 py-3 bg-white text-black hover:bg-white/5 border hover:text-white hover:border-gray-400 rounded-lg  transition-all`}
            >
              Cancel
            </button>

            <button
              onClick={onSave}
              disabled={isLoading || !isFormValid}
              className={`${lexendMedium.className} px-6 py-3  bg-white text-black hover:bg-white/5 border  hover:text-white rounded-lg shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
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

      {/* Crop Modal */}
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

            {/* crop content */}
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

              {/* crop buttons */}
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

          {/* Hidden canvas for processing */}
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
