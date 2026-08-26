import {
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">BhuDrishti AI</h3>
                <p className="text-xs text-slate-400">
                  Land Intelligence Platform
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md mb-4">
              A centralized AI-enabled platform integrating geospatial data,
              research resources, and analytics to provide comprehensive land
              context and insights for India.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-emerald-500 flex items-center justify-center transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/land-explorer"
                  className="hover:text-blue-400 transition"
                >
                  Land Explorer
                </Link>
              </li>
              <li>
                <Link
                  to="/analytics"
                  className="hover:text-blue-400 transition"
                >
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-blue-400 transition">
                  Research Hub
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Dehradun, Uttarakhand
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                contact@bhudrishti.ai
              </li>
            </ul>
            <div className="mt-4 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-300">🏆 SIH 2026 Project</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2026 BhuDrishti AI. Built for Smart India Hackathon.
          </p>
          <p className="text-xs text-slate-500">
            Made with 💙 for India's Land Governance
          </p>
        </div>
      </div>
    </footer>
  );
}
