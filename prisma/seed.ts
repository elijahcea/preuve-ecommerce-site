import prisma from "@/src/lib/prisma";

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (in reverse order of dependencies)
  console.log("🧹 Cleaning existing data...");
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productOptionValue.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();

  // Create Collections
  console.log("📚 Creating collections...");
  const collections = await Promise.all([
    prisma.collection.create({
      data: {
        name: "Summer Collection",
        slug: "summer-collection",
        description: "Light and breezy styles for warm weather",
      },
    }),
    prisma.collection.create({
      data: {
        name: "New Arrivals",
        slug: "new-arrivals",
        description: "The latest additions to our store",
      },
    }),
    prisma.collection.create({
      data: {
        name: "Best Sellers",
        slug: "best-sellers",
        description: "Our most popular items",
      },
    }),
  ]);

  // Create Products with Options and Variants
  console.log("👕 Creating products...");

  // Product 1: T-Shirt
  const tshirt = await prisma.product.create({
    data: {
      name: "Classic Cotton T-Shirt",
      slug: "classic-cotton-tshirt",
      status: true,
      description:
        "A comfortable, everyday t-shirt made from 100% organic cotton",
      featuredImageURL:
        "https://www.aimeleondore.com/cdn/shop/files/FW25CT080_BOTANICALGARDEN_3_1600x.jpg?v=1764088217",
      featuredImageAlt: "Classic cotton t-shirt",
      collections: {
        connect: [{ id: collections[0].id }, { id: collections[1].id }],
      },
      productOptions: {
        create: [
          {
            name: "Size",
            position: 1,
            optionValues: {
              create: [
                { name: "Small", slug: "s", position: 1 },
                { name: "Medium", slug: "m", position: 2 },
                { name: "Large", slug: "l", position: 3 },
                { name: "X-Large", slug: "xl", position: 4 },
              ],
            },
          },
          {
            name: "Color",
            position: 2,
            optionValues: {
              create: [
                { name: "White", slug: "white", position: 1 },
                { name: "Black", slug: "black", position: 2 },
                { name: "Navy", slug: "navy", position: 3 },
              ],
            },
          },
        ],
      },
    },
    include: {
      productOptions: {
        include: {
          optionValues: true,
        },
      },
    },
  });

  // Get option values for creating variants
  const sizeOption = tshirt.productOptions.find((opt) => opt.name === "Size")!;
  const colorOption = tshirt.productOptions.find(
    (opt) => opt.name === "Color",
  )!;

  const sizes = sizeOption.optionValues;
  const colors = colorOption.optionValues;

  // Create all variant combinations for t-shirt
  const tshirtVariants = [];
  for (const size of sizes) {
    for (const color of colors) {
      const variant = await prisma.productVariant.create({
        data: {
          sku: `TSHIRT-${size.slug.toUpperCase()}-${color.slug.toUpperCase()}`,
          price: 3000,
          inventoryQuantity: Math.floor(Math.random() * 100) + 10,
          //imageUrl: `https://example.com/images/tshirt-${color.slug}.jpg`,
          //imageAlt: `${color.name} t-shirt in ${size.name}`,
          productId: tshirt.id,
          optionValues: {
            connect: [{ id: size.id }, { id: color.id }],
          },
        },
      });
      tshirtVariants.push(variant);
    }
  }

  // Product 2: Jeans
  const jeans = await prisma.product.create({
    data: {
      name: "Slim Fit Jeans",
      slug: "slim-fit-jeans",
      status: true,
      description:
        "Modern slim fit jeans with stretch denim for all-day comfort",
      featuredImageURL:
        "https://www.aimeleondore.com/cdn/shop/files/FW25WP002_DeminPants_LightWash_1_600x.jpg?v=1755718415",
      featuredImageAlt: "Slim fit jeans",
      collections: {
        connect: [{ id: collections[2].id }],
      },
      productOptions: {
        create: [
          {
            name: "Waist Size",
            position: 1,
            optionValues: {
              create: [
                { name: "30", slug: "30", position: 1 },
                { name: "32", slug: "32", position: 2 },
                { name: "34", slug: "34", position: 3 },
                { name: "36", slug: "36", position: 4 },
              ],
            },
          },
          {
            name: "Length",
            position: 2,
            optionValues: {
              create: [
                { name: "30", slug: "30", position: 1 },
                { name: "32", slug: "32", position: 2 },
                { name: "34", slug: "34", position: 3 },
              ],
            },
          },
          {
            name: "Wash",
            position: 3,
            optionValues: {
              create: [
                { name: "Light Blue", slug: "light-blue", position: 1 },
                { name: "Dark Blue", slug: "dark-blue", position: 2 },
              ],
            },
          },
        ],
      },
    },
    include: {
      productOptions: {
        include: {
          optionValues: true,
        },
      },
    },
  });

  const waistOption = jeans.productOptions.find(
    (opt) => opt.name === "Waist Size",
  )!;
  const lengthOption = jeans.productOptions.find(
    (opt) => opt.name === "Length",
  )!;
  const washOption = jeans.productOptions.find((opt) => opt.name === "Wash")!;

  const waistSizes = waistOption.optionValues;
  const lengths = lengthOption.optionValues;
  const washes = washOption.optionValues;

  // Create jeans variants (subset to avoid too many combinations)
  const jeansVariants = [];
  for (const waist of waistSizes) {
    for (const length of lengths) {
      for (const wash of washes) {
        const variant = await prisma.productVariant.create({
          data: {
            sku: `JEANS-${waist.slug}-${length.slug}-${wash.slug.toUpperCase()}`,
            price: 8000,
            inventoryQuantity: Math.floor(Math.random() * 50) + 5,
            //imageUrl: `https://example.com/images/jeans-${wash.slug}.jpg`,
            //imageAlt: `${wash.name} jeans ${waist.name}x${length.name}`,
            productId: jeans.id,
            optionValues: {
              connect: [{ id: waist.id }, { id: length.id }, { id: wash.id }],
            },
          },
        });
        jeansVariants.push(variant);
      }
    }
  }

  // Product 3: Sneakers (simpler, fewer options)
  const sneakers = await prisma.product.create({
    data: {
      name: "Running Sneakers",
      slug: "running-sneakers",
      status: true,
      description: "Lightweight running sneakers with excellent cushioning",
      featuredImageURL:
        "https://www.aimeleondore.com/cdn/shop/files/NB25FS009_CELERY_-19-48_600x.jpg?v=1765918985",
      featuredImageAlt: "Running sneakers",
      collections: {
        connect: [{ id: collections[1].id }, { id: collections[2].id }],
      },
      productOptions: {
        create: [
          {
            name: "Size",
            position: 1,
            optionValues: {
              create: [
                { name: "US 8", slug: "us-8", position: 1 },
                { name: "US 9", slug: "us-9", position: 2 },
                { name: "US 10", slug: "us-10", position: 3 },
                { name: "US 11", slug: "us-11", position: 4 },
              ],
            },
          },
        ],
      },
    },
    include: {
      productOptions: {
        include: {
          optionValues: true,
        },
      },
    },
  });

  const shoeSizeOption = sneakers.productOptions.find(
    (opt) => opt.name === "Size",
  )!;
  const shoeSizes = shoeSizeOption.optionValues;

  const sneakerVariants = [];
  for (const size of shoeSizes) {
    const variant = await prisma.productVariant.create({
      data: {
        sku: `SNEAKERS-${size.slug.toUpperCase()}`,
        price: 13000,
        inventoryQuantity: Math.floor(Math.random() * 30) + 5,
        //imageUrl: "https://example.com/images/sneakers.jpg",
        //imageAlt: `Running sneakers size ${size.name}`,
        productId: sneakers.id,
        optionValues: {
          connect: [{ id: size.id }],
        },
      },
    });
    sneakerVariants.push(variant);
  }

  console.log("✅ Database seeded successfully!");
  console.log(`
📊 Summary:
- Collections: ${collections.length}
- Products: 3
- Product Variants: ${tshirtVariants.length + jeansVariants.length + sneakerVariants.length}
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
