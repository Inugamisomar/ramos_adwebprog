import ProductCard from "./ProductCard.jsx";

const ProductList = ({
  products = [],
}) => {
  return (
    <ul
      aria-label="Product results"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map(
        (product, index) => (
          <li
            key={
              product._id ||
              product.name ||
              index
            }
            className="h-full"
          >
            <ProductCard
              product={product}
              index={index}
            />
          </li>
        )
      )}
    </ul>
  );
};

export default ProductList;