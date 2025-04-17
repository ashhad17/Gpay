import React, { useState } from 'react';
import QrCode from 'qrcode-reader';
import { Jimp } from 'jimp';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';

const QRCodeScanner = () => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setMessage('Please select a QR code image.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const buffer = Buffer.from(event.target.result);
        const image = await Jimp.read(buffer);

        const qr = new QrCode();
        qr.callback = function (err, value) {
          if (err || !value) {
            setMessage('Unable to read QR Code');
            return;
          }
          try {
            const data = JSON.parse(value.result);

            // Ensure the amount is treated as a number
            const amount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;

            if (data.receiverPhone && typeof amount === 'number') {
              // ✅ Dynamic QR
              navigate('/send-money', {
                state: {
                  receiverPhone: data.receiverPhone,
                  amount: amount
                }
              });
            } else {
              setMessage('Invalid dynamic QR code format');
            }

          } catch (e) {
            // ✅ Fixed QR - fallback (only phone number)
            if (/^\d{10}$/.test(value.result)) {
              navigate('/send-money', {
                state: {
                  receiverPhone: value.result,
                  amount: 0
                }
              });
            } else {
              setMessage('QR code is not valid');
            }
          }
        };

        qr.decode(image.bitmap);
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error('Error scanning QR:', error);
      setMessage('Something went wrong while scanning QR');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleScan}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Scan & Continue
      </button>
      <button
  className="bg-green-600 text-white px-4 py-2 rounded"
  onClick={() => navigate('/camera-qr')}
>
  Scan QR with Camera
</button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default QRCodeScanner;
