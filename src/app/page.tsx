import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/landing/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-block px-4 py-2 bg-muted rounded-full text-sm font-medium text-muted-foreground mb-6 border border-border shadow-sm">
            ✨ AI-Powered Form Builder
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
            Build Forms with
            <br />
            <span className="gradient-text">
              AI Magic
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Create stunning, intelligent forms in minutes. No coding required, just pure AI-powered simplicity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gradient-primary text-primary-foreground px-10 py-6 text-lg glow-shadow hover:scale-105 transition-all">
              Start Building Free
            </Button>
            <Button size="lg" className="glass-card border-secondary text-secondary hover:bg-secondary/10 px-10 py-6 text-lg shadow-lg hover:scale-105 transition-all">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Fomi?
            </h2>
            <p className="text-muted-foreground text-lg">Everything you need to create amazing forms</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card glow-shadow rounded-3xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
                  <div className="w-8 h-8 bg-primary-foreground rounded-lg"></div>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">AI-Powered</h3>
                <p className="text-muted-foreground leading-relaxed">Generate forms automatically with intelligent field suggestions and smart layouts</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card glow-shadow rounded-3xl hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-secondary/25">
                  <div className="w-8 h-8 bg-secondary-foreground rounded-lg"></div>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">No Code</h3>
                <p className="text-muted-foreground leading-relaxed">Build complex forms without writing a single line of code using our visual editor</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card glow-shadow rounded-3xl hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent/25">
                  <div className="w-8 h-8 bg-accent-foreground rounded-lg"></div>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">Track form performance with detailed insights and beautiful reports</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="glass-card rounded-3xl p-12 glow-shadow border border-border">
            <h2 className="text-5xl font-bold text-foreground mb-6">
              Ready to Build Better Forms?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of businesses using Fomi to create engaging, intelligent forms
            </p>
            <Button size="lg" className="gradient-primary text-primary-foreground px-12 py-6 text-lg glow-shadow hover:scale-105 transition-all">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            © 2024 Fomi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}