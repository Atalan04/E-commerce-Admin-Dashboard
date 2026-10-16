import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/api";

interface ProductDetailsProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

function ProductDetailsModal({
  productId,
  isOpen,
  onClose,
}: ProductDetailsProps) {
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: isOpen && !!productId,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
      />
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h2 className="text-base font-bold text-slate-800">
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-semibold text-sm"
          >
            X
          </button>
        </div>

        {isLoading && (
          <div className="py-8 text-center text-slate-400 text-xs">
            <p>loading Details ...</p>
          </div>
        )}
        {isError && (
          <div className="py-6 text-center text-rose-500 text-xs space-y-3">
            <p>Failed to load product details.</p>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700"
            >
              Close
            </button>
          </div>
        )}

        {product && !isLoading && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-50">
                <img
                  src={
                    Array.isArray(product.imageUrl) &&
                    product.imageUrl.length > 0
                      ? product.imageUrl[0]
                      : (product as any).imageUrl ||
                        "https://via.placeholder.com/200"
                  }
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xs text-slate-400">
                    ID: {product?.id ? product.id.slice(0, 8) : "N/A"}...
                  </span>
                  <span
                    className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                      product.stock > 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">
                  {product.title}
                </h3>
                <p className="font-mono tabular-nums text-lg font-bold text-blue-600">
                  ${product.price?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <h4 className="text-2xs font-semibold uppercase text-slate-500 tracking-wider mb-1">
                Description
              </h4>
              <p className="text-xs text-slate-600 line-clamp-3">
                {product.description ||
                  "No description provided for this product."}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailsModal;
