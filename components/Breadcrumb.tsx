import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        {/* Home Link */}
        <li className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-600 hover:text-cyan-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          {items.length > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </li>

        {/* Dynamic Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-cyan-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? "text-gray-900 font-medium" : "text-gray-600"
                  }
                >
                  {item.label}
                </span>
              )}

              {!isLast && items.length > 1 && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </li>
          );
        })}
      </ol>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/`
                    : "/",
              },
              ...items.map((item, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: item.label,
                item: item.href
                  ? typeof window !== "undefined"
                    ? `${window.location.origin}${item.href}`
                    : item.href
                  : undefined,
              })),
            ],
          }),
        }}
      />
    </nav>
  );
};

export default Breadcrumb;
