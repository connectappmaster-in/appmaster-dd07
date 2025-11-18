import Navbar from "@/components/Navbar";

const ShopIncomeExpense = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Shop Income & Expense</h1>
        <p className="text-muted-foreground">Track shop revenue and expenses.</p>
      </main>
    </div>
  );
};

export default ShopIncomeExpense;
