import {
  useEffect,
  useState,
} from "react";

import Button from "../../components/Button.jsx";
import ProductList from "../../components/ProductList.jsx";
import apiRequest from "../../services/api.js";

const ProductListPage = () => {
  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("all");

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  const fetchProducts = async (
    searchValue = "",
    categoryValue = "all"
  ) => {
    try {
      setLoading(true);
      setError("");

      const params =
        new URLSearchParams();

      // Search
      if (searchValue.trim()) {
        params.set(
          "search",
          searchValue.trim()
        );
      }

      // Category
      if (
        categoryValue &&
        categoryValue !== "all"
      ) {
        params.set(
          "category",
          categoryValue
        );
      }

      // Load enough products for
      // the catalog.
      params.set("limit", "100");

      const endpoint =
        `/products?${params.toString()}`;

      const response =
        await apiRequest(endpoint);

      const productData =
        Array.isArray(response)
          ? response
          : Array.isArray(
                response?.data
              )
            ? response.data
            : [];

      setProducts(productData);
    } catch (err) {
      setProducts([]);

      setError(
        err.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // FETCH CATEGORIES
  // ==============================
  const fetchCategories =
    async () => {
      try {
        const response =
          await apiRequest(
            "/categories"
          );

        const categoryData =
          Array.isArray(response)
            ? response
            : Array.isArray(
                  response?.data
                )
              ? response.data
              : [];

        setCategories(
          categoryData
        );
      } catch (err) {
        console.error(
          "Unable to load categories:",
          err
        );

        setCategories([]);
      }
    };

  // ==============================
  // INITIAL LOAD
  // ==============================
  useEffect(() => {
    const loadPage =
      async () => {
        await Promise.all([
          fetchProducts(
            "",
            "all"
          ),
          fetchCategories(),
        ]);
      };

    loadPage();
  }, []);

  // ==============================
  // SEARCH
  // ==============================
  const handleSearch = (
    event
  ) => {
    event.preventDefault();

    fetchProducts(
      search,
      category
    );
  };

  // ==============================
  // CATEGORY CHANGE
  // ==============================
  const handleCategoryChange = (
    event
  ) => {
    const selectedCategory =
      event.target.value;

    setCategory(
      selectedCategory
    );

    // Immediately request the
    // filtered products.
    fetchProducts(
      search,
      selectedCategory
    );
  };

  // ==============================
  // CLEAR FILTERS
  // ==============================
  const handleClearFilters =
    () => {
      setSearch("");
      setCategory("all");

      fetchProducts(
        "",
        "all"
      );
    };

  const filtersActive =
    search.trim() !== "" ||
    category !== "all";

  return (
    <main className="min-h-screen bg-blue-50">

      {/* PAGE HEADER */}
      <section
        aria-labelledby="catalog-title"
        className="border-b border-blue-100 bg-white px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
            Products
          </p>

          <h1
            id="catalog-title"
            className="mt-2 text-4xl font-black tracking-tight text-blue-950 sm:text-5xl"
          >
            Product Catalog
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-700 sm:text-base">
            Search and browse
            available BulldogEx
            products using keywords
            and product categories.
          </p>

          <div className="mt-6">
            <Button
              to="/"
              variant="secondary"
            >
              Back Home
            </Button>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section
        aria-labelledby="products-heading"
        className="px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              BulldogEx Catalog
            </p>

            <h2
              id="products-heading"
              className="mt-2 text-3xl font-black text-blue-950"
            >
              Find your campus
              essentials
            </h2>

            <p className="mt-2 text-sm text-zinc-700">
              Use the search and
              category filters to find
              the products you need.
            </p>
          </div>

          {/* SEARCH / FILTER FORM */}
          <form
            role="search"
            aria-label="Search and filter products"
            onSubmit={
              handleSearch
            }
            className="mt-7 rounded-3xl border-2 border-blue-950 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="grid gap-5 md:grid-cols-2">

              {/* SEARCH */}
              <div>
                <label
                  htmlFor="product-search"
                  className="mb-2 block text-sm font-bold text-blue-950"
                >
                  Search products
                </label>

                <input
                  id="product-search"
                  type="search"
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Example: shirt, bag, tumbler"
                  className="min-h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs leading-5 text-zinc-600">
                  Search using a
                  product name or
                  keyword.
                </p>
              </div>

              {/* CATEGORY */}
              <div>
                <label
                  htmlFor="product-category"
                  className="mb-2 block text-sm font-bold text-blue-950"
                >
                  Category
                </label>

                <select
                  id="product-category"
                  value={category}
                  onChange={
                    handleCategoryChange
                  }
                  className="min-h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="all">
                    All Categories
                  </option>

                  {categories.map(
                    (
                      categoryItem
                    ) => (
                      <option
                        key={
                          categoryItem._id
                        }
                        value={
                          categoryItem.name
                        }
                      >
                        {
                          categoryItem.name
                        }
                      </option>
                    )
                  )}
                </select>

                <p className="mt-2 text-xs leading-5 text-zinc-600">
                  Selecting a category
                  automatically filters
                  the catalog.
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex flex-col gap-3 border-b border-zinc-200 pb-6 sm:flex-row">

              <Button
                type="submit"
                variant="blue"
              >
                Search Products
              </Button>

              {filtersActive && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={
                    handleClearFilters
                  }
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* RESULT COUNT */}
            <p
              aria-live="polite"
              className="mt-4 text-sm text-zinc-700"
            >
              Showing{" "}
              <strong className="text-blue-950">
                {products.length}
              </strong>{" "}
              {products.length ===
              1
                ? "product"
                : "products"}
              {category !==
                "all" && (
                <>
                  {" "}
                  in{" "}
                  <strong>
                    {category}
                  </strong>
                </>
              )}
              .
            </p>
          </form>

          {/* LOADING */}
          {loading && (
            <div
              role="status"
              aria-live="polite"
              className="mt-7 rounded-3xl border-2 border-blue-100 bg-white p-10 text-center"
            >
              <div
                aria-hidden="true"
                className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-900"
              />

              <p className="mt-4 font-bold text-blue-950">
                Loading products...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading &&
            error && (
              <div
                role="alert"
                className="mt-7 rounded-3xl border-2 border-red-300 bg-red-50 p-6"
              >
                <h3 className="font-black text-red-900">
                  We couldn't load
                  the products
                </h3>

                <p className="mt-2 text-sm text-red-800">
                  {error}
                </p>

                <Button
                  type="button"
                  variant="danger"
                  className="mt-5"
                  onClick={() =>
                    fetchProducts(
                      search,
                      category
                    )
                  }
                >
                  Try Again
                </Button>
              </div>
            )}

          {/* EMPTY RESULTS */}
          {!loading &&
            !error &&
            products.length ===
              0 && (
              <div className="mt-7 rounded-3xl border-2 border-blue-100 bg-white p-10 text-center">
                <h3 className="text-xl font-black text-blue-950">
                  No products found
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  No products matched
                  your current search
                  or category.
                </p>

                {filtersActive && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-5"
                    onClick={
                      handleClearFilters
                    }
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

          {/* PRODUCTS */}
          {!loading &&
            !error &&
            products.length >
              0 && (
              <div className="mt-7">
                <ProductList
                  products={
                    products
                  }
                />
              </div>
            )}
        </div>
      </section>
    </main>
  );
};

export default ProductListPage;