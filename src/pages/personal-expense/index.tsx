import Navbar from "@/components/Navbar";

const PersonalExpense = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Personal Expense</h1>
        <p className="text-muted-foreground">Track personal expenses and budgets.</p>
      </main>
    </div>
  );
};

export default PersonalExpense;
