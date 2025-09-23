'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  data: string; 
  size?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ data, size = 128 }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        setLoading(true);
        setError('');

        const encodedData = encodeURIComponent(data); 

        const verificationUrl = encodedData
        
        const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
          errorCorrectionLevel: 'H',
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        setQrCodeUrl(qrDataUrl);
      } catch (err) {
        console.error('QR code generation failed:', err);
        setError('Failed to generate QR code');
      } finally {
        setLoading(false);
      }
    };

    if (data) {
      generateQR();
    }
  }, [data, size]);

  if (loading) {
    return (
      <div className={`w-${size/4} h-${size/4} bg-gray-200 rounded flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-${size/4} h-${size/4} bg-red-100 rounded flex items-center justify-center`}>
        <span className="text-xs text-red-600">{error}</span>
      </div>
    );
  }

  return (
    <img 
      src={qrCodeUrl} 
      alt="QR Code" 
      className="rounded"
      style={{ width: size, height: size }}
    />
  );
};

export default QRCodeDisplay;
