# AI Coding Guidelines for MishBabyGuide

## Architecture Overview

This is a Next.js 16 app with Sanity CMS v4 backend. The site serves as a baby product guide with two content types:

- **Product Reviews** (`productReview`): Full reviews with pros/cons, detailed content, and image galleries
- **Product Recommendations** (`productRecommendation`): Quick recommendations with basic info

## Key Data Patterns

- All products have Amazon affiliate links, categories, and SEO metadata
- Content uses GROQ queries from `lib/sanity.queries.ts` - follow existing patterns for data fetching
- Images stored in Sanity with Next.js Image optimization (remotePatterns configured for cdn.sanity.io)

## Component Conventions

- Use TypeScript interfaces from `lib/sanity.client.ts` for type safety
- Product cards route to `/products/{slug}` for recommendations, `/reviews/{slug}` for full reviews
- Featured products (`featured: true`) appear on homepage
- UI built with Tailwind CSS v4 + shadcn/ui components

## Sanity CMS Integration

- Studio available at `/studio` with custom structure
- Schemas in `sanity/schemaTypes/` use `defineType`/`defineField` with validation
- Content types: `post`, `productReview`, `productRecommendation`, `blogCategory`, `productCategory`
- All documents have slugs, SEO fields, and publication dates

## Development Workflow

- `npm run dev` - Start Next.js dev server
- `npm run build` - Production build
- Sanity client configured in `lib/sanity.client.ts` with API version 2024-01-01
- Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`

## URL Structure

- `/products` - Quick recommendations (productRecommendation type)
- `/reviews` - Full product reviews (productReview type)
- `/blog` - Blog posts
- `/categories/{slug}` - Category-filtered content

## Code Style Notes

- ESLint config in `eslint.config.mjs`
- Tailwind v4 with CSS variables for theming
- Lucide React icons throughout
- Responsive design with mobile-first approach
