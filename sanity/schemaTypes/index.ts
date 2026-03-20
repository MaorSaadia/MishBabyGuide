// schemas/index.ts
import productReview from "./productReview";
import productRecommendation from "./productRecommendation";
import productCategory from "./productCategory";
import blogCategory from "./blogCategory";
import post from "./post";
import newsletter from "./newsletter";
import newsletterSubscriber from "./newsletterSubscriber";
import amazonProductData from "./amazonProductData";

export const schemaTypes = [
  amazonProductData,

  // Products
  productReview,
  productRecommendation,
  productCategory,

  // Blog
  post,
  blogCategory,

  // Newsletter
  newsletter,
  newsletterSubscriber,
];
