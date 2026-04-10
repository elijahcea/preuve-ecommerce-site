import Image from "next/image";

export default function Home() {
  const images = [
    "https://res.cloudinary.com/dedr8n2bj/image/upload/v1775855787/Screen_Shot_2024-05-31_at_6.25.32_PM_de41wk.webp",
    "https://res.cloudinary.com/dedr8n2bj/image/upload/v1775855787/Screen_Shot_2024-05-31_at_6.25.35_PM_skat4b.webp",
    "https://res.cloudinary.com/dedr8n2bj/image/upload/v1775855787/Screen_Shot_2024-05-31_at_6.25.45_PM_ywdc9b.webp",
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
