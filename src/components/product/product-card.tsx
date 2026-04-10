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
        <div className="flex flex-col gap-2">
          {product.featuredImage?.url ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              loading="lazy"
              height={750}
              width={600}
              style={{ width: "100%", height: "auto" }}
            />
          ) : (
            <></>
          )}
          <div className="flex justify-between gap-2 text-sm px-1 md:px-2">
            <p>{product.title}</p>
            <Price
              amount={product.priceRange.minVariantPrice}
              styles={["text-foreground/50"]}
            />
          </div>
        </div>
      </Link>
    </li>
  );
}
