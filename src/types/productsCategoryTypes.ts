//Category-Types
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  _count?: {
    products: number;
  };
}

//Category-response
interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

//Product-Types
interface ProductTypes {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

//ProductResponse
type ProductRes = ProductTypes[];

//generic type for ts to check answer
interface FullResponse {
  success: boolean;
  data: ProductTypes[];
  meta: PaginationMeta;
}

//Meta type
interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
//Input Params Type
interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc" | string;
}

//for creating new product
interface CreateProductInput {
  title: string;
  description: string;
  price: number | "";
  stock: number | "";
  imageUrl: string;
  categoryId: string;
}

interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

interface SingleProductResponse {
  success: boolean;
  data: ProductTypes;
}
export type {
  ProductTypes,
  Category,
  ProductRes,
  FullResponse,
  GetProductsParams,
  CategoriesResponse,
  CreateProductInput,
  UpdateProductInput,
  SingleProductResponse,
};
