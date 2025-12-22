import Header from "@/components/layout/Header";
import Logo from "@/components/layout/Logo";
import RegistrationForm from "@/components/RegistrationForm";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const handleAdminClick = () => {
    // Placeholder for admin login functionality
    console.log("Admin login clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onAdminClick={handleAdminClick} />
      
      <main className="container max-w-md pb-8">
        <Logo />
        
        <div 
          className="bg-card rounded-2xl shadow-card p-6 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <RegistrationForm />
        </div>
        
        <footer className="text-center mt-8 pb-4">
          <p className="text-xs text-muted-foreground">
            © 2024 The Movement for Good Governance. All rights reserved.
          </p>
        </footer>
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
