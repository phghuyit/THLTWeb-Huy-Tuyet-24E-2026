import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { productService } from "@/services/productService";
import { PRODUCTS } from "@/data/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm · StyleRent" };

  return {
    title: `${product.name} · StyleRent`,
    description: (product.description || "").slice(0, 160),
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
