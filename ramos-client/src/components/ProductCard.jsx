import Button from "./Button";

const ProductCard = ({
  product,
  index,
}) => {
  const categoryName =
    typeof product.category ===
    "object"
      ? product.category?.name
      : product.category;

  const supplierName =
    typeof product.supplier ===
    "object"
      ? product.supplier?.name
      : product.supplier;

  const stock =
    Number(product.stock || 0);

  const description =
    product.description
      ? `${product.description.substring(
          0,
          120
        )}${
          product.description.length >
          120
            ? "..."
            : ""
        }`
      : "No description available.";

  const formattedPrice =
    Number(
      product.price || 0
    ).toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border-2 border-blue-950 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      
      // PRODUCT IMAGE 
      <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
        {product.image ? (
          <img
            src={product.image}
            alt={`${product.name} product`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div
            role="img"
            aria-label={`No image available for ${product.name}`}
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-100 px-4 text-center text-zinc-600"
          >
            <span
              aria-hidden="true"
              className="text-4xl"
            >
              📦
            </span>

            <span className="text-sm font-semibold">
              No image available
            </span>
          </div>
        )}
      </div>

      // CARD CONTENT 
      <div className="flex flex-1 flex-col p-5">
        {/* CATEGORY */}
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
          {categoryName ||
            "Uncategorized"}
          <span
            aria-hidden="true"
          >
            {" "}
            ·{" "}
            {String(
              index + 1
            ).padStart(
              2,
              "0"
            )}
          </span>
        </p>

        // PRODUCT NAME
        <h3 className="mt-2 text-xl font-black leading-snug text-blue-950">
          {product.name}
        </h3>

        // PRICE
        <p className="mt-3 text-2xl font-black text-zinc-950">
          <span className="sr-only">
            Price:
          </span>
          ₱{formattedPrice}
        </p>

        // STOCK 
        <div className="mt-3">
          {stock > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-900">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-green-700"
              />

              In Stock: {stock}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-900">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-red-700"
              />

              Out of Stock
            </span>
          )}
        </div>

        // SUPPLIER 
        {supplierName && (
          <p className="mt-4 text-sm leading-6 text-zinc-700">
            <span className="font-bold text-zinc-950">
              Supplier:
            </span>{" "}
            {supplierName}
          </p>
        )}

        //DESCRIPTION
        <p className="mt-3 flex-1 text-sm leading-6 text-zinc-700">
          {description}
        </p>

        //VIEW PRODUCT 
        <Button
          to={`/products/${product._id}`}
          variant="blue"
          className="mt-5 w-full"
          aria-label={`View ${product.name}`}
        >
          View Product
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;