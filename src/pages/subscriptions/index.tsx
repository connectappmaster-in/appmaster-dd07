import Navbar from "@/components/Navbar";

const Subscriptions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Subscriptions</h1>
        <p className="text-muted-foreground">Manage customer subscriptions and recurring payments.</p>
      </main>
    </div>
  );
};

export default Subscriptions;
