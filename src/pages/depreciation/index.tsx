import Navbar from "@/components/Navbar";

const Depreciation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Depreciation Management</h1>
        <p className="text-muted-foreground">Track and manage asset depreciation.</p>
      </main>
    </div>
  );
};

export default Depreciation;
