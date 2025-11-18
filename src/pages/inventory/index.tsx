import Navbar from "@/components/Navbar";

const Inventory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Inventory Management</h1>
        <p className="text-muted-foreground">Manage stock levels and inventory.</p>
      </main>
    </div>
  );
};

export default Inventory;
