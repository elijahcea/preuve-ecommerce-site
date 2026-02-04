export type ProductOption = {
  id: string;
  position: number;
  name: string;
  optionValues: ProductOptionValue[];
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
  optionValue: ProductOptionValue;
};

export type ProductVariant = {
  id: string;
  sku: string;
  productName: string;
  price: number;
  inventoryQuantity: number;
  image?: Image;
  href: string;
  createdAt: Date;
  updatedAt: Date;

  selectedOptions: SelectedOption[];
};

export type Product = {
  id: string;
  status: boolean;
  slug: string;
  name: string;
  description: string;
  priceRange: {
    minVariantPrice: number;
    maxVariantPrice: number;
  };
  featuredImage?: Image;
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
  sku: string;
  productName: string;
  price: number;
  image?: Image;
  href: string;
  selectedOptions: SelectedOption[];
};

export type Image = {
  url: string | null;
  altText?: string | null;
  width?: number;
  height?: number;
};

export type ProductPreview = Omit<
  Product,
  "collections" | "options" | "variants" | "priceRange"
>;

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string;
  products: ProductPreview[];
};

export type CollectionPreview = Omit<Collection, "products">;
