import Image from "next/image";

export default function Home() {
  const images = [
    "https://cdn.shopify.com/s/files/1/1600/6017/files/Screen_Shot_2024-05-31_at_6.25.32_PM.png?v=1717194503",
    "https://cdn.shopify.com/s/files/1/1600/6017/files/Screen_Shot_2024-05-31_at_6.25.35_PM.png?v=1717194503",
    "https://cdn.shopify.com/s/files/1/1600/6017/files/Screen_Shot_2024-05-31_at_6.25.45_PM.png?v=1717194503",
  ];
  return (
    <div className="m-auto grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {images.map((image, idx) => {
        return (
          <div key={idx} className="relative h-auto">
            <Image
              src={image}
              alt="Homepage photo"
              height={649}
              width={432}
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}
