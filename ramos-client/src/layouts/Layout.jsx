import {
  Outlet,
} from "react-router-dom";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">

      {/* SKIP LINK */}
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-blue-900 px-4 py-3 text-sm font-bold text-white shadow-lg transition focus:translate-y-0 focus:outline-none focus:ring-4 focus:ring-yellow-300"
      >
        Skip to main content
      </a>

      {/* NAVIGATION */}
      <NavBar />

      {/* PAGE CONTENT WRAPPER */}
      <div
        id="main-content"
        tabIndex="-1"
        className="min-h-screen pt-24 focus:outline-none"
      >
        <Outlet />
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}