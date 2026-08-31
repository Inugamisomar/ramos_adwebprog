import Button from "../../components/Button";

import shop from "../../assets/img/bulldogex.png";
import bag from "../../assets/img/bag.jpg";
import hoodie from "../../assets/img/hoodies.jpg";
import tumbler from "../../assets/img/tumbler.jpg";
import cap from "../../assets/img/nucap.jpg";

const AboutPage = () => {
  const categories = [
    {
      name: "Bags",
      image: bag,
      alt: "BulldogEx bag product",
    },
    {
      name: "Apparel",
      image: hoodie,
      alt: "BulldogEx apparel product",
    },
    {
      name: "Drinkware",
      image: tumbler,
      alt: "BulldogEx drinkware product",
    },
    {
      name: "Accessories",
      image: cap,
      alt: "BulldogEx accessories product",
    },
  ];

  return (
    <main
      aria-labelledby="about-title"
      className="min-h-screen bg-blue-50"
    >
      {/* HERO */}
      <section
        aria-labelledby="about-title"
        className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          {/* IMAGE */}
          <div className="overflow-hidden rounded-3xl border-2 border-blue-200 bg-white p-3 shadow-sm">
            <img
              src={shop}
              alt="BulldogEx campus shop"
              className="h-full min-h-72 w-full rounded-2xl object-cover"
            />
          </div>

          {/* CONTENT */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              About BulldogEx
            </p>

            <h1
              id="about-title"
              className="mt-3 max-w-2xl text-4xl font-black leading-tight tracking-tight text-blue-950 sm:text-5xl"
            >
              Campus shopping made simpler
              for the Bulldog community.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-700 sm:text-base">
              BulldogEx provides students
              and members of the campus
              community with a convenient
              way to browse merchandise,
              manage their cart, place
              orders, and track claiming
              status online.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                to="/products"
                variant="blue"
                className="w-full sm:w-auto"
              >
                Browse Products
              </Button>

              <Button
                to="/"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Back Home
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STORE PURPOSE */}
      <section
        aria-labelledby="store-purpose-title"
        className="border-y-2 border-blue-100 bg-white px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              Store Experience
            </p>

            <h2
              id="store-purpose-title"
              className="mt-2 text-3xl font-black text-blue-950"
            >
              Why use BulldogEx?
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-700 sm:text-base">
              The system is designed to
              make product browsing and
              ordering straightforward,
              while keeping customers
              informed about their orders.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {/* BROWSE PRODUCTS */}
            <article className="rounded-3xl border-2 border-blue-100 bg-blue-50 p-6">
              <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-950 text-xl text-white"
              >
                1
              </div>

              <h3 className="mt-5 text-xl font-black text-blue-950">
                Browse Products
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-700">
                Search available products
                and browse merchandise by
                category to quickly find
                what you need.
              </p>
            </article>

            {/* PLACE ORDER */}
            <article className="rounded-3xl border-2 border-yellow-300 bg-yellow-50 p-6">
              <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-300 text-xl font-black text-blue-950"
              >
                2
              </div>

              <h3 className="mt-5 text-xl font-black text-blue-950">
                Place Your Order
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-700">
                Add products to your cart,
                review quantities and
                prices, then submit your
                order securely.
              </p>
            </article>

            {/* TRACK ORDER */}
            <article className="rounded-3xl border-2 border-green-200 bg-green-50 p-6">
              <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-700 text-xl font-black text-white"
              >
                3
              </div>

              <h3 className="mt-5 text-xl font-black text-blue-950">
                Track Order Status
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-700">
                Monitor whether your order
                is pending, confirmed, or
                ready for claiming directly
                from your account.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CATEGORY PREVIEW */}
      <section
        aria-labelledby="category-preview-title"
        className="px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
                Store Categories
              </p>

              <h2
                id="category-preview-title"
                className="mt-2 text-3xl font-black text-blue-950"
              >
                Explore BulldogEx products
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-700 sm:text-base">
                Browse some of the
                merchandise categories
                available through the
                BulldogEx store.
              </p>
            </div>

            <Button
              to="/products"
              variant="secondary"
            >
              View All Products
            </Button>
          </div>

          <ul
            aria-label="BulldogEx product categories"
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {categories.map((category) => (
              <li key={category.name}>
                <article className="group overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                    <img
                      src={category.image}
                      alt={category.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-black text-blue-950">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Explore available{" "}
                      {category.name.toLowerCase()}{" "}
                      in the BulldogEx
                      catalog.
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="border-t-2 border-blue-100 bg-blue-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
              Start Shopping
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Ready to explore the store?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
              Browse BulldogEx products,
              check stock availability,
              view reviews, and place your
              next order.
            </p>
          </div>

          <Button
            to="/products"
            variant="yellow"
            className="w-full sm:w-auto"
          >
            Shop BulldogEx
          </Button>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;