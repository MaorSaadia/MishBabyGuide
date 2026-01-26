// lib/sanity.queries.ts
import { groq } from "next-sanity";

// Get all products (both types)
export const allProductsQuery = groq`
  *[_type in ["productReview", "productRecommendation"]] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    amazonLink,
    category-> {
      _id,
      title,
      slug
    },
    featured,
    publishedAt
  }
`;

// Get featured products (both types)
export const featuredProductsQuery = groq`
  *[_type in ["productReview", "productRecommendation"] && featured == true] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    amazonLink,
    category-> {
      _id,
      title,
      slug
    },
    publishedAt
  }
`;

// Get product by slug (checks both types)
export const productBySlugQuery = groq`
  *[_type in ["productReview", "productRecommendation"] && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    amazonLink,
    category-> {
      _id,
      title,
      slug
    },
    featured,
    publishedAt,
    seo {
      metaTitle,
      metaDescription,
      keywords
    },
    
    // Product Review fields
    _type == "productReview" => {
      gallery[] {
        asset-> {
          _id,
          url
        }
      },
      pros,
      cons,
      review
    },
    
    // Product Recommendation fields
    _type == "productRecommendation" => {
      additionalImages[] {
        asset-> {
          _id,
          url
        }
      },
      description
    }
  }
`;

// Get products by category (both types)
export const productsByCategoryQuery = groq`
  *[_type in ["productRecommendation"] && category->slug.current == $slug] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    amazonLink,
    category-> {
      _id,
      title,
      slug
    },
    publishedAt
  }
`;

// Get related products (same category, both types)
export const relatedProductsQuery = groq`
  *[_type in ["productReview", "productRecommendation"] && category._ref == $categoryId && _id != $currentProductId][0...3] {
    _id,
    _type,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    amazonLink,
    category-> {
      title,
      slug
    }
  }
`;

// Search products (both types)
export const searchProductsQuery = groq`
  *[_type in ["productReview", "productRecommendation"] && (
    title match $query + "*" ||
    excerpt match $query + "*"
  )] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    amazonLink,
    category-> {
      title,
      slug
    }
  }
`;

// Get only product reviews
export const productReviewsQuery = groq`
  *[_type == "productReview"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    amazonLink,
    category-> {
      title,
      slug
    },
    publishedAt
  }
`;

// Get only product recommendations
export const productRecommendationsQuery = groq`
  *[_type == "productRecommendation"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    mainImage {
      asset-> {
        _id,
        url
      }
    },
    excerpt,
    amazonLink,
    category-> {
      title,
      slug
    },
    publishedAt
  }
`;

// BLOG QUERIES (unchanged)
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
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

// CATEGORY QUERIES (unchanged)
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

export const productCategoryBySlugQuery = groq`
  *[_type == "productCategory" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon
  }
`;

export const blogCategoryBySlugQuery = groq`
  *[_type == "blogCategory" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    color
  }
`;
