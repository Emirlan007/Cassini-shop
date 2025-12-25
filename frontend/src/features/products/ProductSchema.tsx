import { Helmet } from "react-helmet-async";
import type { Product } from "../../types";

interface ProductSchemaProps {
  product?: Product;
}

export const ProductSchema = ({ product }: ProductSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product?.name,
    description: product?.description,
    image: product?.images,
    // sku: product?.sku,
    category: product?.category
      ? { "@type": "Thing", name: product?.category.title }
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

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
