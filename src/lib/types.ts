export type ProductOption = {
  id: string;
  position: number;
  name: string;
  values: ProductOptionValue[];
};

export type ProductOptionValue = {
  id: string;
  position: number;
  name: string;
  optionName: string;
  optionId: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  sku: string | null;
  productTitle: string;
  price: number;
  inventoryQuantity: number;
  image: Image | null;
  href: string;
  createdAt: Date;
  updatedAt: Date;

  selectedValues: ProductOptionValue[];
};

export type Product = {
  id: string;
  status: boolean;
  slug: string;
  title: string;
  description: string;
  hasOnlyDefaultVariant: boolean;
  priceRange: {
    minVariantPrice: number;
    maxVariantPrice: number;
  };
  featuredImage: Image | null;
  createdAt: Date;
  updatedAt: Date;

  collections: CollectionPreview[];
  options: ProductOption[];
  variants: ProductVariant[];
};

export type Cart = {
  id: string | undefined;
  items: CartItem[];
  totalQuantity: number;
  cost: {
    totalCost: number;
    subtotalCost: number;
    totalTaxAmount: number;
  };
};

export type CartItem = {
  id: string | undefined;
  totalCost: number;
  quantity: number;
  merchandise: Merchandise;
};

export type Merchandise = {
  variantId: string;
  sku: string | null;
  productTitle: string;
  price: number;
  image: Image | null;
  href: string;
  selectedValues: ProductOptionValue[];
};

export type Image = {
  url: string | null;
  altText: string | null;
};

export type ProductPreview = Omit<
  Product,
  "collections" | "options" | "variants" | "priceRange"
>;

export type Collection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  products: ProductPreview[];
};

export type CollectionPreview = Omit<Collection, "products">;

// Input types
export interface ProductCreateDTO {
  status: boolean;
  title: string;
  description: string;
  featuredImage: Image | null;
  collectionIds: string[];
  options: OptionCreateDTO[];
  variants: ProductVariantCreateDTO[];
}

export interface OptionCreateDTO {
  name: string;
  values: OptionValueCreateInput[];
}

export type OptionCreateInput = OptionCreateDTO & {
  productId: string;
};

export type OptionValueCreateInput = {
  name: string;
};

export interface ProductVariantCreateDTO {
  title: string;
  sku: string | null;
  price: number;
  inventoryQuantity: number;

  selectedValues: VariantOptionValueCreateDTO[];
}

export type ProductVariantCreateInput = ProductVariantCreateDTO & {
  productId: string;
};

export interface VariantOptionValueCreateDTO {
  name: string;
  optionName: string;
}

export type VariantOptionValueCreateInput = VariantOptionValueCreateDTO & {
  id: string;
};

export interface ProductUpdateDTO {
  status?: boolean;
  title?: string;
  description?: string;
  featuredImage?: Image | null;
  collectionIds?: string[];
}

export type ProductUpdateInput = ProductUpdateDTO & {
  id: string;
};

export interface OptionUpdateDTO {
  name: string;
  values: OptionValueUpdateInput[];
}

export type OptionUpdateInput = OptionUpdateDTO & {
  productId: string;
  id: string;
};

export type OptionValueUpdateInput = {
  id?: string;
  name: string;
};

export interface ProductVariantUpdateDTO {
  title?: string;
  sku?: string | null;
  price?: number;
  inventoryQuantity?: number;

  selectedValues?: ProductOptionValue[];
}

export type ProductVariantUpdateInput = ProductVariantUpdateDTO & {
  productId: string;
  id: string;
};

export type CollectionCreateDTO = {
  title: string;
  description: string;
  productIds: string[];
};

export type CollectionUpdateDTO = {
  title?: string;
  description?: string;
  productIds?: string[];
};

export type CollectionUpdateInput = CollectionUpdateDTO & {
  id: string;
};

// API Response Types
interface ProductResponses {
  product: Product;
  products: Product[];
}

interface CollectionResponses {
  collection: Collection;
  collections: Collection[];
}

export type GetProductResponse = Pick<ProductResponses, "product">;

export type GetProductsResponse = Pick<ProductResponses, "products">;

export type CreateProductResponse = Pick<ProductResponses, "product">;

export type CreateVariantResponse = Pick<ProductResponses, "product">;

export type UpdateVariantResponse = Pick<ProductResponses, "product">;

export type GetCollectionResponse = Pick<CollectionResponses, "collection">;

export type GetCollectionsResponse = Pick<CollectionResponses, "collections">;

export type CreateCollectionResponse = Pick<CollectionResponses, "collection">;

export type UpdateProductResponse = Pick<ProductResponses, "product">;

export type CreateOptionResponse = Pick<ProductResponses, "product">;

export type UpdateOptionResponse = Pick<ProductResponses, "product">;
