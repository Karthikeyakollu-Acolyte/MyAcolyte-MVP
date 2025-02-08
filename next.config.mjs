import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

export default withPWA({
  // Your Next.js config
  images: {
    domains: ['images.unsplash.com',"via.placeholder.com","unsplash.com","placehold.co"],
  },eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Skips TypeScript errors during builds
  },
  
});