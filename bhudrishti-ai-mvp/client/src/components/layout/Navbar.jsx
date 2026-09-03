import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Map,
  BarChart3,
  BookOpen,
  Home,
  Menu,
  X,
  MoreHorizontal,
  Sparkles,
  Search,
  BrainCircuit,
  FlaskConical,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/land-explorer", label: "Land Explorer", icon: Map },
    { path: "/research", label: "Research Hub", icon: BookOpen },
  ];

  const menuLinks = user
    ? [
        { path: "/analytics", label: "Analytics", icon: BarChart3 },
        { path: "/land-check", label: "LandCheck", icon: Search },
        { path: "/ai-insights", label: "AI Insights", icon: BrainCircuit },
      ]
    : [];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-md border-b border-slate-200"
          : "bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                BhuDrishti AI
              </span>
              <span className="text-[10px] text-slate-500 -mt-1 tracking-wider">
                LAND INTELLIGENCE
              </span>
            </div>
          </Link>

          {/* Public navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive(link.path)
                      ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Menu and Login */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={
                isMobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMobileOpen}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <span className="hidden md:block">
                {isMobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <MoreHorizontal className="w-6 h-6" />
                )}
              </span>
              <span className="md:hidden">
                {isMobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </span>
            </button>
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 font-semibold text-sm hover:text-blue-600"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-slate-700 font-semibold text-sm hover:text-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* More navigation */}
        {isMobileOpen && (
          <div className="absolute right-4 top-16 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-fade-in md:right-6 lg:right-8">
            {[...menuLinks, ...navLinks].map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                    isActive(link.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            {user && (
              <>
                <Link
                  to="/policy-simulation"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  <FlaskConical className="w-5 h-5" /> Policy Simulation
                </Link>
                <Link
                  to="/verification"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  <ShieldCheck className="w-5 h-5" /> Verification
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
