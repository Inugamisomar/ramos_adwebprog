import {
  NavLink,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import logo from "../assets/img/nubdexchange_logo.png";

import {
  getCurrentUser,
  logout,
} from "../services/authService";

const links = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "About",
    to: "/about",
  },
  {
    label: "Products",
    to: "/products",
  },
];

// ==============================
// DESKTOP NAVIGATION STYLE
// ==============================
const navLinkClassName = ({
  isActive,
}) =>
  [
    "inline-flex min-h-11 items-center justify-center rounded-xl border-2 px-4 py-2",
    "text-xs font-bold uppercase tracking-[0.14em]",
    "transition",

    "focus-visible:outline-none",
    "focus-visible:ring-4",
    "focus-visible:ring-blue-700",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-yellow-400",

    isActive
      ? "border-blue-950 bg-blue-950 text-white"
      : "border-transparent text-zinc-900 hover:border-blue-950 hover:bg-blue-950 hover:text-white",
  ].join(" ");

// ==============================
// MOBILE NAVIGATION STYLE
// ==============================
const mobileNavLinkClassName = ({
  isActive,
}) =>
  [
    "flex min-h-12 w-full items-center rounded-xl border-2 px-4 py-3",
    "text-sm font-bold transition",

    "focus-visible:outline-none",
    "focus-visible:ring-4",
    "focus-visible:ring-blue-500",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-yellow-100",

    isActive
      ? "border-blue-950 bg-blue-950 text-white"
      : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white",
  ].join(" ");

const desktopActionClasses =
  "inline-flex min-h-11 items-center justify-center rounded-xl border-2 px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-400";

// ==============================
// DESKTOP ACCOUNT NAV STYLE
// ==============================
const desktopAccountNavClassName = ({
  isActive,
}) =>
  [
    desktopActionClasses,

    isActive
      ? "border-blue-950 bg-blue-950 text-white"
      : "border-blue-950 bg-transparent text-blue-950 hover:bg-blue-950 hover:text-white",
  ].join(" ");

