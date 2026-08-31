import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  getCurrentUser,
  logout,
} from "../services/authService";

const AdminLayout = () => {
  const navigate =
    useNavigate();

  const user =
    getCurrentUser();

  // LOGOUT
  const handleLogout = () => {
    logout();

    window.dispatchEvent(
      new Event(
        "userUpdated"
      )
    );

    navigate(
      "/auth/signin"
    );
  };

  // NAVIGATION STYLE
  const navLinkClass = ({
    isActive,
  }) =>
    `flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 ${
      isActive
        ? "bg-yellow-300 text-blue-950"
        : "text-blue-100 hover:bg-blue-800 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-blue-50">

      {/* SKIP LINK */}
      <a
        href="#admin-main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-xl bg-yellow-300 px-4 py-3 font-bold text-blue-950 shadow-lg transition focus:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Skip to admin content
      </a>

      {/* ADMIN HEADER */}
      <header className="border-b-2 border-blue-800 bg-blue-950 text-white">
        <div className="flex w-full flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 xl:px-10">

          {/* BRAND */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
              BulldogEx
            </p>

            <p className="mt-1 text-xl font-black">
              Administration Panel
            </p>
          </div>

          {/* USER INFORMATION */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            <div className="text-sm">
              <p className="font-bold text-white">
                {user?.name ||
                  "Administrator"}
              </p>

              <p className="text-blue-200">
                {user?.email ||
                  "Admin account"}
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="min-h-11 rounded-xl border-2 border-yellow-300 px-4 py-2 text-sm font-bold text-yellow-300 transition hover:bg-yellow-300 hover:text-blue-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ADMIN BODY */}
      <div className="grid min-h-[calc(100vh-93px)] w-full lg:grid-cols-[260px_minmax(0,1fr)]">

        {/* SIDEBAR */}
        <aside className="border-b-2 border-blue-800 bg-blue-950 px-4 py-5 lg:border-b-0 lg:border-r-2 lg:px-5">

          <nav
            aria-label="Admin navigation"
          >
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">

              <li>
                <NavLink
                  to="/admin"
                  end
                  className={
                    navLinkClass
                  }
                >
                  Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/products"
                  className={
                    navLinkClass
                  }
                >
                  Products
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/orders"
                  className={
                    navLinkClass
                  }
                >
                  Orders
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/reviews"
                  className={
                    navLinkClass
                  }
                >
                  Reviews
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/users"
                  className={
                    navLinkClass
                  }
                >
                  Users
                </NavLink>
              </li>
            </ul>

            {/* STORE LINK */}
            <div className="mt-6 border-t border-blue-800 pt-5">
              <NavLink
                to="/"
                className="flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-bold text-blue-100 transition hover:bg-blue-800 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300"
              >
                <span
                  aria-hidden="true"
                  className="mr-2"
                >
                  ←
                </span>

                Back to Store
              </NavLink>
            </div>
          </nav>
        </aside>

        {/* ADMIN PAGE CONTENT */}
        <div
          id="admin-main-content"
          tabIndex="-1"
          className="min-w-0 overflow-x-hidden focus:outline-none"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;