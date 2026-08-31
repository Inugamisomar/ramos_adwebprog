import {
  Outlet,
} from "react-router-dom";

import front from "../assets/img/NUFRONT.jpg";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-blue-50 text-zinc-900">

      {/* SKIP LINK */}
      <a
        href="#auth-main"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-blue-900 px-4 py-3 text-sm font-bold text-white shadow-lg transition focus:translate-y-0 focus:outline-none focus:ring-4 focus:ring-yellow-300"
      >
        Skip to authentication form
      </a>

      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">

        {/* CAMPUS IMAGE */}
        <aside
          aria-label="National University campus"
          className="flex items-center justify-center border-b-2 border-zinc-300 bg-blue-400 p-4 sm:p-8 lg:border-b-0 lg:border-r-2 lg:p-12"
        >
          <div className="w-full max-w-2xl rounded-3xl border-2 border-zinc-900 bg-white/20 p-3 sm:p-4">
            <div className="h-56 w-full overflow-hidden rounded-2xl sm:h-80 lg:h-[500px]">
              <img
                src={front}
                alt="Front view of National University campus"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </aside>

        {/* AUTHENTICATION FORM */}
        <main
          id="auth-main"
          tabIndex="-1"
          className="flex items-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16"
        >
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;