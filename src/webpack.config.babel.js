// webpack.config.js - created by Jared Van Valkengoed
import fs from 'fs';
import path from 'path';

import packageCONFIG from './license.config.js';

import TerserPlugin from 'terser-webpack-plugin';
 
class AddLicenseAfterTerserPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap('AddLicenseAfterTerserPlugin', compilation => {
            const outputPath = this.options.outputPath || compiler.options.output.path;
            const outputFileName = this.options.outputFileName || compiler.options.output.filename;

            // Construct the full path to the output file
            const outputFilePath = path.join(outputPath, outputFileName);

            // Read the existing file content
            fs.readFile(outputFilePath, 'utf8', (err, data) => {
                if (err) throw err;

                // Add your license text after minification (Terser)
                const licenseText = `${packageCONFIG.LICENSE} `;

                // Append license text to the existing file content
                const newContent = licenseText + data;

                // Write back the modified content to the output file
                fs.writeFile(outputFilePath, newContent, 'utf8', err => {
                    if (err) throw err;
                    console.log(`License added to ${outputFileName}`);
                });
            });
        });
    }
}

// taken from https://github.com/webpack/webpack/issues/12506#issuecomment-1360810560
class RemoveLicenseFilePlugin {
    apply(compiler) {
        compiler.hooks.emit.tap("RemoveLicenseFilePlugin", (compilation) => {
            // compliation has assets to output
            // console.log(compilation.assets);
            for (let name in compilation.assets) {
                if (name.endsWith("LICENSE.txt")) {
                    delete compilation.assets[name];
                }
            }
        });
    }
}


const commonConfig = {
  entry: `./src/${packageCONFIG.FILENAME}.js`, // Common entry point for all outputs
  module: {
    rules: [
      {
        test: /\.js$/, // Apply Babel to JS files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets:  [
      '@babel/preset-env',
      {
        // Use polyfills only if optInPolyfills is set to true
        ...(packageCONFIG.optInPolyfills && {
          targets: packageCONFIG.targets, // e.g. "> 0.25%, not dead"
          useBuiltIns: packageCONFIG.useBuiltIns || 'usage', // Default to 'usage' if not specified
          corejs: packageCONFIG.corejs || 3, // Default to CoreJS 3 if not specified
        }),
      },
    ], // Transpile modern JS to compatible JS
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false, // Don't extract comments to a separate file
      }),
    ],
  },
  plugins: [
    new RemoveLicenseFilePlugin(), // Make sure this plugin is installed
    new AddLicenseAfterTerserPlugin({ // Add the license after minification
      // Additional options can be passed here if needed
    }),
  ],
  resolve: {
    extensions: ['.js'], // Resolve .js files
  },
};

module.exports = [
  // UMD Bundle (.min.js) - Only add if packageCONFIG.umdOutput is true
  ...(packageCONFIG.umdOutput ? [{
    ...commonConfig, // Include common configuration
    output: {
      path: path.resolve(__dirname, '..', 'dist'),
      filename: `${packageCONFIG.FILENAME}.umd.min.js`,
      libraryTarget: 'umd', // Universal Module Definition
      library: packageCONFIG.globalVariable, // The name of the global variable
      ...(packageCONFIG.exportDefault ? { libraryExport: 'default' } : {}),
      globalObject: 'this', // Ensures compatibility in both Node and Browser environments
    },
  }] : []), // If packageCONFIG.umdOutput is false, this will result in an empty array, effectively excluding the UMD build

  // ES Module Bundle (.min.mjs) - Only add if packageCONFIG.mjsOutput is true
 /* 
...(packageCONFIG.mjsOutput ? [{
  ...commonConfig, // Include common configuration
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: `${packageCONFIG.FILENAME}.min.mjs`, // Output filename
    library: {
      type: 'module', // Outputs as an ES Module (important for .mjs files)
    },
    globalObject: 'this', // Ensures compatibility in both Node and Browser environments
  },
  experiments: {
    outputModule: true, // Enable ES module output (important for .mjs)
  },
}] : []),  // If packageCONFIG.mjsOutput is false, this will result in an empty array, effectively excluding the MJS build

  
  */ 

  // ES Module Bundle (.min.js) - Only add if packageCONFIG.esmOutput is true
  ...(packageCONFIG.esmOutput ? [{
    ...commonConfig, // Include common configuration
    output: {
      path: path.resolve(__dirname, '..', 'dist'),
      filename: `${packageCONFIG.FILENAME}.min.js`,
      library: {
        type: 'module', // Outputs as an ES Module
      },
      globalObject: 'this', // Ensures compatibility in both Node and Browser environments
    },
    experiments: {
      outputModule: true, // Enable ES module output (important for .mjs)
    },
  }] : []), // If packageCONFIG.esmOutput is false, this will result in an empty array, effectively excluding the ESM build

  // CommonJS Bundle (.cjs) - Only add if packageCONFIG.cjsOutput is true
  ...(packageCONFIG.cjsOutput ? [{
    ...commonConfig, // Include common configuration
    output: {
      path: path.resolve(__dirname, '..', 'dist'),
      filename: `${packageCONFIG.FILENAME}.min.cjs`,
      library: {
        type: 'commonjs2', // Outputs as a CommonJS module
      },
    },
  }] : []), // If packageCONFIG.cjsOutput is false, this will result in an empty array, effectively excluding the CommonJS build
];
