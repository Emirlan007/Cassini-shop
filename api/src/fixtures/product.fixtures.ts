import { ProductsService } from '../products/products.service';

export async function createProductFixtures(
  productsService: ProductsService,)
{
  console.log('Creating products...');
  return await productsService.createMany([
    {
      name: 'Classic Black Shawl Lapel Dress',
      colors: ['Black', 'Navy Blue', 'Charcoal Gray', 'Midnight Blue'],
      description:
        'Timeless and elegant, this black tuxedo features a sleek shawl lapel with a satin finish, exuding old-Hollywood charm. Perfect for formal galas or black-tie weddings, its tailored silhouette creates a refined and confident look that never goes out of style.',
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      price: 999,
      video: 'fixtures/dressVideo11.mp4',
      images: [
        'fixtures/dress1.webp',
        'fixtures/dress2.webp',
        'fixtures/dress3.png',
        'fixtures/dress4.png',
        'fixtures/dress5.png',
        'fixtures/dress6.png',
        'fixtures/dressPos1.png',
        'fixtures/dressPos2.png',
      ],
    },
    {
      name: 'Midnight Blue Peak Lapel Dress',
      colors: ['Black', 'Navy Blue', 'Charcoal Gray', 'Midnight Blue'],
      description:
        'A sophisticated twist on the traditional black, this midnight blue tuxedo commands attention under evening lights. The peak lapels and slim-fit design highlight modern elegance, making it an ideal choice for the man who wants to stand out—subtly.',
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      price: 999,
      video: 'fixtures/dressVideo22.mp4',
      images: [
        'fixtures/dress2.webp',
        'fixtures/dress1.webp',
        'fixtures/dress3.png',
        'fixtures/dress4.png',
        'fixtures/dress5.png',
        'fixtures/dress6.png',
        'fixtures/dressPos1.png',
        'fixtures/dressPos2.png',
      ],
    },
    {
      name: 'White Dinner Jacket Dress',
      colors: ['Black', 'Navy Blue', 'Charcoal Gray', 'Midnight Blue'],
      description:
        "Crisp, bold, and effortlessly suave, this white dinner jacket tuxedo pairs a cream or ivory jacket with black trousers. Featuring satin-covered buttons and a tailored fit, it channels a vintage James Bond aesthetic that's perfect for summer soirées or destination weddings.",
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      price: 999,
      video: 'fixtures/dressVideo11.mp4',
      images: [
        'fixtures/dress3.png',
        'fixtures/dress2.webp',
        'fixtures/dress1.webp',
        'fixtures/dress4.png',
        'fixtures/dress5.png',
        'fixtures/dress6.png',
        'fixtures/dressPos1.png',
        'fixtures/dressPos2.png',
      ],
    },
    {
      name: 'Velvet Burgundy Dress',
      colors: ['Black', 'Navy Blue', 'Charcoal Gray', 'Midnight Blue'],
      description:
        'Rich in color and texture, this burgundy velvet tuxedo brings luxury to the forefront. The plush fabric adds depth and warmth, while the black satin lapels introduce a sharp contrast. Ideal for evening events where you want to make a statement without saying a word.',
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      price: 999,
      video: 'fixtures/dressVideo22.mp4',
      images: [
        'fixtures/dress4.png',
        'fixtures/dress2.webp',
        'fixtures/dress3.png',
        'fixtures/dress1.webp',
        'fixtures/dress5.png',
        'fixtures/dress6.png',
        'fixtures/dressPos1.png',
        'fixtures/dressPos2.png',
      ],
    },
    {
      name: 'Modern Slim-Fit Charcoal Dress',
      colors: ['Black', 'Navy Blue', 'Charcoal Gray', 'Midnight Blue'],
      description:
        "Designed for the contemporary gentleman, this charcoal tuxedo blends formal tradition with modern tailoring. The narrow lapels and tapered trousers create a streamlined silhouette that's both minimalist and fashion-forward — perfect for creative professionals or urban weddings.",
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      price: 999,
      video: 'fixtures/dressVideo11.mp4',
      images: [
        'fixtures/dress5.png',
        'fixtures/dress2.webp',
        'fixtures/dress3.png',
        'fixtures/dress4.png',
        'fixtures/dress1.webp',
        'fixtures/dress6.png',
        'fixtures/dressPos1.png',
        'fixtures/dressPos2.png',
      ],
    },
    {
      name: 'Patterned Jacquard Dress',
      colors: ['Black', 'Navy Blue', 'Charcoal Gray', 'Midnight Blue'],
      description:
        'For the bold and fashion-savvy, this jacquard tuxedo features an intricate woven pattern that catches the light beautifully. The mix of texture and sheen gives a regal, couture-inspired feel, making it the centerpiece of any red-carpet or high-profile event.',
      size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      price: 999,
      video: 'fixtures/dressVideo22.mp4',
      images: [
        'fixtures/dress6.png',
        'fixtures/dress2.webp',
        'fixtures/dress3.png',
        'fixtures/dress4.png',
        'fixtures/dress5.png',
        'fixtures/dress1.webp',
        'fixtures/dressPos1.png',
        'fixtures/dressPos2.png',
      ],
    },
  ]);
}
