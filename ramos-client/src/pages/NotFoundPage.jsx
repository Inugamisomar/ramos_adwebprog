import Button from "../components/Button";

const NotFoundPage = () => {
  return (
    <main
      id="not-found-main"
      aria-labelledby="not-found-title"
      className="min-h-screen bg-blue-50"
    >

      {/* 404 HERO */}
      <section className="bg-blue-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">

          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
            Error 404
          </p>

          <p
            aria-hidden="true"
            className="mt-5 text-7xl font-black text-yellow-300 sm:text-8xl lg:text-9xl"
          >
            404
          </p>

          <h1
            id="not-found-title"
            className="mt-3 text-4xl font-black tracking-tight sm:text-5xl"
          >
            Page not found
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
            The page you are looking for
            may have been removed, renamed,
            or the address may be incorrect.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              to="/"
              variant="yellow"
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>

            <Button
              to="/products"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section
        aria-labelledby="not-found-links-title"
        className="px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-5xl">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
              Navigation
            </p>

            <h2
              id="not-found-links-title"
              className="mt-2 text-3xl font-black text-blue-950"
            >
              Try one of these pages
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-700">
              These links can help you get
              back to the main areas of
              BulldogEx.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">

            {/* HOME */}
            <article className="rounded-3xl border-2 border-blue-100 bg-white p-6 shadow-sm">
              <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-950 text-xl font-black text-white"
              >
                H
              </div>

              <h3 className="mt-5 text-xl font-black text-blue-950">
                Home
              </h3>

              <p className="mt-2 text-sm leading-7 text-zinc-700">
                Return to the BulldogEx
                homepage and continue
                exploring the store.
              </p>

              <Button
                to="/"
                variant="secondary"
                className="mt-5"
              >
                Go to Home
              </Button>
            </article>

            {/* PRODUCTS */}
            <article className="rounded-3xl border-2 border-yellow-300 bg-yellow-50 p-6 shadow-sm">
              <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-300 text-xl font-black text-blue-950"
              >
                P
              </div>

              <h3 className="mt-5 text-xl font-black text-blue-950">
                Products
              </h3>

              <p className="mt-2 text-sm leading-7 text-zinc-700">
                Search and browse available
                BulldogEx merchandise.
              </p>

              <Button
                to="/products"
                variant="blue"
                className="mt-5"
              >
                View Products
              </Button>
            </article>

          </div>
        </div>
      </section>

    </main>
  );
};

export default NotFoundPage;