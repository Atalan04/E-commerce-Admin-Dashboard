import type { ProductTypes } from "../types/productsCategoryTypes";
import ProductForm from "./ProductForm";

interface ProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: ProductTypes | null;
}

function ProductsModal({ isOpen, onClose, productToEdit }: ProductsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <ProductForm
        key={productToEdit?.id ?? "new"}
        productToEdit={productToEdit}
        onClose={onClose}
      />
    </div>
  );
}

export default ProductsModal;
