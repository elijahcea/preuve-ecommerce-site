import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const images = [
    "https://cdn.shopify.com/s/files/1/1600/6017/files/Screen_Shot_2024-05-31_at_6.25.32_PM.png?v=1717194503",
    "https://cdn.shopify.com/s/files/1/1600/6017/files/Screen_Shot_2024-05-31_at_6.25.35_PM.png?v=1717194503",
    "https://cdn.shopify.com/s/files/1/1600/6017/files/Screen_Shot_2024-05-31_at_6.25.45_PM.png?v=1717194503",
  ];
  return (
    <div className="m-auto columns-3 p-5">
      {images.map((image) => {
        return (
          <Link key={image} href="/collections/shop-all">
            <div className="relative h-auto">
              <Image
                src={image}
                alt="Homepage photo"
                height={649}
                width={432}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
