import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getProductsByCategory,
  getAllCategories,
} from "@/lib/sanity.client";
import CategoryContent from "@/components/CategoryContent";

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    slug: category.slug.current,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const title = `${category.title} - Baby Products | Mish Baby Guide`;
  const description =
    category.description ||
    `Browse our curated selection of ${category.title.toLowerCase()} products for your baby. Trusted recommendations from Mish Baby Guide.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Mish Baby Guide",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const [category, products] = await Promise.all([
    getCategoryBySlug(params.slug),
    getProductsByCategory(params.slug),
  ]);

  // Return 404 if category doesn't exist
  if (!category) {
    notFound();
  }

  return <CategoryContent category={category} initialProducts={products} />;
}
