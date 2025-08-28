"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapLocationPickerProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
  readOnly?: boolean; 
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  onLocationSelect,
  initialPosition = [28.7041, 77.1025],
  readOnly = false
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition[0] !== 0 && initialPosition[1] !== 0
      ? initialPosition
      : null
  );

   function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        if (!readOnly) {
          const { lat, lng } = e.latlng;
          setPosition([lat, lng]);
          if (onLocationSelect) {
            onLocationSelect(lat, lng);
          }
        }
      },
    });


    useEffect(() => {
      if (position) {
        map.flyTo(position, map.getZoom());
      }
    }, [position, map]);

    return position === null ? null : <Marker position={position} />;
  }

  return (
    <>
      <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-500/30">
        <MapContainer
          center={initialPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
         scrollWheelZoom={!readOnly} 
                    dragging={!readOnly} 
          touchZoom={!readOnly} 
          doubleClickZoom={!readOnly} 
          boxZoom={!readOnly} 
          keyboard={!readOnly} 

        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>
      </div>
    </>
  );
};

export default MapLocationPicker;
