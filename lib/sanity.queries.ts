import { groq } from "next-sanity";

// Get all featured products
export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    price,
    rating,
    excerpt,
    amazonLink,
    hasFullReview,
    category-> {
      title,
      slug
    },
    publishedAt
  }
`;

// Get latest blog posts
export const latestPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    publishedAt,
    author,
    categories[]-> {
      title,
      slug,
      color
    }
  }
`;

// Get all PRODUCT categories
export const allProductCategoriesQuery = groq`
  *[_type == "productCategory"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    icon,
    order
  }
`;

// Get all BLOG categories
export const allBlogCategoriesQuery = groq`
  *[_type == "blogCategory"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    color,
    order
  }
`;

// Get products by category
export const productsByCategoryQuery = groq`
  *[_type == "product" && category->slug.current == $slug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    price,
    rating,
    excerpt,
    amazonLink,
    hasFullReview,
    category-> {
      title,
      slug
    },
    subcategory,
    publishedAt
  }
`;

// Get single product by slug
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    gallery[] {
      asset-> {
        _id,
        url
      }
    },
    price,
    rating,
    excerpt,
    shortDescription,        // ← ADD THIS
    additionalImages,        // ← ADD THIS
    amazonLink,
    hasFullReview,
    category-> {
      title,
      slug,
      _id
    },
    subcategory,
    pros,
    cons,
    review,
    featured,
    publishedAt,
    seo {
      metaTitle,
      metaDescription,
      keywords
    }
  }
`;

// Get single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    body,
    publishedAt,
    author,
    categories[]-> {
      title,
      slug,
      color
    },
    relatedProducts[]-> {
      _id,
      title,
      slug,
      mainImage {
        asset-> {
          url
        }
      },
      price,
      amazonLink,
      hasFullReview
    },
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// Get PRODUCT category by slug
export const productCategoryBySlugQuery = groq`
  *[_type == "productCategory" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon
  }
`;

// Get BLOG category by slug
export const blogCategoryBySlugQuery = groq`
  *[_type == "blogCategory" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    color
  }
`;

// Get all posts for blog page
export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    publishedAt,
    author,
    categories[]-> {
      title,
      slug,
      color
    }
  }
`;

// Get all products
export const allProductsQuery = groq`
  *[_type == "product"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    price,
    rating,
    excerpt,
    amazonLink,
    hasFullReview,
    category-> {
      title,
      slug
    },
    featured,
    publishedAt
  }
`;

// Search products by query
export const searchProductsQuery = groq`
  *[_type == "product" && (
    title match $query + "*" ||
    excerpt match $query + "*"
  )] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    price,
    rating,
    excerpt,
    amazonLink,
    hasFullReview,
    category-> {
      title,
      slug
    }
  }
`;

// Get related products (same category, exclude current product)
export const relatedProductsQuery = groq`
  *[_type == "product" && category._ref == $categoryId && _id != $currentProductId][0...4] {
    _id,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    price,
    rating,
    excerpt,
    amazonLink,
    hasFullReview
  }
`;
