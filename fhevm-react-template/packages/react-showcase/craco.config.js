const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add fallbacks for Node.js modules that shouldn't be bundled
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "util": false,
        "path": false,
        "fs": false,
        "buffer": false,
        "crypto": false,
        "stream": false,
        "os": false,
        "net": false,
        "tls": false,
        "child_process": false,
        "worker_threads": false,
        "perf_hooks": false,
        "async_hooks": false,
        "cluster": false,
        "dgram": false,
        "dns": false,
        "http": false,
        "https": false,
        "http2": false,
        "querystring": false,
        "url": false,
        "zlib": false,
        "readline": false,
        "repl": false,
        "vm": false,
        "v8": false,
        "inspector": false,
        "trace_events": false,
        "assert": false,
        "events": false,
        "punycode": false,
        "string_decoder": false,
        "timers": false,
        "tty": false,
        "constants": false,
        "domain": false,
        "process": false,
        "module": false,
        "require": false,
        "global": false,
        "Buffer": false,
        "__dirname": false,
        "__filename": false,
        "console": false,
        "setImmediate": false,
        "clearImmediate": false,
        "setTimeout": false,
        "clearTimeout": false,
        "setInterval": false,
        "clearInterval": false
      };

      // Ignore Vue imports in React showcase (Vue adapters are not used)
      const path = require('path');
      
      // Configure resolve FIRST to ensure alias is applied before plugins process modules
      webpackConfig.resolve = webpackConfig.resolve || {};
      
      // Alias vue to empty module to prevent resolution errors from @fhevm-sdk
      // Also alias the Vue adapter directly to prevent it from being bundled
      // This MUST be set before webpack processes any modules
      const vueAdapterStub = path.resolve(__dirname, 'src/vue-adapter-stub.js');
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'vue': path.resolve(__dirname, 'src/vue-empty.js'),
        // Directly alias Vue adapter paths to stub (all possible formats)
        '@fhevm-sdk/dist/adapters/vue.js': vueAdapterStub,
        '@fhevm-sdk/src/adapters/vue.js': vueAdapterStub,
        '../fhevm-sdk/dist/adapters/vue.js': vueAdapterStub,
        '../../fhevm-sdk/dist/adapters/vue.js': vueAdapterStub,
        './adapters/vue.js': vueAdapterStub, // Relative from index.js
      };
      
      // Ensure proper module resolution order to prevent multiple React instances
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, 'node_modules'), // Prioritize app's node_modules
        ...(webpackConfig.resolve.modules || ['node_modules']),
        'node_modules'
      ];
      
      // Replace Vue adapter module entirely to prevent bundling Vue code
      // This must match all possible path formats:
      // - @fhevm-sdk/dist/adapters/vue.js
      // - fhevm-sdk/dist/adapters/vue.js
      // - ../fhevm-sdk/dist/adapters/vue.js
      // - packages/fhevm-sdk/dist/adapters/vue.js
      // - ./adapters/vue.js (relative from index.js)
      webpackConfig.plugins = webpackConfig.plugins || [];
      
      // Add replacement plugin to catch Vue adapter imports
      const vueAdapterStubPath = path.resolve(__dirname, 'src/vue-adapter-stub.js');
      webpackConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /.*[\/\\]fhevm-sdk[\/\\].*[\/\\]adapters[\/\\]vue\.js$/,
          vueAdapterStubPath
        )
      );
      
      // Also catch relative paths from within fhevm-sdk
      webpackConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /\.\/adapters\/vue\.js$/,
          (resource) => {
            // Only replace if the context is from fhevm-sdk
            if (resource.context && resource.context.includes('fhevm-sdk')) {
              resource.request = vueAdapterStubPath;
            }
          }
        )
      );
      
      // Ignore vue imports from @fhevm-sdk (additional safeguard)
      webpackConfig.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^vue$/,
          // Match any context that contains fhevm-sdk
          contextRegExp: /fhevm-sdk/
        })
      );

      // Only externalize Node.js specific modules, not browser-compatible ones
      webpackConfig.externals = webpackConfig.externals || [];
      webpackConfig.externals.push({
        '@zama-fhe/relayer-sdk/node': 'commonjs @zama-fhe/relayer-sdk/node'
        // Note: ethers is browser-compatible, so we bundle it instead of externalizing
      });

      // Ensure symlinks are resolved to prevent duplicate React instances
      webpackConfig.resolve.symlinks = true;

      return webpackConfig;
    },
  },
};
