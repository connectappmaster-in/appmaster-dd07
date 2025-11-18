import Navbar from "@/components/Navbar";

const Attendance = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Attendance Management</h1>
        <p className="text-muted-foreground">Track employee attendance and leave.</p>
      </main>
    </div>
  );
};

export default Attendance;
