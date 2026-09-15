import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode : false,
  images:{
    remotePatterns : [ 
      {
        protocol: "https",
        hostname: "img.icons8.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol : 'https',
        hostname : 'i.pravatar.cc',
        port : '',
        pathname : '/**'
      },
      {
        protocol : 'https',
        hostname : 'picsum.photos',
        port : '',
        pathname : '/**'
      },
      {
        protocol : 'https',
        hostname : 'images.unsplash.com',
        port : '',
        pathname : '/**'
      },
      {
        protocol : 'https',
        hostname : "placehold.co",
        port : '',
        pathname : '/**'
      },
      {
        protocol : 'http',
        hostname : "res.cloudinary.com",
        port : '',
        pathname : '/**'
      },
    ],
    dangerouslyAllowSVG : true
  }
};

export default nextConfig;
