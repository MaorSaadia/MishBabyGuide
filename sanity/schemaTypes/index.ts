// schemas/index.ts
import productReview from "./productReview";
import productRecommendation from "./productRecommendation";
import productCategory from "./productCategory";
import blogCategory from "./blogCategory";
import post from "./post";

export const schemaTypes = [
  // Products
  productReview,
  productRecommendation,
  productCategory,

  // Blog
  post,
  blogCategory,
];
