// Helper function to exclude node_modules except specified packages
function excludeNodeModulesExcept(modules) {
  const moduleRegExps = modules.map((modName) => new RegExp(`node_modules[/\\\\]${modName}`));
  
  return function (modulePath) {
    if (/node_modules/.test(modulePath)) {
      return !moduleRegExps.some((regex) => regex.test(modulePath));
    }
    return false;
  };
}

// List of packages to transpile (e.g., for monorepo or symlinked dependencies)
const transpilePackages = [
  '@cornerstonejs/adapters',
  '@cornerstonejs/ai',
  '@cornerstonejs/core',
  '@cornerstonejs/dicom-image-loader',
  '@cornerstonejs/docs',
  '@cornerstonejs/labelmap-interpolation',
  '@cornerstonejs/nifti-volume-loader',
  '@cornerstonejs/polymorphic-segmentation',
  '@cornerstonejs/tools',
  '@cornerstonejs/codec-charls', // Added to ensure WASM-related code is transpiled
];

// Create exclude function for Webpack rules
const exclude = excludeNodeModulesExcept(transpilePackages);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Internationalization settings
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
  },
  
  // Enable React strict mode for better error detection
  reactStrictMode: false,
  
  // Transpile specified packages (e.g., for ESM or monorepo compatibility)
  transpilePackages,
  
  // Experimental features
  experimental: {
    esmExternals: 'loose', // Loose ESM handling for external dependencies
  },
  
  // Custom headers for DICOM file routes
  async headers() {
    return [
      {
        source: '/dicom/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/dicom' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Allow cross-origin for DICOM files
        ],
      },
    ];
  },
  
  // Custom Webpack configuration
  webpack: (config, { isServer }) => {
    // Enable WebAssembly support for packages like cornerstone
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    
    // Rule for handling WebAssembly files as modules
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });
    
    // Rule for copying WASM files to output directory as assets
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/wasm/[name][ext]', // Output WASM files to /static/wasm/
      },
    });
    
    // Transpile JS/TS files for specified node_modules (may be redundant with transpilePackages)
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: exclude, // Exclude node_modules except for transpilePackages
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel', '@babel/preset-env'], // Added @babel/preset-env for compatibility
        },
      },
    });
    
    // Resolve WASM imports correctly
    config.resolve.extensions = [...(config.resolve.extensions || []), '.wasm'];
    
    // Client-side Node.js module fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false, // Temporarily disabled; reintroduce if needed
        child_process: false,
        os: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
