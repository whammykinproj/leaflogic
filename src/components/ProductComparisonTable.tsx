export interface Product {
  name: string;
  features: string[];
  priceRange: string;
  affiliateUrl: string;
  rating: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductComparisonTable({
  products,
}: {
  products: Product[];
}) {
  return (
    <div className="my-10">
      <h2 className="mb-6 text-2xl font-bold text-green-primary">
        Product Comparison
      </h2>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-bg">
              <th className="px-4 py-3 text-left font-semibold text-green-primary">
                Product
              </th>
              <th className="px-4 py-3 text-left font-semibold text-green-primary">
                Key Features
              </th>
              <th className="px-4 py-3 text-left font-semibold text-green-primary">
                Price
              </th>
              <th className="px-4 py-3 text-left font-semibold text-green-primary">
                Rating
              </th>
              <th className="px-4 py-3 text-left font-semibold text-green-primary">
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr
                key={i}
                className="border-t border-border transition-colors hover:bg-cream"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-foreground/70">
                  <ul className="list-disc pl-4 space-y-0.5">
                    {product.features.map((f, j) => (
                      <li key={j}>{f}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {product.priceRange}
                </td>
                <td className="px-4 py-3">
                  <StarRating rating={product.rating} />
                </td>
                <td className="px-4 py-3">
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="nofollow noopener"
                    className="inline-block rounded-lg bg-green-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-dark"
                  >
                    View on Amazon
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {products.map((product, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-white p-5"
          >
            <h3 className="text-base font-bold text-foreground">
              {product.name}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <StarRating rating={product.rating} />
              <span className="text-sm font-medium text-foreground/70">
                {product.priceRange}
              </span>
            </div>
            <ul className="mt-3 list-disc pl-4 space-y-1 text-sm text-foreground/70">
              {product.features.map((f, j) => (
                <li key={j}>{f}</li>
              ))}
            </ul>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="nofollow noopener"
              className="mt-4 block rounded-lg bg-green-primary py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-green-dark"
            >
              View on Amazon
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
