import WalletBalance from "../components/Wallet/WalletBalance";

export default function WalletPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wallet</h1>
      <WalletBalance />
    </div>
  );
}