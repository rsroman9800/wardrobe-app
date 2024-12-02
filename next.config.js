/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Add the undici loader
      config.module.rules.push({
        test: /node_modules\/undici\/lib\/web\/fetch\/util\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: '#target',
          replace: 'Symbol.iterator',
          flags: 'g'
        }
      });
  
      return config;
    }
  }
  
  module.exports = nextConfig