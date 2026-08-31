import {
  useEffect,
  useState,
} from "react";

import Button from "../../components/Button";
import apiRequest from "../../services/api";

import banner from "../../assets/img/nu_bulldogex_banner.jpg";
import bag from "../../assets/img/bag.jpg";
import tumbler from "../../assets/img/tumbler.jpg";
import hoodie from "../../assets/img/hoodies.jpg";

const HomePage = () => {
  const [
    productCount,
    setProductCount,
  ] = useState(0);

  const [
    categoryCount,
    setCategoryCount,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==============================
  // LOAD REAL STORE DATA
  // ==============================
  useEffect(() => {
    const loadOverview =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            productsResponse,
            categoriesResponse,
          ] = await Promise.all([
            apiRequest(
              "/products?limit=100"
            ),
            apiRequest(
              "/categories"
            ),
          ]);

          const products =
            Array.isArray(
              productsResponse
            )
              ? productsResponse
              : productsResponse.data ||
                [];

          const categories =
            Array.isArray(
              categoriesResponse
            )
              ? categoriesResponse
              : categoriesResponse.data ||
                [];

          setProductCount(
            productsResponse.count ??
              products.length
          );

          setCategoryCount(
            categories.length
          );
        } catch (err) {
          setError(
            err.message ||
              "Unable to load store information."
          );
        } finally {
          setLoading(false);
        }
      };

    loadOverview();
  }, []);

  return (
    <div className="flex w-full flex-col gap-8">

      {/* ============================== */}
      {/* HERO */}
      {/* ============================== */}
      <section
        aria-labelledby="home-hero-title"
        className="relative overflow-hidden border-y-2 border-zinc-900 bg-zinc-950"
      >
        <img
          src={banner}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-zinc-950/60"
        />

        <div className="relative z-10 mx-auto flex min-h-[30rem] max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
              Campus Marketplace
            </p>

            <h1
              id="home-hero-title"
              className="mt-3 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Welcome to
              BulldogEx Shop
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-100 sm:text-lg">
              Shop campus
              essentials,
              merchandise,
              uniforms, and
              student supplies
              from one convenient
              storefront.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                to="/products"
                variant="yellow"
                className="w-full sm:w-auto"
              >
                Shop Products
              </Button>

              <Button
                to="/about"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                About BulldogEx
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* STORE OVERVIEW */}
      {/* ============================== */}
      <section
        aria-labelledby="store-overview-title"
        className="bg-blue-50 px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              Store Overview
            </p>

            <h2
              id="store-overview-title"
              className="mt-2 text-3xl font-black tracking-tight text-blue-950"
            >
              Explore BulldogEx
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-700 sm:text-base">
              Browse available
              products and
              categories directly
              from the BulldogEx
              store database.
            </p>
          </div>

          {/* API ERROR */}
          {error && (
            <div
              role="status"
              className="mt-6 rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
            >
              Store statistics are
              temporarily
              unavailable. You can
              still browse the
              products normally.
            </div>
          )}

          <div
            aria-live="polite"
            className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* PRODUCTS */}
            <article className="rounded-3xl border-2 border-blue-950 bg-blue-950 p-6 text-white shadow-sm">
              <p
                className="text-4xl font-black text-yellow-300"
                aria-label={
                  loading
                    ? "Loading product count"
                    : `${productCount} products`
                }
              >
                {loading
                  ? "—"
                  : productCount}
              </p>

              <h3 className="mt-3 text-sm font-black uppercase tracking-[0.16em]">
                Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Items currently
                available in the
                store catalog.
              </p>
            </article>

            {/* CATEGORIES */}
            <article className="rounded-3xl border-2 border-blue-950 bg-blue-950 p-6 text-white shadow-sm">
              <p
                className="text-4xl font-black text-yellow-300"
                aria-label={
                  loading
                    ? "Loading category count"
                    : `${categoryCount} categories`
                }
              >
                {loading
                  ? "—"
                  : categoryCount}
              </p>

              <h3 className="mt-3 text-sm font-black uppercase tracking-[0.16em]">
                Categories
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Product groups to
                help you find what
                you need faster.
              </p>
            </article>

            {/* SEARCH */}
            <article className="rounded-3xl border-2 border-zinc-900 bg-white p-6 shadow-sm">
              <p
                aria-hidden="true"
                className="text-3xl"
              >
                🔎
              </p>

              <h3 className="mt-3 text-lg font-black text-zinc-950">
                Search Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Search the catalog
                by product name and
                filter products by
                category.
              </p>

              <Button
                to="/products"
                variant="blue"
                className="mt-5"
              >
                Browse Catalog
              </Button>
            </article>

            {/* CUSTOMER FEATURES */}
            <article className="rounded-3xl border-2 border-zinc-900 bg-white p-6 shadow-sm">
              <p
                aria-hidden="true"
                className="text-3xl"
              >
                📦
              </p>

              <h3 className="mt-3 text-lg font-black text-zinc-950">
                Easy Ordering
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Add products to
                your cart, place
                orders, and track
                their current
                status.
              </p>

              <Button
                to="/products"
                variant="secondary"
                className="mt-5"
              >
                Start Shopping
              </Button>
            </article>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* SHOP SECTIONS */}
      {/* ============================== */}
      <section
        aria-labelledby="shop-sections-title"
        className="px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              Shop Sections
            </p>

            <h2
              id="shop-sections-title"
              className="mt-2 text-3xl font-black tracking-tight text-blue-950"
            >
              Find what you need
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-700 sm:text-base">
              Browse common campus
              essentials and
              BulldogEx
              merchandise.
            </p>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-3">

            {/* DAILY ESSENTIALS */}
            <article className="overflow-hidden rounded-3xl border-2 border-blue-950 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden bg-zinc-200">
                <img
                  src={bag}
                  alt="Campus bag representing daily student essentials"
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-black text-blue-950">
                  Daily Essentials
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  Bags, tumblers,
                  lanyards, and
                  everyday campus
                  necessities.
                </p>

                <Button
                  to="/products"
                  variant="blue"
                  className="mt-5"
                >
                  View Products
                </Button>
              </div>
            </article>

            {/* STUDY SUPPLIES */}
            <article className="overflow-hidden rounded-3xl border-2 border-blue-950 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden bg-zinc-200">
                <img
                  src={tumbler}
                  alt="Reusable tumbler representing student supplies"
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-black text-blue-950">
                  Student Supplies
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  Useful items for
                  classes, study
                  sessions, and
                  daily campus
                  life.
                </p>

                <Button
                  to="/products"
                  variant="blue"
                  className="mt-5"
                >
                  Shop Supplies
                </Button>
              </div>
            </article>

            {/* CAMPUS APPAREL */}
            <article className="overflow-hidden rounded-3xl border-2 border-blue-950 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden bg-zinc-200">
                <img
                  src={hoodie}
                  alt="BulldogEx hoodie representing campus apparel"
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h3 className="text-xl font-black text-blue-950">
                  Campus Apparel
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  Comfortable
                  apparel and
                  BulldogEx
                  merchandise for
                  campus life.
                </p>

                <Button
                  to="/products"
                  variant="blue"
                  className="mt-5"
                >
                  View Apparel
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;