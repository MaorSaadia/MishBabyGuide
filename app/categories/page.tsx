// import Link from "next/link";
// import { Metadata } from "next";
// import { Grid3x3, ArrowRight, Package } from "lucide-react";
// import { getAllCategories, getAllProducts } from "@/lib/sanity.client";

// // SEO Metadata
// export const metadata: Metadata = {
//   title: "All Baby Product Categories | Mish Baby Guide",
//   description:
//     "Browse all baby product categories at Mish Baby Guide. Find everything you need for your little one, from nursery essentials to feeding supplies and safety products.",
//   keywords: [
//     "baby products",
//     "baby categories",
//     "nursery products",
//     "baby essentials",
//     "baby gear",
//     "baby shopping",
//   ],
//   openGraph: {
//     title: "All Baby Product Categories | Mish Baby Guide",
//     description:
//       "Browse all baby product categories at Mish Baby Guide. Find everything you need for your little one.",
//     type: "website",
//     siteName: "Mish Baby Guide",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "All Baby Product Categories | Mish Baby Guide",
//     description:
//       "Browse all baby product categories at Mish Baby Guide. Find everything you need for your little one.",
//   },
// };

// export default async function CategoriesPage() {
//   const [categories, allProducts] = await Promise.all([
//     getAllCategories(),
//     getAllProducts(),
//   ]);

//   // Count products per category
//   const categoriesWithCounts = categories.map((category) => {
//     const productCount = allProducts.filter(
//       (product) => product.category?.slug.current === category.slug.current
//     ).length;
//     return { ...category, productCount };
//   });

//   // Sort by product count (most products first)
//   const sortedCategories = categoriesWithCounts.sort(
//     (a, b) => b.productCount - a.productCount
//   );

//   const totalProducts = allProducts.length;
//   const totalCategories = categories.length;

//   return (
//     <div className="min-h-screen bg-linear-to-b from-cyan-50 to-white">
//       {/* Hero Section */}
//       <section className="bg-linear-to-r from-cyan-100 to-blue-100 py-16 md:py-20">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <Grid3x3 className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//               Browse All Categories
//             </h1>
//             <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
//               Explore our curated collection of baby products organized by
//               category. Find exactly what you need for your little one.
//             </p>
//             <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600">
//               <div className="flex items-center gap-2">
//                 <Grid3x3 className="w-5 h-5 text-cyan-600" />
//                 <span className="font-semibold">{totalCategories}</span>
//                 <span>Categories</span>
//               </div>
//               <div className="w-1 h-1 bg-gray-400 rounded-full" />
//               <div className="flex items-center gap-2">
//                 <Package className="w-5 h-5 text-cyan-600" />
//                 <span className="font-semibold">{totalProducts}</span>
//                 <span>Products</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Grid */}
//       <section className="py-16 md:py-20">
//         <div className="container mx-auto px-4">
//           <div className="max-w-7xl mx-auto">
//             {sortedCategories.length === 0 ? (
//               // Empty State
//               <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//                 <Grid3x3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                   No Categories Yet
//                 </h2>
//                 <p className="text-gray-600 mb-6">
//                   We&apos;re currently setting up our categories. Check back
//                   soon!
//                 </p>
//                 <Link
//                   href="/"
//                   className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
//                 >
//                   Go to Homepage
//                 </Link>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {sortedCategories.map((category, index) => (
//                   <Link
//                     key={category._id}
//                     href={`/category/${category.slug.current}`}
//                     className="group"
//                   >
//                     <div
//                       className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col"
//                       style={{
//                         animation: `fadeIn 0.5s ease-in-out ${
//                           index * 0.05
//                         }s both`,
//                       }}
//                     >
//                       {/* Category Icon/Header */}
//                       <div className="bg-linear-to-br from-cyan-50 to-blue-50 p-8 text-center border-b group-hover:from-cyan-100 group-hover:to-blue-100 transition-all duration-300">
//                         {category.icon ? (
//                           <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
//                             {category.icon}
//                           </div>
//                         ) : (
//                           <Grid3x3 className="w-16 h-16 text-cyan-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
//                         )}
//                       </div>

//                       {/* Category Details */}
//                       <div className="p-6 flex-1 flex flex-col">
//                         <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
//                           {category.title}
//                         </h2>

//                         {category.description && (
//                           <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
//                             {category.description}
//                           </p>
//                         )}

//                         {/* Product Count */}
//                         <div className="flex items-center justify-between pt-4 border-t">
//                           <div className="flex items-center gap-2 text-gray-600">
//                             <Package className="w-4 h-4" />
//                             <span className="text-sm">
//                               {category.productCount}{" "}
//                               {category.productCount === 1
//                                 ? "Product"
//                                 : "Products"}
//                             </span>
//                           </div>
//                           <ArrowRight className="w-5 h-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
//                         </div>
//                       </div>

//                       {/* Hover Effect Indicator */}
//                       <div className="h-1 bg-linear-to-r from-cyan-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Quick Links Section */}
//       <section className="py-12 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
//               Popular Searches
//             </h2>
//             <div className="flex flex-wrap justify-center gap-3">
//               {sortedCategories.slice(0, 8).map((category) => (
//                 <Link
//                   key={category._id}
//                   href={`/category/${category.slug.current}`}
//                   className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2"
//                 >
//                   {category.icon && <span>{category.icon}</span>}
//                   {category.title}
//                   <span className="bg-cyan-200 text-cyan-800 px-2 py-0.5 rounded-full text-xs">
//                     {category.productCount}
//                   </span>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-linear-to-r from-cyan-100 to-blue-100">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Can&apos;t Find What You&apos;re Looking For?
//             </h2>
//             <p className="text-lg text-gray-700 mb-8">
//               Check out our blog for detailed buying guides, product
//               comparisons, and parenting tips.
//             </p>
//             <div className="flex flex-wrap justify-center gap-4">
//               <Link
//                 href="/blog"
//                 className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
//               >
//                 Read Our Blog
//                 <ArrowRight className="w-5 h-5" />
//               </Link>
//               <Link
//                 href="/products"
//                 className="bg-white hover:bg-gray-50 text-cyan-600 border-2 border-cyan-600 px-8 py-3 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl"
//               >
//                 Browse All Products
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Affiliate Disclaimer */}
//       <section className="bg-cyan-50 py-8">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <p className="text-sm text-gray-600">
//               <strong>Affiliate Disclosure:</strong> As an Amazon Associate, we
//               earn from qualifying purchases. This means when you click on
//               product links and make a purchase, we may earn a commission at no
//               additional cost to you.{" "}
//               <Link
//                 href="/disclaimer"
//                 className="text-cyan-600 hover:text-cyan-700 underline"
//               >
//                 Learn more
//               </Link>
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* CSS Animation */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
