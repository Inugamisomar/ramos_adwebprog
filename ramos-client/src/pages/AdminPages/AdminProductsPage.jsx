import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Button from "../../components/Button";
import apiRequest from "../../services/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
  category: "",
  supplier: "",
};

const AdminProductsPage = () => {
  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    suppliers,
    setSuppliers,
  ] = useState([]);

  const [
    form,
    setForm,
  ] = useState(
    emptyForm
  );

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const formRef =
    useRef(null);

  // LOAD PRODUCTS
  const fetchProducts =
    async () => {
      const data =
        await apiRequest(
          "/products?limit=100"
        );

      setProducts(
        Array.isArray(data)
          ? data
          : Array.isArray(
                data?.data
              )
            ? data.data
            : []
      );
    };

  // LOAD CATEGORIES
  const fetchCategories =
    async () => {
      const data =
        await apiRequest(
          "/categories"
        );

      setCategories(
        Array.isArray(data)
          ? data
          : Array.isArray(
                data?.data
              )
            ? data.data
            : []
      );
    };

  // LOAD SUPPLIERS
  const fetchSuppliers =
    async () => {
      const data =
        await apiRequest(
          "/suppliers"
        );

      setSuppliers(
        Array.isArray(data)
          ? data
          : Array.isArray(
                data?.data
              )
            ? data.data
            : []
      );
    };

  // INITIAL LOAD
  useEffect(() => {
    const loadData =
      async () => {
        try {
          setLoading(true);
          setError("");

          await Promise.all([
            fetchProducts(),
            fetchCategories(),
            fetchSuppliers(),
          ]);
        } catch (err) {
          setError(
            err.message ||
              "Unable to load product management data."
          );
        } finally {
          setLoading(false);
        }
      };

    loadData();
  }, []);

  // FORM INPUT
  const handleChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };

  // RESET FORM
  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  // EDIT PRODUCT
  const handleEdit =
    (product) => {
      setError("");
      setSuccess("");

      setEditingId(
        product._id
      );

      setForm({
        name:
          product.name || "",

        description:
          product.description ||
          "",

        price:
          product.price ?? "",

        stock:
          product.stock ?? "",

        image:
          product.image || "",

        category:
          typeof product.category ===
          "object"
            ? product.category?._id ||
              ""
            : product.category ||
              "",

        supplier:
          typeof product.supplier ===
          "object"
            ? product.supplier?._id ||
              ""
            : product.supplier ||
              "",
      });

      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        const nameInput =
          document.getElementById(
            "product-name"
          );

        nameInput?.focus();
      });
    };

  // CREATE / UPDATE PRODUCT
  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (
        !form.name.trim()
      ) {
        setError(
          "Product name is required."
        );

        return;
      }

      if (
        form.price === "" ||
        Number(
          form.price
        ) < 0
      ) {
        setError(
          "Enter a valid product price."
        );

        return;
      }

      if (
        form.stock === "" ||
        Number(
          form.stock
        ) < 0
      ) {
        setError(
          "Enter a valid stock quantity."
        );

        return;
      }

      if (
        !form.category
      ) {
        setError(
          "Please select a category."
        );

        return;
      }

      const body = {
        name:
          form.name.trim(),

        description:
          form.description.trim(),

        price:
          Number(
            form.price
          ),

        stock:
          Number(
            form.stock
          ),

        image:
          form.image.trim(),

        category:
          form.category,
      };

      if (
        form.supplier
      ) {
        body.supplier =
          form.supplier;
      }

      try {
        setSaving(true);

        if (
          editingId
        ) {
          const data =
            await apiRequest(
              `/products/${editingId}`,
              {
                method:
                  "PUT",

                body:
                  JSON.stringify(
                    body
                  ),
              }
            );

          setSuccess(
            data.message ||
              "Product updated successfully."
          );
        } else {
          const data =
            await apiRequest(
              "/products",
              {
                method:
                  "POST",

                body:
                  JSON.stringify(
                    body
                  ),
              }
            );

          setSuccess(
            data.message ||
              "Product created successfully."
          );
        }

        resetForm();

        await fetchProducts();
      } catch (err) {
        setError(
          err.message ||
            "Unable to save product."
        );
      } finally {
        setSaving(false);
      }
    };

  // DELETE PRODUCT
  const handleDelete =
    async (product) => {
      const confirmed =
        window.confirm(
          `Delete "${product.name}"?`
        );

      if (
        !confirmed
      ) {
        return;
      }

      try {
        setDeletingId(
          product._id
        );

        setError("");
        setSuccess("");

        const data =
          await apiRequest(
            `/products/${product._id}`,
            {
              method:
                "DELETE",
            }
          );

        setSuccess(
          data.message ||
            "Product deleted successfully."
        );

        if (
          editingId ===
          product._id
        ) {
          resetForm();
        }

        await fetchProducts();
      } catch (err) {
        setError(
          err.message ||
            "Unable to delete product."
        );
      } finally {
        setDeletingId(
          null
        );
      }
    };

  // SEARCH DISPLAY
  const filteredProducts =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (
        !keyword
      ) {
        return products;
      }

      return products.filter(
        (product) => {
          const categoryName =
            typeof product.category ===
            "object"
              ? product.category
                  ?.name || ""
              : "";

          const supplierName =
            typeof product.supplier ===
            "object"
              ? product.supplier
                  ?.name || ""
              : "";

          return (
            product.name
              ?.toLowerCase()
              .includes(
                keyword
              ) ||
            product.description
              ?.toLowerCase()
              .includes(
                keyword
              ) ||
            categoryName
              .toLowerCase()
              .includes(
                keyword
              ) ||
            supplierName
              .toLowerCase()
              .includes(
                keyword
              )
          );
        }
      );
    }, [
      products,
      search,
    ]);

  // FORMAT PRICE
  const formatPrice =
    (value) =>
      Number(
        value || 0
      ).toLocaleString(
        "en-PH",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );

  // LOADING
  if (
    loading
  ) {
    return (
      <main className="min-h-screen bg-blue-50 px-4 py-16 sm:px-6 lg:px-8">
        <div
          role="status"
          aria-live="polite"
          className="mx-auto max-w-7xl rounded-3xl border-2 border-blue-200 bg-white p-10 text-center shadow-sm"
        >
          <div
            aria-hidden="true"
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-950"
          />

          <h1 className="mt-5 text-xl font-black text-blue-950">
            Loading product management
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            Retrieving products,
            categories, and suppliers.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      aria-labelledby="admin-products-title"
      className="min-h-screen bg-blue-50 px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              BulldogEx Administration
            </p>

            <h1
              id="admin-products-title"
              className="mt-2 text-4xl font-black tracking-tight text-blue-950 sm:text-5xl"
            >
              Product Management
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700 sm:text-base">
              Create new products,
              manage inventory, update
              product details, and
              remove listings when
              necessary.
            </p>
          </div>

          <Button
            to="/admin"
            variant="secondary"
          >
            ← Dashboard
          </Button>
        </header>

        {/* MESSAGES */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 p-5"
          >
            <p className="font-black text-red-950">
              Product management error
            </p>

            <p className="mt-1 text-sm leading-6 text-red-900">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-2xl border-2 border-green-300 bg-green-50 p-5"
          >
            <p className="font-black text-green-950">
              Success
            </p>

            <p className="mt-1 text-sm leading-6 text-green-900">
              {success}
            </p>
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[400px_minmax(0,1fr)]">

          {/* PRODUCT FORM */}
          <section
            ref={
              formRef
            }
            aria-labelledby="product-form-title"
            className="h-fit rounded-3xl border-2 border-blue-950 bg-white p-6 shadow-sm xl:sticky xl:top-28"
          >
            <div className="border-b-2 border-blue-100 pb-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                {editingId
                  ? "Editing Product"
                  : "New Product"}
              </p>

              <h2
                id="product-form-title"
                className="mt-2 text-2xl font-black text-blue-950"
              >
                {editingId
                  ? "Edit Product"
                  : "Create Product"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-700">
                {editingId
                  ? "Update the selected product information below."
                  : "Complete the form below to add a new product to the catalog."}
              </p>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-6 space-y-5"
            >

              {/* NAME */}
              <div>
                <label
                  htmlFor="product-name"
                  className="block text-sm font-bold text-zinc-950"
                >
                  Product Name
                  <span
                    aria-hidden="true"
                    className="ml-1 text-red-600"
                  >
                    *
                  </span>
                </label>

                <input
                  id="product-name"
                  type="text"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    saving
                  }
                  required
                  aria-required="true"
                  placeholder="Enter product name"
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  htmlFor="product-description"
                  className="block text-sm font-bold text-zinc-950"
                >
                  Description
                </label>

                <textarea
                  id="product-description"
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    saving
                  }
                  rows={4}
                  placeholder="Enter product description"
                  className="mt-2 w-full resize-y rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm leading-6 text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                />
              </div>

              {/* PRICE / STOCK */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="product-price"
                    className="block text-sm font-bold text-zinc-950"
                  >
                    Price
                    <span
                      aria-hidden="true"
                      className="ml-1 text-red-600"
                    >
                      *
                    </span>
                  </label>

                  <div className="relative mt-2">
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-4 flex items-center font-bold text-zinc-600"
                    >
                      ₱
                    </span>

                    <input
                      id="product-price"
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={
                        form.price
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        saving
                      }
                      required
                      aria-required="true"
                      placeholder="0.00"
                      className="min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white py-3 pl-9 pr-4 text-sm text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="product-stock"
                    className="block text-sm font-bold text-zinc-950"
                  >
                    Stock
                    <span
                      aria-hidden="true"
                      className="ml-1 text-red-600"
                    >
                      *
                    </span>
                  </label>

                  <input
                    id="product-stock"
                    type="number"
                    name="stock"
                    min="0"
                    step="1"
                    value={
                      form.stock
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      saving
                    }
                    required
                    aria-required="true"
                    placeholder="0"
                    className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                  />
                </div>
              </div>

              {/* CATEGORY */}
              <div>
                <label
                  htmlFor="product-category"
                  className="block text-sm font-bold text-zinc-950"
                >
                  Category
                  <span
                    aria-hidden="true"
                    className="ml-1 text-red-600"
                  >
                    *
                  </span>
                </label>

                <select
                  id="product-category"
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    saving
                  }
                  required
                  aria-required="true"
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (
                      category
                    ) => (
                      <option
                        key={
                          category._id
                        }
                        value={
                          category._id
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* SUPPLIER */}
              <div>
                <label
                  htmlFor="product-supplier"
                  className="block text-sm font-bold text-zinc-950"
                >
                  Supplier
                </label>

                <select
                  id="product-supplier"
                  name="supplier"
                  value={
                    form.supplier
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    saving
                  }
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                >
                  <option value="">
                    No supplier
                  </option>

                  {suppliers.map(
                    (
                      supplier
                    ) => (
                      <option
                        key={
                          supplier._id
                        }
                        value={
                          supplier._id
                        }
                      >
                        {
                          supplier.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* IMAGE URL */}
              <div>
                <label
                  htmlFor="product-image"
                  className="block text-sm font-bold text-zinc-950"
                >
                  Image URL
                </label>

                <input
                  id="product-image"
                  type="url"
                  name="image"
                  value={
                    form.image
                  }
                  onChange={
                    handleChange
                  }
                  disabled={
                    saving
                  }
                  placeholder="https://example.com/product.jpg"
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-500 hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                />

                <p className="mt-2 text-xs leading-5 text-zinc-600">
                  Optional. Enter a
                  direct image URL for
                  the product.
                </p>
              </div>

              {/* IMAGE PREVIEW */}
              {form.image && (
                <div>
                  <p className="text-sm font-bold text-zinc-950">
                    Image Preview
                  </p>

                  <div className="mt-2 overflow-hidden rounded-2xl border-2 border-zinc-200 bg-zinc-100">
                    <div className="aspect-[4/3]">
                      <img
                        src={
                          form.image
                        }
                        alt="Preview of the product image URL"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex flex-col gap-3 border-t-2 border-zinc-200 pt-5 sm:flex-row">
                <Button
                  type="submit"
                  variant="blue"
                  disabled={
                    saving
                  }
                  aria-busy={
                    saving
                  }
                  className="w-full sm:w-auto"
                >
                  {saving
                    ? "Saving Product..."
                    : editingId
                      ? "Save Changes"
                      : "Create Product"}
                </Button>

                {editingId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={
                      resetForm
                    }
                    disabled={
                      saving
                    }
                    className="w-full sm:w-auto"
                  >
                    Cancel Editing
                  </Button>
                )}
              </div>

              <div
                aria-live="polite"
                className="min-h-5 text-xs font-semibold text-blue-800"
              >
                {saving
                  ? editingId
                    ? "Updating product information."
                    : "Creating the new product."
                  : ""}
              </div>
            </form>
          </section>

          {/* PRODUCT LIST */}
          <section
            aria-labelledby="product-list-title"
          >
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Inventory
                </p>

                <h2
                  id="product-list-title"
                  className="mt-1 text-2xl font-black text-blue-950"
                >
                  All Products
                </h2>

                <p className="mt-2 text-sm text-zinc-700">
                  {
                    products.length
                  }{" "}
                  product
                  {products.length ===
                  1
                    ? ""
                    : "s"}{" "}
                  currently listed
                </p>
              </div>

              <div className="w-full sm:max-w-sm">
                <label
                  htmlFor="admin-product-search"
                  className="block text-sm font-bold text-zinc-950"
                >
                  Search products
                </label>

                <input
                  id="admin-product-search"
                  type="search"
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Name, category, supplier..."
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-500 hover:border-blue-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-200"
                />
              </div>
            </div>

            <div
              role="status"
              aria-live="polite"
              className="mb-4 text-sm font-semibold text-zinc-700"
            >
              Showing{" "}
              {
                filteredProducts.length
              }{" "}
              of{" "}
              {
                products.length
              }{" "}
              products.
            </div>

            {filteredProducts.length ===
            0 ? (
              <div className="rounded-3xl border-2 border-dashed border-zinc-300 bg-white p-10 text-center">
                <div
                  aria-hidden="true"
                  className="text-4xl"
                >
                  🔎
                </div>

                <h3 className="mt-4 text-xl font-black text-blue-950">
                  No products found
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-700">
                  Try another search
                  term or clear the
                  current search.
                </p>

                {search && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setSearch("")
                    }
                    className="mt-5"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <ul
                aria-label="Product management list"
                className="space-y-5"
              >
                {filteredProducts.map(
                  (
                    product
                  ) => {
                    const categoryName =
                      typeof product.category ===
                      "object"
                        ? product.category
                            ?.name
                        : "";

                    const supplierName =
                      typeof product.supplier ===
                      "object"
                        ? product.supplier
                            ?.name
                        : "";

                    const outOfStock =
                      Number(
                        product.stock
                      ) <= 0;

                    return (
                      <li
                        key={
                          product._id
                        }
                      >
                        <article className="rounded-3xl border-2 border-blue-100 bg-white p-5 shadow-sm">
                          <div className="flex flex-col gap-5 sm:flex-row">

                            {/* IMAGE */}
                            <div className="h-36 w-full shrink-0 overflow-hidden rounded-2xl border-2 border-zinc-200 bg-zinc-100 sm:h-32 sm:w-32">
                              {product.image ? (
                                <img
                                  src={
                                    product.image
                                  }
                                  alt={`${product.name} product`}
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div
                                  role="img"
                                  aria-label={`No image available for ${product.name}`}
                                  className="flex h-full flex-col items-center justify-center gap-2 text-zinc-600"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="text-4xl"
                                  >
                                    📦
                                  </span>

                                  <span className="text-xs font-semibold">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* INFO */}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                  <h3 className="text-xl font-black text-blue-950">
                                    {
                                      product.name
                                    }
                                  </h3>

                                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-700">
                                    {product.description ||
                                      "No product description available."}
                                  </p>
                                </div>

                                <p className="whitespace-nowrap text-2xl font-black text-blue-950">
                                  <span className="sr-only">
                                    Price:
                                  </span>

                                  ₱
                                  {formatPrice(
                                    product.price
                                  )}
                                </p>
                              </div>

                              {/* META */}
                              <dl className="mt-5 flex flex-wrap gap-2">
                                <div>
                                  <dt className="sr-only">
                                    Stock
                                  </dt>

                                  <dd
                                    className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                                      outOfStock
                                        ? "border-red-300 bg-red-50 text-red-900"
                                        : "border-green-300 bg-green-50 text-green-900"
                                    }`}
                                  >
                                    {outOfStock
                                      ? "Out of Stock"
                                      : `Stock: ${product.stock}`}
                                  </dd>
                                </div>

                                <div>
                                  <dt className="sr-only">
                                    Category
                                  </dt>

                                  <dd className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-950">
                                    {categoryName ||
                                      "No category"}
                                  </dd>
                                </div>

                                <div>
                                  <dt className="sr-only">
                                    Supplier
                                  </dt>

                                  <dd className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-800">
                                    {supplierName ||
                                      "No supplier"}
                                  </dd>
                                </div>
                              </dl>

                              {/* ACTIONS */}
                              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  onClick={() =>
                                    handleEdit(
                                      product
                                    )
                                  }
                                  disabled={
                                    saving ||
                                    deletingId ===
                                      product._id
                                  }
                                  aria-label={`Edit ${product.name}`}
                                  className="w-full sm:w-auto"
                                >
                                  Edit Product
                                </Button>

                                <Button
                                  type="button"
                                  variant="danger"
                                  disabled={
                                    deletingId ===
                                      product._id ||
                                    saving
                                  }
                                  aria-busy={
                                    deletingId ===
                                    product._id
                                  }
                                  aria-label={`Delete ${product.name}`}
                                  onClick={() =>
                                    handleDelete(
                                      product
                                    )
                                  }
                                  className="w-full sm:w-auto"
                                >
                                  {deletingId ===
                                  product._id
                                    ? "Deleting..."
                                    : "Delete Product"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </article>
                      </li>
                    );
                  }
                )}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminProductsPage;