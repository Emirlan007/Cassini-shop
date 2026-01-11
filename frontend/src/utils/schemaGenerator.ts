import type { Product, TranslatedField } from "../types";
import { API_URL } from "../constants";
import i18n from "../i18n";

const getTranslatedText = (
  field: TranslatedField | string | undefined
): string => {
  if (!field) return "";
  if (typeof field === "string") return field;
  const lang = i18n.language.split("-")[0] as "ru" | "en" | "kg";
  return field?.[lang] || field?.ru || "";
};

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
        name: getTranslatedText(product.name),
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
