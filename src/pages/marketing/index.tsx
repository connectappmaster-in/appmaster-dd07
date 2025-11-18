import Navbar from "@/components/Navbar";

const Marketing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Marketing</h1>
        <p className="text-muted-foreground">Manage marketing campaigns and analytics.</p>
      </main>
    </div>
  );
};

export default Marketing;
