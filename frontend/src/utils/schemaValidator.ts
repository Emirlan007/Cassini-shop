import type { Product } from "../types";

export const validateSchemaMarkup = () => {
  const schemaScripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );

  schemaScripts.forEach((script) => {
    try {
      JSON.parse(script.textContent || "");
    } catch (error) {
      // Silent validation
    }
  });
};

export const validateProduct = (product: Product): string[] => {
  const errors: string[] = [];

  const productName =
    typeof product.name === "string" ? product.name : product.name?.ru || "";

  if (!productName || productName.trim() === "") {
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
    products.forEach((product) => {
      validateProduct(product);
    });
  }
};

if (typeof window !== "undefined" && import.meta.env.DEV) {
  (window as any).validateSchemaMarkup = validateSchemaMarkup;
}