const NavBar = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const menuButtonRef =
    useRef(null);

  const [user, setUser] =
    useState(() =>
      getCurrentUser()
    );

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  // ==============================
  // UPDATE NAVBAR USER
  // ==============================
  useEffect(() => {
    const handleUserUpdate =
      () => {
        setUser(
          getCurrentUser()
        );
      };

    window.addEventListener(
      "userUpdated",
      handleUserUpdate
    );

    return () => {
      window.removeEventListener(
        "userUpdated",
        handleUserUpdate
      );
    };
  }, []);

  // ==============================
  // CLOSE MOBILE MENU
  // WHEN ROUTE CHANGES
  // ==============================
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // ==============================
  // ESCAPE KEY CLOSES MENU
  // ==============================
  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        setMobileMenuOpen(
          false
        );

        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [mobileMenuOpen]);

  // ==============================
  // CLOSE MOBILE MENU
  // ==============================
  const closeMobileMenu =
    () => {
      setMobileMenuOpen(
        false
      );
    };

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    logout();

    setUser(null);

    setMobileMenuOpen(
      false
    );

    window.dispatchEvent(
      new Event(
        "userUpdated"
      )
    );

    navigate(
      "/auth/signin"
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-zinc-900 bg-yellow-400 shadow-sm">

      {/* MAIN NAVBAR */}
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* LOGO / HOME */}
        <Link
          to="/"
          onClick={
            closeMobileMenu
          }
          aria-label="BulldogEx Shop home"
          className="flex min-h-11 min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-400"
        >
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="h-10 w-10 shrink-0 rounded-full border-2 border-zinc-900 bg-white object-contain"
          />

          <span className="truncate text-lg font-black tracking-tight text-zinc-950 sm:text-xl">
            BulldogEx Shop
          </span>
        </Link>

        {/* DESKTOP PRIMARY NAVIGATION */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {links.map(
            (link) => (
              <NavLink
                key={
                  link.to
                }
                to={link.to}
                end={
                  link.to ===
                  "/"
                }
                className={
                  navLinkClassName
                }
              >
                {({
                  isActive,
                }) => (
                  <>
                    {
                      link.label
                    }

                    {isActive && (
                      <span className="sr-only">
                        , current page
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          )}

          {/* ADMIN DASHBOARD */}
          {user?.role ===
            "admin" && (
            <NavLink
              to="/admin"
              className={
                navLinkClassName
              }
            >
              {({
                isActive,
              }) => (
                <>
                  Admin

                  {isActive && (
                    <span className="sr-only">
                      , current page
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )}
        </nav>

        {/* DESKTOP ACCOUNT ACTIONS */}
        <div className="hidden items-center gap-2 md:flex">

          {/* GUEST */}
          {!user && (
            <>
              <Link
                to="/auth/signin"
                className={`${desktopActionClasses} border-transparent text-blue-950 hover:border-blue-950 hover:bg-white`}
              >
                Sign In
              </Link>

              <Link
                to="/auth/signup"
                className={`${desktopActionClasses} border-blue-950 bg-blue-950 text-white hover:bg-blue-800`}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* LOGGED IN */}
          {user && (
            <>
              <span
                className="max-w-[140px] truncate text-sm font-bold text-zinc-900"
                title={
                  user.name
                }
              >
                Hi, {user.name}
              </span>

              {/* CUSTOMER */}
              {user.role ===
                "customer" && (
                <>
                  <NavLink
                    to="/cart"
                    className={
                      desktopAccountNavClassName
                    }
                  >
                    {({
                      isActive,
                    }) => (
                      <>
                        Cart

                        {isActive && (
                          <span className="sr-only">
                            , current page
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>

                  <NavLink
                    to="/orders"
                    className={
                      desktopAccountNavClassName
                    }
                  >
                    {({
                      isActive,
                    }) => (
                      <>
                        My Orders

                        {isActive && (
                          <span className="sr-only">
                            , current page
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </>
              )}

              {/* PROFILE */}
              <NavLink
                to="/profile"
                className={
                  desktopAccountNavClassName
                }
              >
                {({
                  isActive,
                }) => (
                  <>
                    Profile

                    {isActive && (
                      <span className="sr-only">
                        , current page
                      </span>
                    )}
                  </>
                )}
              </NavLink>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={
                  handleLogout
                }
                className={`${desktopActionClasses} border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-700`}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          ref={
            menuButtonRef
          }
          type="button"
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={
            mobileMenuOpen
          }
          aria-controls="mobile-navigation"
          onClick={() =>
            setMobileMenuOpen(
              (previous) =>
                !previous
            )
          }
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-zinc-950 bg-white text-2xl font-black text-zinc-950 transition hover:bg-zinc-950 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-400 md:hidden"
        >
          <span
            aria-hidden="true"
          >
            {mobileMenuOpen
              ? "×"
              : "☰"}
          </span>
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t-2 border-zinc-900 bg-yellow-100 px-4 py-5 shadow-xl md:hidden"
        >
          <div className="mx-auto max-w-7xl">

            {/* USER INFORMATION */}
            {user && (
              <section
                aria-label="Signed in account"
                className="mb-5 rounded-2xl border-2 border-zinc-900 bg-yellow-300 p-4"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-700">
                  Signed in as
                </p>

                <p className="mt-1 break-words font-black text-zinc-950">
                  {user.name}
                </p>

                <p className="mt-1 text-sm font-semibold capitalize text-zinc-700">
                  {user.role}
                </p>
              </section>
            )}

            {/* MOBILE LINKS */}
            <nav
              aria-label="Mobile navigation"
              className="space-y-3"
            >
              {links.map(
                (link) => (
                  <NavLink
                    key={
                      link.to
                    }
                    to={link.to}
                    end={
                      link.to ===
                      "/"
                    }
                    onClick={
                      closeMobileMenu
                    }
                    className={
                      mobileNavLinkClassName
                    }
                  >
                    {({
                      isActive,
                    }) => (
                      <>
                        {
                          link.label
                        }

                        {isActive && (
                          <span className="sr-only">
                            , current page
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              )}

              {/* ADMIN */}
              {user?.role ===
                "admin" && (
                <NavLink
                  to="/admin"
                  onClick={
                    closeMobileMenu
                  }
                  className={
                    mobileNavLinkClassName
                  }
                >
                  {({
                    isActive,
                  }) => (
                    <>
                      Admin Dashboard

                      {isActive && (
                        <span className="sr-only">
                          , current page
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )}

              {/* CUSTOMER */}
              {user?.role ===
                "customer" && (
                <>
                  <NavLink
                    to="/cart"
                    onClick={
                      closeMobileMenu
                    }
                    className={
                      mobileNavLinkClassName
                    }
                  >
                    {({
                      isActive,
                    }) => (
                      <>
                        Cart

                        {isActive && (
                          <span className="sr-only">
                            , current page
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>

                  <NavLink
                    to="/orders"
                    onClick={
                      closeMobileMenu
                    }
                    className={
                      mobileNavLinkClassName
                    }
                  >
                    {({
                      isActive,
                    }) => (
                      <>
                        My Orders

                        {isActive && (
                          <span className="sr-only">
                            , current page
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </>
              )}

              {/* PROFILE */}
              {user && (
                <NavLink
                  to="/profile"
                  onClick={
                    closeMobileMenu
                  }
                  className={
                    mobileNavLinkClassName
                  }
                >
                  {({
                    isActive,
                  }) => (
                    <>
                      Profile

                      {isActive && (
                        <span className="sr-only">
                          , current page
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )}
            </nav>

            {/* MOBILE ACCOUNT ACTIONS */}
            <div className="mt-5 border-t-2 border-zinc-300 pt-5">

              {!user ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    to="/auth/signin"
                    onClick={
                      closeMobileMenu
                    }
                    className="flex min-h-12 items-center justify-center rounded-xl border-2 border-blue-950 bg-blue-950 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/auth/signup"
                    onClick={
                      closeMobileMenu
                    }
                    className="flex min-h-12 items-center justify-center rounded-xl border-2 border-zinc-900 bg-white px-4 py-3 text-center text-sm font-black text-zinc-900 transition hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="flex min-h-12 w-full items-center justify-center rounded-xl border-2 border-zinc-950 bg-zinc-950 px-4 py-3 text-sm font-black text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-100"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;