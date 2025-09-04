/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', 'three-mesh-bvh', '@react-three/drei', '@react-three/fiber'],
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;




