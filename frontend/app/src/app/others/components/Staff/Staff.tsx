import React from 'react';
import StaffAccount from './StaffAccount';
import QRScanner from './QRScanner';

interface StaffProps {
  activeTab: 'account' | 'scanner';
}

const Staff: React.FC<StaffProps> = ({ activeTab }) => {
  return (
    <div className="min-h-screen">
      {activeTab === 'account' && <StaffAccount />}
      {activeTab === 'scanner' && <QRScanner />}
    </div>
  );
};

export default Staff;
