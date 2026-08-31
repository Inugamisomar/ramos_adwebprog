import {
  Link,
} from "react-router-dom";

const footerLinkClasses =
  "inline-flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-white transition hover:bg-blue-800 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900";

const Footer = () => {
  return (
    <footer
      aria-label="Site footer"
      className="mt-12 border-t-4 border-yellow-400 bg-blue-900 text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">

        {/* BRAND */}
        <section
          aria-labelledby="footer-brand-title"
        >
          <h2
            id="footer-brand-title"
            className="text-xl font-black"
          >
            BulldogEx Shop
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
            Your official campus
            marketplace for
            student essentials,
            merchandise, and more.
          </p>
        </section>

        {/* QUICK LINKS */}
        <nav
          aria-labelledby="footer-links-title"
        >
          <h2
            id="footer-links-title"
            className="text-base font-black"
          >
            Quick Links
          </h2>

          <ul className="mt-3 space-y-1">
            <li>
              <Link
                to="/"
                className={
                  footerLinkClasses
                }
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className={
                  footerLinkClasses
                }
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className={
                  footerLinkClasses
                }
              >
                Products
              </Link>
            </li>
          </ul>
        </nav>

        {/* CONTACT */}
        <section
          aria-labelledby="footer-contact-title"
        >
          <h2
            id="footer-contact-title"
            className="text-base font-black"
          >
            Contact
          </h2>

          <div className="mt-3 space-y-3 text-sm text-blue-100">
            <p>
              <span className="font-bold text-white">
                Email:
              </span>{" "}
              <a
                href="mailto:support@bulldogex.com"
                className="rounded-md font-semibold text-yellow-300 underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900"
              >
                support@bulldogex.com
              </a>
            </p>

            <p>
              <span className="font-bold text-white">
                Location:
              </span>{" "}
              NU Campus
            </p>
          </div>
        </section>
      </div>

      <div className="border-t border-blue-800 bg-blue-950 px-4 py-4 text-center text-xs leading-5 text-blue-100 sm:text-sm">
        © 2026 BulldogEx Shop —
        Protect Your Tech, Knot Your
        Style
      </div>
    </footer>
  );
};

export default Footer;