import Navbar from "@/components/Navbar";

const NewLeadPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">New Lead</h1>
        <p className="text-muted-foreground">Create new lead form coming soon.</p>
      </main>
    </div>
  );
};

export default NewLeadPage;
