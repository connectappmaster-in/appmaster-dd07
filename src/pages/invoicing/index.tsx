import Navbar from "@/components/Navbar";

const Invoicing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Invoicing</h1>
        <p className="text-muted-foreground">Create and manage invoices.</p>
      </main>
    </div>
  );
};

export default Invoicing;
