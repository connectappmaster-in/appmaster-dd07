import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Layers, Code, Rocket } from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">AppMaster</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">Build apps faster than ever</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Master Your App
              <br />
              <span className="text-primary">Development Journey</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create, deploy, and scale beautiful applications without the complexity. 
              AppMaster gives you all the tools you need in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Start Building Free
              </Button>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <img 
              src={heroImage} 
              alt="AppMaster Dashboard Interface" 
              className="relative z-10 rounded-xl border border-border shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need to build
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you create professional applications with ease
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Build and deploy apps in minutes, not days. Our optimized workflow gets you to production faster.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Bank-level security built in. Your data and applications are protected by industry-leading standards.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Full Control</h3>
              <p className="text-muted-foreground">
                Access your code anytime. No lock-in, no limitations. Export and customize as you need.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Component Library</h3>
              <p className="text-muted-foreground">
                Hundreds of pre-built components ready to use. Drag, drop, and customize to your needs.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Auto Scaling</h3>
              <p className="text-muted-foreground">
                Handle millions of users effortlessly. Our infrastructure scales automatically with your growth.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI Powered</h3>
              <p className="text-muted-foreground">
                Let AI help you build. Generate components, optimize code, and get intelligent suggestions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-12">
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Ready to build something amazing?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of developers who are already building the future with AppMaster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  Start for Free
                </Button>
                <Button variant="outline" size="lg">
                  Schedule Demo
                </Button>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50" />
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">© 2024 AppMaster. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
