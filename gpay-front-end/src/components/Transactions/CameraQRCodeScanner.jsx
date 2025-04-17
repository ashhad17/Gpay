// src/pages/CameraQRCodeScanner.jsx
import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const CameraQRCodeScanner = () => {
  const qrCodeRegionId = "qr-reader";
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

    html5QrCodeRef.current.start(
      { facingMode: "environment" }, // rear camera
      {
        fps: 10,
        qrbox: 250
      },
      (decodedText, decodedResult) => {
        console.log("QR Code detected: ", decodedText);
        handleQRScan(decodedText);
        html5QrCodeRef.current.stop(); // stop camera after successful scan
      },
      (errorMessage) => {
        // console.warn(`QR scan error: ${errorMessage}`);
      }
    );

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleQRScan = (text) => {
    try {
      const data = JSON.parse(text);
      const amount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;

      if (data.receiverPhone && typeof amount === 'number') {
        navigate('/send-money', {
          state: {
            receiverPhone: data.receiverPhone,
            amount: amount
          }
        });
      } else {
        alert("Invalid QR format");
      }
    } catch (e) {
      // Fallback for fixed QR
      if (/^\d{10}$/.test(text)) {
        navigate('/send-money', {
          state: {
            receiverPhone: text,
            amount: 0
          }
        });
      } else {
        alert("Invalid QR code");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Scan QR Using Camera</h2>
      <div id={qrCodeRegionId} className="w-full" />
    </div>
  );
};

export default CameraQRCodeScanner;
