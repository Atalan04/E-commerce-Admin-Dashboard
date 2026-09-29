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
  <div>
    <div onClick={onClose}/>
  <div>

    <div>
      <h2>Product Details</h2>
      <button onClick={onClose}>
        X
      </button>
    </div>
    {isLoading &&(
      <div>
        {/* <div/> */}
        <p>loading Details ...</p>
      </div>
    )}
    {isError && (
      <div>
        <p>Failed to load product details.</p>
        <button onClick={onClose}>Close</button>
      </div>
    )}
   {product && !isLoading && (
          <div >
            <div >
              <div>
                <img
                  src={
                    Array.isArray(product.imageUrl) && product.imageUrl.length > 0
                      ? product.imageUrl[0]
                      : (product as any).imageUrl || "https://via.placeholder.com/200"
                  }
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div >
                <div >
                  <span>
                    ID: {product?.id ? product.id.slice(0, 8) : "N/A"}...
                  </span>
                  <span>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>

                <h3>{product.title}</h3>
                <p >
                  ${product.price?.toLocaleString()}
                </p>
              </div>
            </div>

            <div >
              <h4>
                Description
              </h4>
              <p>
                {product.description || "No description provided for this product."}
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsModal;
