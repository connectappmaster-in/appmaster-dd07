import Navbar from "@/components/Navbar";

const Tickets = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Tickets</h1>
        <p className="text-muted-foreground">Manage support tickets and issues.</p>
      </main>
    </div>
  );
};

export default Tickets;
