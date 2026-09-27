import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Map,
  BarChart3,
  BookOpen,
  Home,
  Menu,
  X,
  Sparkles,
  Search,
  BrainCircuit,
  FlaskConical,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  UserCircle,
  ChevronDown,
  Database,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const accountMenuRef = useRef(null);
  const menuRef = useRef(null);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMenus = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setIsAccountOpen(false);
      }
      if (!menuRef.current?.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const desktopNavLinks = [
    { path: "/", label: "Home", icon: Home },
    ...(!user
      ? [{ path: "/land-explorer", label: "Land Explorer", icon: Map }]
      : []),
    {
      path: "/land-intelligence",
      label: "Land Intelligence",
      icon: BrainCircuit,
    },
    { path: "/research", label: "Research Hub", icon: BookOpen },
  ];

  const desktopToolGroups = user
    ? [
        {
          label: "Explore",
          icon: Search,
          items: [
            {
              path: "/land-explorer",
              label: "Land Explorer",
              description: "Explore parcels and GIS layers",
              icon: Map,
            },
            ...(user
              ? [
                  {
                    path: "/land-check",
                    label: "LandCheck",
                    description: "Check available land context",
                    icon: Search,
                    roles: ["citizen", "researcher", "government", "admin"],
                  },
                ]
              : []),
          ],
        },
        ...(user
          ? [
              {
                label: "Intelligence",
                icon: BrainCircuit,
                items: [
                  {
                    path: "/ai-insights",
                    label: "AI Insights",
                    description: "Understand land data with AI",
                    icon: BrainCircuit,
                    roles: ["citizen", "researcher", "government", "admin"],
                  },
                  {
                    path: "/analytics",
                    label: "Analytics",
                    description: "Discover trends and spatial insights",
                    icon: BarChart3,
                    roles: ["researcher", "government", "admin"],
                  },
                  {
                    path: "/policy-simulation",
                    label: "Policy Simulation",
                    description: "Explore possible policy outcomes",
                    icon: FlaskConical,
                    roles: ["researcher", "government", "admin"],
                  },
                ],
              },
              {
                label: "Workspace",
                icon: LayoutDashboard,
                items: [
                  {
                    path: "/dashboard",
                    label: "Dashboard",
                    description: "Overview and activity",
                    icon: LayoutDashboard,
                    roles: ["citizen", "researcher", "government", "admin"],
                  },
                  {
                    path: "/verification",
                    label: "Verification",
                    description: "Verify document integrity",
                    icon: ShieldCheck,
                    roles: ["citizen", "researcher", "government", "admin"],
                  },
                  {
                    path: "/datasets",
                    label: "Datasets",
                    description: "Explore land and geospatial datasets",
                    icon: Database,
                    roles: ["researcher", "admin"],
                  },
                ],
              },
            ]
          : []),
      ]
    : [];

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/land-explorer", label: "Land Explorer", icon: Map },
    {
      path: "/land-intelligence",
      label: "Land Intelligence",
      icon: BrainCircuit,
    },
    { path: "/research", label: "Research Hub", icon: BookOpen },
  ];

  const menuLinks = user
    ? [
        { path: "/analytics", label: "Analytics", icon: BarChart3 },
        { path: "/land-check", label: "LandCheck", icon: Search },
        { path: "/ai-insights", label: "AI Insights", icon: BrainCircuit },
      ]
    : [];

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);
  const isGroupActive = (items) => items.some((item) => isActive(item.path));

  const visibleItems = (items) =>
    items.filter(
      (item) => !item.roles || (user && item.roles.includes(user.role)),
    );

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
          <div
            className="hidden md:flex items-center gap-1 ml-10"
            ref={menuRef}
          >
            {[...desktopNavLinks, ...desktopToolGroups].map((link) => {
              const Icon = link.icon;
              if (link.items) {
                const items = visibleItems(link.items);
                const isOpen = openMenu === link.label;
                return (
                  <div className="relative" key={link.label}>
                    <button
                      type="button"
                      onClick={() => setOpenMenu(isOpen ? null : link.label)}
                      aria-expanded={isOpen}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        isGroupActive(items)
                          ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-md"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="absolute left-0 top-12 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                        <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          {link.label === "Intelligence"
                            ? "Land Intelligence"
                            : link.label}
                        </p>
                        {items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <Link
                              key={item.label}
                              to={item.path}
                              onClick={() => setOpenMenu(null)}
                              className={`flex items-start gap-3 rounded-lg px-3 py-3 transition-colors ${
                                isActive(item.path)
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <ItemIcon className="mt-0.5 h-5 w-5 shrink-0" />
                              <span>
                                <span className="block text-sm font-semibold">
                                  {item.label}
                                </span>
                                <span className="mt-0.5 block text-xs text-slate-500">
                                  {item.description}
                                </span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
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
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {isMobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            {user ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setIsAccountOpen((open) => !open)}
                  aria-label="Open account menu"
                  aria-expanded={isAccountOpen}
                  className="rounded-full p-1 text-slate-600 hover:bg-slate-100 hover:text-emerald-700"
                >
                  <UserCircle className="h-8 w-8" />
                </button>
                {isAccountOpen && (
                  <div className="absolute right-0 top-11 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsAccountOpen(false)}
                      className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <UserCircle className="h-4 w-4" /> Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="h-4 w-4" /> My Workspace
                    </Link>
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
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
                {user.role === "researcher" || user.role === "admin" ? (
                  <Link
                    to="/datasets"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <BookOpen className="h-5 w-5" /> Datasets
                  </Link>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
