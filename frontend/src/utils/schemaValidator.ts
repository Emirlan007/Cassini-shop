import type { Product } from "../types";

export const validateSchemaMarkup = () => {
  const schemaScripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );

  console.group("📊 Schema.org Validation");
  console.log(`Found ${schemaScripts.length} schema script(s)`);

  schemaScripts.forEach((script, index) => {
    try {
      const data = JSON.parse(script.textContent || "");
      console.group(`Schema ${index + 1}:`);
      console.log("Type:", data["@type"]);
      console.log("Context:", data["@context"]);

      if (data["@type"] === "ItemList") {
        console.log(`Total products: ${data.itemListElement?.length || 0}`);
        console.table(
          data.itemListElement?.map((item: any) => ({
            position: item.position,
            name: item.item?.name,
            price: item.item?.offers?.price,
            availability: item.item?.offers?.availability,
            hasImage: item.item?.image?.length > 0,
          }))
        );
      }

      console.log("Full data:", data);
      console.groupEnd();
    } catch (error) {
      console.error(`Error parsing schema ${index + 1}:`, error);
    }
  });

  console.groupEnd();
};

export const validateProduct = (product: Product): string[] => {
  const errors: string[] = [];

  if (!product.name || product.name.trim() === "") {
    errors.push("Product name is empty");
  }

  if (!product.price || product.price <= 0) {
    errors.push("Product price is invalid");
  }

  if (!product.slug || product.slug.trim() === "") {
    errors.push("Product slug is empty");
  }

  if (!product.images || product.images.length === 0) {
    errors.push("Product has no images");
  }

  return errors;
};

export const validateProducts = (products: Product[]): void => {
  if (import.meta.env.DEV) {
    console.group("🔍 Products Validation for Schema.org");

    const invalidProducts = products
      .map((product) => ({
        product,
        errors: validateProduct(product),
      }))
      .filter((item) => item.errors.length > 0);

    if (invalidProducts.length > 0) {
      console.warn(`Found ${invalidProducts.length} invalid product(s):`);
      invalidProducts.forEach(({ product, errors }) => {
        console.group(`❌ ${product.name || "Unnamed"} (${product._id})`);
        errors.forEach((error) => console.warn(error));
        console.groupEnd();
      });
    } else {
      console.log(`✅ All ${products.length} products are valid`);
    }

    console.groupEnd();
  }
};

if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).validateSchemaMarkup = validateSchemaMarkup;
}
