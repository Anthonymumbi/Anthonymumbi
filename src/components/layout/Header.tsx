import { Shield, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onAdminClick?: () => void;
}

const Header = ({ onAdminClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();

  const handleAdminClick = () => {
    if (isAdmin) {
      logout();
      navigate("/");
    } else {
      navigate("/admin-login");
    }
  };

  return (
    <header className="gradient-header text-primary-foreground">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">
                Kwenyu
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => navigate("/analytics")}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/20 transition-all duration-200 flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
                <button
                  onClick={() => navigate("/members")}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/20 transition-all duration-200"
                >
                  Members
                </button>
              </>
            )}
            <button
              onClick={handleAdminClick}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/20 transition-all duration-200"
            >
              {isAdmin ? "Logout" : "Admin Login"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
