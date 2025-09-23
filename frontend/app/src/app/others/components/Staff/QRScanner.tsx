"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Lexend } from 'next/font/google';
import { Camera, AlertCircle, CheckCircle, XCircle, Scan, Check, X } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { verifyTicket } from '../../services/ownerServices/staffServices';

const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendRegular = Lexend({ weight: "400", subsets: ["latin"] });

const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [cameraReady, setCameraReady] = useState(false);
  
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [scannedQRData, setScannedQRData] = useState<string>('');
  const [ticketId, setTicketId] = useState<string>('');
  
  const [showResultModal, setShowResultModal] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    checkCameraPermission();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (isScanning && videoRef.current && !qrScannerRef.current) {
      initializeScanner();
    }
  }, [isScanning, videoRef.current]);

  const checkCameraPermission = async () => {
    try {
      const hasCamera = await QrScanner.hasCamera();
      
      if (!hasCamera) {
        setError('No camera found on this device');
        setHasPermission(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (err) {
        setHasPermission(false);
      }
    } catch (error) {
      console.error('Error checking camera:', error);
      setHasPermission(false);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setError('');
    setCameraReady(false);
    setShowConfirmPopup(false);
    setScanResult(null);
    setShowResultModal(false);
    setVerificationResult(null);
  };

  const initializeScanner = async () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      
      video.addEventListener('loadedmetadata', () => {
        setCameraReady(true);
      });
      
      video.addEventListener('canplay', () => {
        setCameraReady(true);
      });

      video.addEventListener('playing', () => {
        setCameraReady(true);
      });

      qrScannerRef.current = new QrScanner(
        video,
        (result) => {
          console.log('🔍 QR Code Detected:', result.data);
          
          const qrData = result.data;
          
          pauseScanning();
          setScannedQRData(qrData);
          setShowConfirmPopup(true);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
          maxScansPerSecond: 1,
        }
      );

      await qrScannerRef.current.start();
      console.log('✅ QR Scanner initialized successfully');
      
      setTimeout(() => {
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(console.error);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Failed to initialize scanner:', error);
      setError(`Failed to start camera: ${error}`);
      setIsScanning(false);
    }
  };

  const pauseScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
  };

  const resumeScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.start().catch(console.error);
    }
  };

  const stopCamera = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setCameraReady(false);
    setIsScanning(false);
    setShowConfirmPopup(false);
  };

  const handleVerifyTicket = async () => {
    setIsLoading(true);
    setShowConfirmPopup(false);
    
    try {
      console.log('sns becomes ', scannedQRData);
      
      const data = await verifyTicket(scannedQRData);
      console.log('api verified data:', data);
      
      setVerificationResult(data);
      setShowResultModal(true);
      stopCamera();
      
    } catch (error) {
      console.log(error);
      
      setVerificationResult({
        success: false,
        message: error.response.data.message,
        data: null
      });
      setShowResultModal(true);
      stopCamera();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelVerification = () => {
    setShowConfirmPopup(false);
    setScannedQRData('');
    setTicketId('');
    resumeScanning();
  };

  const resetScanner = () => {
    setScanResult(null);
    setError('');
    setIsScanning(false);
    setCameraReady(false);
    setShowConfirmPopup(false);
    setScannedQRData('');
    setTicketId('');
    setShowResultModal(false);
    setVerificationResult(null);
    if (qrScannerRef.current) {
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour12 = parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours);
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12 === 0 ? 12 : hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className={`${lexendBold.className} text-3xl text-white mb-2`}>
          QR Code Scanner
        </h1>
        <p className={`${lexendRegular.className} text-gray-400`}>
          Scan ticket QR codes for verification
        </p>
      </div>

      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className={`${lexendRegular.className} text-red-400`}>
                {error}
              </p>
            </div>
          </div>
        )}

        {hasPermission === null ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className={`${lexendRegular.className} text-gray-400`}>
              Checking camera availability...
            </p>
          </div>
        ) : hasPermission === false ? (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className={`${lexendMedium.className} text-xl text-white mb-2`}>
              Camera Access Required
            </h3>
            <p className={`${lexendRegular.className} text-gray-400 mb-6`}>
              We need camera access to scan QR codes on tickets
            </p>
            <button
              onClick={startScanning}
              className={`${lexendMedium.className} px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors`}
            >
              Allow Camera Access
            </button>
          </div>
        ) : !isScanning && !scanResult && !showResultModal ? (
          <div className="text-center py-12">
            <Scan className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className={`${lexendMedium.className} text-xl text-white mb-2`}>
              Ready to Scan
            </h3>
            <p className={`${lexendRegular.className} text-gray-400 mb-6`}>
              Point your camera at a ticket QR code
            </p>
            <button
              onClick={startScanning}
              className={`${lexendMedium.className} px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors`}
            >
              Start Scanning
            </button>
          </div>
        ) : isScanning ? (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-gray-600">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                }}
              />
              
              {!cameraReady && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className={`${lexendRegular.className} text-white`}>
                      Starting camera...
                    </p>
                  </div>
                </div>
              )}
              
              {cameraReady && !isLoading && !showConfirmPopup && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <div className="w-64 h-64 border-2 border-white/50 rounded-xl"></div>
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-xl"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-1 bg-blue-400 opacity-60 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className={`${lexendMedium.className} text-white text-lg`}>
                      Verifying Ticket...
                    </p>
                    <p className={`${lexendRegular.className} text-gray-400 text-sm mt-2`}>
                      Please wait
                    </p>
                  </div>
                </div>
              )}

              {!isLoading && !showConfirmPopup && cameraReady && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
                  <div className="bg-black/70 px-4 py-2 rounded-lg">
                    <p className={`${lexendRegular.className} text-white text-sm text-center`}>
                      Position QR code within the frame
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <p className={`${lexendRegular.className} text-gray-400 mb-4`}>
                {isLoading ? 'Verifying ticket...' : showConfirmPopup ? 'QR Code detected!' : 'Scanning for QR codes...'}
              </p>
              <button
                onClick={stopCamera}
                disabled={isLoading}
                className={`${lexendMedium.className} px-6 py-3 border border-gray-500/30 text-gray-300 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50`}
              >
                {isLoading ? 'Processing...' : 'Stop Scanning'}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-black/90 border border-gray-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scan className="w-8 h-8 text-blue-400" />
              </div>
              
              <h3 className={`${lexendBold.className} text-xl text-white mb-2`}>
                QR Code Detected!
              </h3>
              
              <p className={`${lexendRegular.className} text-gray-400 mb-6`}>
                Do you want to verify this ticket?
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={handleCancelVerification}
                  className={`${lexendMedium.className} flex-1 px-4 py-3 border border-gray-500/30 text-gray-300 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2`}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                
                <button
                  onClick={handleVerifyTicket}
                  className={`${lexendMedium.className} flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2`}
                >
                  <Check className="w-4 h-4" />
                  Verify Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Result Modal */}
      {showResultModal && verificationResult && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-black/90 border border-gray-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              {verificationResult.success ? (
                <>
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                  
                  <h3 className={`${lexendBold.className} text-2xl text-green-400 mb-2`}>
                    Ticket Verified Successfully!
                  </h3>
                  
                  <p className={`${lexendRegular.className} text-gray-300 mb-6`}>
                    Entry granted - Customer may proceed
                  </p>

                  {/* Ticket Details */}
                  {verificationResult.data?.ticket && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6 text-left">
                      <h4 className={`${lexendMedium.className} text-white text-lg mb-4 text-center`}>
                        Ticket Details
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={`${lexendRegular.className} text-gray-400`}>Movie:</span>
                          <span className={`${lexendMedium.className} text-white text-right`}>
                            {verificationResult.data.ticket.movieTitle}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className={`${lexendRegular.className} text-gray-400`}>Theater:</span>
                          <span className={`${lexendMedium.className} text-white text-right`}>
                            {verificationResult.data.ticket.theater}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className={`${lexendRegular.className} text-gray-400`}>Screen:</span>
                          <span className={`${lexendMedium.className} text-white text-right`}>
                            {verificationResult.data.ticket.screen}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className={`${lexendRegular.className} text-gray-400`}>Date:</span>
                          <span className={`${lexendMedium.className} text-white text-right`}>
                            {formatDate(verificationResult.data.ticket.showDate)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className={`${lexendRegular.className} text-gray-400`}>Time:</span>
                          <span className={`${lexendMedium.className} text-white text-right`}>
                            {formatTime(verificationResult.data.ticket.showTime)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className={`${lexendRegular.className} text-gray-400`}>Seat:</span>
                          <span className={`${lexendMedium.className} text-white text-right`}>
                            {verificationResult.data.ticket.seat} ({verificationResult.data.ticket.seatType})
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className={`${lexendRegular.className} text-gray-400`}>Price:</span>
                          <span className={`${lexendMedium.className} text-green-400 text-right`}>
                            ₹{verificationResult.data.ticket.price}
                          </span>
                        </div>
                        
                        {verificationResult.data.customer?.name && verificationResult.data.customer.name !== "N/A" && (
                          <div className="flex justify-between">
                            <span className={`${lexendRegular.className} text-gray-400`}>Customer:</span>
                            <span className={`${lexendMedium.className} text-white text-right`}>
                              {verificationResult.data.customer.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-12 h-12 text-red-400" />
                  </div>
                  
                  <h3 className={`${lexendBold.className} text-2xl text-red-400 mb-2`}>
                    Verification Failed
                  </h3>
                  
                  <p className={`${lexendRegular.className} text-gray-300 mb-4`}>
                    {verificationResult.message || 'Invalid or already used ticket'}
                  </p>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                    <p className={`${lexendRegular.className} text-red-400 text-sm`}>
                      This ticket cannot be used for entry. Ticket used or expired.
                    </p>
                  </div>
                </>
              )}
              
              <button
                onClick={resetScanner}
                className={`${lexendMedium.className} w-full px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2`}
              >
                <X className="w-4 h-4" />
                Close & Scan Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
