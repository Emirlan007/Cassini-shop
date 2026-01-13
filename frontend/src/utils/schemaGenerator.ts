import type { Product } from "../types";
import { API_URL } from "../constants";

interface SchemaProduct {
  "@type": "Product";
  name: string;
  image: string[];
  offers: {
    "@type": "Offer";
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
  };
}

interface SchemaItemList {
  "@context": "https://schema.org";
  "@type": "ItemList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    item: SchemaProduct;
  }>;
}

export const generateProductListSchema = (
  products: Product[]
): SchemaItemList => {
  const itemListElement = products.map((product, index) => {
    const imageUrl =
      product.images && product.images.length > 0
        ? `${API_URL}${product.images[0].replace(/^\/+/, "")}`
        : "";

    const availability = product.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

    const productUrl = `${window.location.origin}/product/${product.slug}`;
    const price = product.finalPrice || product.price;

    return {
      "@type": "ListItem" as const,
      position: index + 1,
      item: {
        "@type": "Product" as const,
        name: product.name,
        image: imageUrl ? [imageUrl] : [],
        offers: {
          "@type": "Offer" as const,
          price: price,
          priceCurrency: "KGS",
          availability: availability,
          url: productUrl,
        },
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement,
  };
};
