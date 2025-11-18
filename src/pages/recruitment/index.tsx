import Navbar from "@/components/Navbar";

const Recruitment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Recruitment</h1>
        <p className="text-muted-foreground">Manage job postings and applications.</p>
      </main>
    </div>
  );
};

export default Recruitment;
