import React from "react";
import { IScreen } from "./inedx";

interface ScreenDetailsModalProps {
  screen: IScreen;
  onClose: () => void;
}

const ScreenDetailsModal: React.FC<ScreenDetailsModalProps> = ({ screen, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
    <div className="bg-[#1a1a1a] rounded-lg border border-gray-600 p-8 max-w-lg w-full">
      <h2 className="text-2xl text-white mb-4">Screen Details</h2>
      <div className="text-white space-y-1">
        <div>
          <b>Name:</b> {screen.name}
        </div>
        <div>
          <b>Total Seats:</b> {screen.totalSeats}
        </div>
        <div>
          <b>Status:</b> {screen.isActive ? "Active" : "Disabled"}
        </div>
        <div>
          <b>Features:</b>{" "}
          {screen.features && screen.features.length > 0
            ? screen.features.join(", ")
            : "None"}
        </div>
        <div>
          <b>Screen Type:</b> {screen.screenType || "N/A"}
        </div>
        <div>
          <b>Layout:</b>{" "}
          {screen.layout
            ? `${screen.layout.rows} rows x ${screen.layout.seatsPerRow} seats/row`
            : "N/A"}
        </div>
        {/* Add more details as necessary */}
      </div>
      <div className="text-right mt-6">
        <button
          className="px-4 py-2 rounded bg-[#e78f03] text-black font-medium"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default ScreenDetailsModal;
