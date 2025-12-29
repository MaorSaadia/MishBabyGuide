import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Clock } from "lucide-react";

interface BlogCardProps {
  title: string;
  slug: string;
  mainImage?: string;
  excerpt: string;
  publishedAt: string;
  author?: string;
  category?: string;
  readTime?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  slug,
  mainImage,
  excerpt,
  publishedAt,
  author,
  category,
  readTime = "5 min read",
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Image Section */}
      <Link
        href={`/blog/${slug}`}
        className="block relative h-56 bg-linear-to-br from-gray-100 to-gray-50 overflow-hidden"
      >
        {mainImage ? (
          <Image
            src={mainImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">
              <svg
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          </div>
        )}
        {category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-cyan-600 text-xs font-semibold rounded-full">
              {category}
            </span>
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/blog/${slug}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-cyan-600 transition-colors line-clamp-2 group-hover:text-cyan-600">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {excerpt}
        </p>

        {/* Author & Read More */}
        <div className="flex items-center justify-between pt-2">
          {author && (
            <span className="text-sm text-gray-500">
              By <span className="font-medium text-gray-700">{author}</span>
            </span>
          )}

          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center gap-2 text-cyan-600 font-semibold text-sm hover:gap-3 transition-all group/link"
          >
            Read More
            <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
