import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import type { Product, ICategory } from "../../types";

interface ProductSchemaProps {
  product?: Product;
}

const getTranslatedTitle = (category: ICategory, language: string): string => {
  const lang = language.split("-")[0] as "ru" | "en" | "kg";
  return category.title?.[lang] || category.title?.ru || "";
};

export const ProductSchema = ({ product }: ProductSchemaProps) => {
  const { i18n } = useTranslation();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.name,
    description: product?.description,
    image: product?.images,
    // sku: product?.sku,
    category: product?.category
      ? {
          "@type": "Thing",
          name: getTranslatedTitle(product.category, i18n.language),
        }
      : undefined,
    // brand: {
    //   "@type": "Brand",
    //   name: product?.brand,
    // },
    offers: {
      "@type": "Offer",
      price: product?.price.toString(),
      priceCurrency: "KGS",
      availability: product?.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  const url = `${window.location.origin}${location.pathname}`;

  return (
    <Helmet>
      <link rel="canonical" href={url} />

      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
