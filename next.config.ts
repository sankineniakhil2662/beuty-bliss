import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Firebase Storage-hosted uploads (service photos, review photos) — see
    // ServiceForm.jsx / TokenReview.jsx, which upload via getFirebaseStorage().
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

export default nextConfig;
