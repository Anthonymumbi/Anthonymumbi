import { Users } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center py-8 animate-fade-in">
      <div className="relative">
        <div className="w-24 h-24 rounded-full gradient-header flex items-center justify-center shadow-card">
          <Users className="w-12 h-12 text-primary-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full gradient-accent flex items-center justify-center shadow-soft">
          <span className="text-accent-foreground text-xs font-bold">UPND</span>
        </div>
      </div>
      
      <div className="text-center mt-6 space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          LETS MOVE TOGETHER
        </h1>
        <p className="text-muted-foreground text-sm">
          LETS TAKE GOOD GOVERNANCE TO THE NEXT LEVEL
        </p>
        <p className="text-accent font-semibold text-sm animate-pulse-soft">
          FOR ALL CITIZEN
        </p>
      </div>
    </div>
  );
};

export default Logo;
