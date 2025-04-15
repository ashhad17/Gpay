import SendMoneyForm from '../../components/Transactions/SendMoneyForm';

export default function SendMoneyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Send Money</h1>
      <SendMoneyForm />
    </div>
  );
}