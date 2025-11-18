import Navbar from "@/components/Navbar";

const CustomersListPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Customers</h1>
        <p className="text-muted-foreground">Customer management coming soon.</p>
      </main>
    </div>
  );
};

export default CustomersListPage;
