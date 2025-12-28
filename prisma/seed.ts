import prisma from "@/src/lib/prisma";

async function main() {
  console.log('🌱 Starting seed...');

  // Clean the database (careful in production!)
  console.log('🧹 Cleaning database...');
  await prisma.variantOption.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productOptionValue.deleteMany();
  await prisma.optionValue.deleteMany();
  await prisma.option.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();

  // ========================================
  // 1. CREATE GLOBAL OPTIONS
  // ========================================
  console.log('📝 Creating options...');

  const colorOption = await prisma.option.create({
    data: {
      name: 'Color',
      slug: 'color',
      values: {
        create: [
          { name: 'Black', slug: 'black' },
          { name: 'White', slug: 'white' },
          { name: 'Navy', slug: 'navy' },
          { name: 'Gray', slug: 'gray' },
          { name: 'Red', slug: 'red' },
          { name: 'Blue', slug: 'blue' },
          { name: 'Green', slug: 'green' },
        ]
      }
    },
    include: { values: true }
  });

  const sizeOption = await prisma.option.create({
    data: {
      name: 'Size',
      slug: 'size',
      values: {
        create: [
          { name: 'XS', slug: 'xs' },
          { name: 'S', slug: 's' },
          { name: 'M', slug: 'm' },
          { name: 'L', slug: 'l' },
          { name: 'XL', slug: 'xl' },
          { name: 'XXL', slug: 'xxl' },
        ]
      }
    },
    include: { values: true }
  });

  const materialOption = await prisma.option.create({
    data: {
      name: 'Material',
      slug: 'material',
      values: {
        create: [
          { name: 'Cotton', slug: 'cotton' },
          { name: 'Polyester', slug: 'polyester' },
          { name: 'Wool', slug: 'wool' },
          { name: 'Linen', slug: 'linen' },
        ]
      }
    },
    include: { values: true }
  });

  console.log('✅ Created options with values');

  // Get specific option values we'll use
  const black = colorOption.values.find(v => v.slug === 'black')!;
  const white = colorOption.values.find(v => v.slug === 'white')!;
  const navy = colorOption.values.find(v => v.slug === 'navy')!;
  const gray = colorOption.values.find(v => v.slug === 'gray')!;

  const small = sizeOption.values.find(v => v.slug === 's')!;
  const medium = sizeOption.values.find(v => v.slug === 'm')!;
  const large = sizeOption.values.find(v => v.slug === 'l')!;
  const xl = sizeOption.values.find(v => v.slug === 'xl')!;

  const cotton = materialOption.values.find(v => v.slug === 'cotton')!;
  const wool = materialOption.values.find(v => v.slug === 'wool')!;

  // ========================================
  // 2. CREATE COLLECTIONS
  // ========================================
  console.log('📦 Creating collections...');

  const shopAllCollection = await prisma.collection.create({
    data: {
      name: "Shop-All",
      slug: 'shop-all',
      description: 'All available products'
    }
  });

  const menCollection = await prisma.collection.create({
    data: {
      name: "Men's Clothing",
      slug: 'mens-clothing',
      description: 'Stylish clothing for men'
    }
  });

  const womenCollection = await prisma.collection.create({
    data: {
      name: "Women's Clothing",
      slug: 'womens-clothing',
      description: 'Elegant clothing for women'
    }
  });

  const lifestyleCollection = await prisma.collection.create({
    data: {
      name: "Lifestyle products",
      slug: 'lifestyle-products',
      description: 'Exclusive products for you to live Preuve NY'
    }
  });

  console.log('✅ Created collections');

  // ========================================
  // 3. CREATE PRODUCT 1: Classic T-Shirt
  // ========================================
  console.log('👕 Creating Classic T-Shirt...');

  const tshirt = await prisma.product.create({
    data: {
      name: 'Classic T-Shirt',
      slug: 'classic-t-shirt',
      description: 'A comfortable cotton t-shirt perfect for everyday wear',
      featuredImageURL: 'https://www.aimeleondore.com/cdn/shop/files/FW25CT080_BOTANICALGARDEN_3_1600x.jpg?v=1764088217',
      isAvailableForSale: true,
      collections: {
        connect: [{ id: menCollection.id }, { id: shopAllCollection.id }]
      },
      productOptionValues: {
        create: [
          // Colors for this product
          { optionValueId: black.id },
          { optionValueId: white.id },
          { optionValueId: navy.id },
          // Sizes for this product
          { optionValueId: small.id },
          { optionValueId: medium.id },
          { optionValueId: large.id },
          { optionValueId: xl.id },
        ]
      }
    }
  });

  // Create variants for t-shirt
  const tshirtVariants = [
    { color: black, size: small, stock: 10 },
    { color: black, size: medium, stock: 15 },
    { color: black, size: large, stock: 20 },
    { color: black, size: xl, stock: 5 },
    { color: white, size: small, stock: 8 },
    { color: white, size: medium, stock: 12 },
    { color: white, size: large, stock: 0 }, // Out of stock!
    { color: white, size: xl, stock: 7 },
    { color: navy, size: small, stock: 0 }, // Out of stock!
    { color: navy, size: medium, stock: 10 },
    { color: navy, size: large, stock: 15 },
    { color: navy, size: xl, stock: 8 },
  ];

  for (const variant of tshirtVariants) {
    await prisma.productVariant.create({
      data: {
        sku: `TSHIRT-${variant.color.slug.toUpperCase()}-${variant.size.slug.toUpperCase()}`,
        isAvailableForSale: true,
        productId: tshirt.id,
        price: 3000,
        stock: variant.stock,
        selectedOptions: {
          create: [
            { optionValueId: variant.color.id },
            { optionValueId: variant.size.id }
          ]
        }
      }
    });
  }

  console.log('✅ Created Classic T-Shirt with variants');

  // ========================================
  // 4. CREATE PRODUCT 2: Wool Sweater
  // ========================================
  console.log('🧶 Creating Wool Sweater...');

  const sweater = await prisma.product.create({
    data: {
      name: 'Wool Sweater',
      slug: 'wool-sweater',
      description: 'Warm and cozy wool sweater for cold days',
      featuredImageURL:  'https://www.aimeleondore.com/cdn/shop/files/KS022_WINERY_1_600x.jpg?v=1755640460',
      isAvailableForSale: true,
      collections: {
        connect: [{ id: menCollection.id }, { id: womenCollection.id }, { id: shopAllCollection.id }]
      },
      productOptionValues: {
        create: [
          // Only Gray and Navy colors for sweater
          { optionValueId: gray.id },
          { optionValueId: navy.id },
          // Sizes
          { optionValueId: medium.id },
          { optionValueId: large.id },
          { optionValueId: xl.id },
        ]
      }
    }
  });

  // Create variants for sweater
  const sweaterVariants = [
    { color: gray, size: medium, stock: 5 },
    { color: gray, size: large, stock: 8 },
    { color: gray, size: xl, stock: 3 },
    { color: navy, size: medium, stock: 0 }, // Out of stock!
    { color: navy, size: large, stock: 6 },
    { color: navy, size: xl, stock: 4 },
  ];

  for (const variant of sweaterVariants) {
    await prisma.productVariant.create({
      data: {
        sku: `SWEATER-${variant.color.slug.toUpperCase()}-${variant.size.slug.toUpperCase()}`,
        isAvailableForSale: true,
        productId: sweater.id,
        price: 8000,
        stock: variant.stock,
        selectedOptions: {
          create: [
            { optionValueId: variant.color.id },
            { optionValueId: variant.size.id }
          ]
        }
      }
    });
  }

  console.log('✅ Created Wool Sweater with variants');

  // ========================================
  // 5. CREATE PRODUCT 3: Cotton Socks (Single Option)
  // ========================================
  console.log('🧦 Creating Cotton Socks...');

  const socks = await prisma.product.create({
    data: {
      name: 'Cotton Socks',
      slug: 'cotton-socks',
      description: 'Comfortable cotton socks, sold in pairs',
      featuredImageURL: 'https://www.aimeleondore.com/cdn/shop/files/4x5_FW24D1_ACC_FW24AS058_KALAMATA_4544_1600x.jpg?v=1724172011',
      isAvailableForSale: true,
      collections: {
        connect: [{ id: menCollection.id }, { id: shopAllCollection.id }]
      },
      productOptionValues: {
        create: [
          // Only color option, no size
          { optionValueId: black.id },
          { optionValueId: white.id },
          { optionValueId: gray.id },
        ]
      }
    }
  });

  // Create variants for socks (only color, no size)
  const socksVariants = [
    { color: black, stock: 50 },
    { color: white, stock: 30 },
    { color: gray, stock: 25 },
  ];

  for (const variant of socksVariants) {
    await prisma.productVariant.create({
      data: {
        sku: `SOCKS-${variant.color.slug.toUpperCase()}`,
        isAvailableForSale: true,
        productId: socks.id,
        price: 1300,
        stock: variant.stock,
        selectedOptions: {
          create: [
            { optionValueId: variant.color.id }
          ]
        }
      }
    });
  }

  console.log('✅ Created Cotton Socks with variants');

  // ========================================
  // 5. CREATE PRODUCT 4: Cotton Scarf (No options)
  // ========================================
  console.log('Creating Scarf...');
  // Product with no options
  const mug = await prisma.product.create({
    data: {
      name: 'Scarf',
      slug: 'scarf',
      description: 'Exclusive Scarf for the holiday season',
      featuredImageURL: 'https://www.aimeleondore.com/cdn/shop/files/FW25AS020_PorscheScarf_TangoRed_22_600x.jpg?v=1760551547',
      isAvailableForSale: true,
      collections: {
        connect: [{ id: lifestyleCollection.id }, { id: shopAllCollection.id }]
      }
    }
  });

  console.log('✅ Created Scarf with variants');

  await prisma.productVariant.create({
    data: {
      sku: `MUG`,
      isAvailableForSale: true,
      productId: mug.id,
      price: 8000,
      stock: 10,
    }
  });

  console.log('Created Scarf variant...')

  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n🎉 Seed completed successfully!\n');
  console.log('Summary:');
  console.log('- 3 Options (Color, Size, Material)');
  console.log('- 17 Option Values');
  console.log('- 3 Collections');
  console.log('- 4 Products');
  console.log('- 21 Product Variants');
  console.log('\nYou can now test with:');
  console.log('- /products/classic-t-shirt (2 options: Color & Size)');
  console.log('- /products/wool-sweater (2 options: Color & Size)');
  console.log('- /products/cotton-socks (1 option: Color only)');
  console.log('- /products/scarf (No options)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });