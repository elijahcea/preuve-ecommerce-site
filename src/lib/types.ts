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
  optionId: string;
};

export type SelectedOption = {
  name: string;
  value: string;
  optionValueId: string;
};

export type ProductVariant = {
  id: string;
  sku: string | null;
  productTitle: string;
  price: number;
  inventoryQuantity: number;
  image: Image | null;
  href: string;
  createdAt: Date;
  updatedAt: Date;

  selectedOptions: SelectedOption[];
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
  selectedOptions: SelectedOption[];
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

// API input types
export type ProductCreateInput = {
  product: {
    status: boolean;
    title: string;
    description: string;
    featuredImage: Image | null;
    collectionIds: string[];
    options: OptionCreateInput[];
    variants: ProductVariantCreateInput[];
  };
};

export type OptionCreateInput = {
  position: number;
  name: string;
  values: OptionValueCreateInput[];
};

export type OptionValueCreateInput = {
  position: number;
  name: string;
};

export type ProductVariantCreateInput = {
  sku: string | null;
  price: number;
  inventoryQuantity: number;

  optionValues: VariantOptionValueCreateInput[];
};

export type VariantOptionValueCreateInput = {
  name: string;
  optionName: string;
};

// API Response Types
export type GetProductResponse = {
  product: Product;
};

export type GetProductsResponse = {
  products: ProductPreview[];
};

export type CreateProductResponse = {
  product: Product;
};
