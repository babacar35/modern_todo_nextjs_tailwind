/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  // Add script to run seed during development
  webpack: (config, { isServer }) => {
    if (isServer && process.env.NODE_ENV === "development") {
      // This will run once during server startup in development
      console.log("Seeding database...");
      // Note: In a real environment, you would use the Supabase CLI
      // This is just a placeholder for the Tempo environment
    }
    return config;
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  nextConfig["experimental"] = {
    // NextJS 13.4.8 up to 14.1.3:
    // swcPlugins: [[require.resolve("tempo-devtools/swc/0.86"), {}]],
    // NextJS 14.1.3 to 14.2.11:
    swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],

    // NextJS 15+ (Not yet supported, coming soon)
  };
}

module.exports = nextConfig;
