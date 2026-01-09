// schemas/index.ts
import productCategory from "./productCategory";
import blogCategory from "./blogCategory";
import post from "./post";
import product from "./product";

export const schemaTypes = [
  // Categories (separate types)
  productCategory,
  blogCategory,

  // Content
  product,
  post,
];
