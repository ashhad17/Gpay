import QRGenerator from '../../components/Transactions/QRGenerator';

export default function QRPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Generate Payment QR</h1>
      <QRGenerator />
    </div>
  );
}