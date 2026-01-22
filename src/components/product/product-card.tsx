import Link from "next/link";
import Image from "next/image";
import Price from "../price";
import { Product } from "@/src/lib/types";

export default function ProductCard({
  product,
}: {
  product: Product;
}): React.ReactNode {
  return (
    <li>
      <Link href={`/products/${product.slug}`}>
        <div className="flex flex-col gap-4">
          {product.featuredImage?.url ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.name}
              height={750}
              width={600}
              style={{ width: "100%", height: "auto" }}
            />
          ) : (
            <></>
          )}
          <div className="flex justify-between text-sm">
            <p>{product.name}</p>
            <Price amount={product.priceRange.minVariantPrice} />
          </div>
        </div>
      </Link>
    </li>
  );
}
