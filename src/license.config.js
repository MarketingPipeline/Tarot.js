/* Stuff for webpack config / build process 
Note / step for cutting release -
update package.json FIRST with version - to keep updated version in license.
THEN create build.

This config was created by Jared Van Valkengoed
*/ 

// Import package data with type assertion for JSON import
import packageData from '../package.json' with { type: 'json' };

// Destructure relevant fields from packageData
const { description, version, license } = packageData;

// Constants for the library
const REPONAME = 'Tarot.js';
const FILENAME = 'tarot'; // Used for output file name
const globalVariable = 'Tarot'; // The variable that will be exposed globally (for UMD)
const exportDefault = true; // Whether to export default for UMD (if false will return example: yourmodule.default())

// License string template for the output
const LICENSE = `/**!
 * @license ${REPONAME} - ${description || 'No description available'}
 * VERSION: ${version || 'N/A'}
 * LICENSED UNDER ${license ? `${license} LICENSE` : 'No license information'}
 * MORE INFO CAN BE FOUND AT https://github.com/MarketingPipeline/${REPONAME}/
 */`;

// Package configuration object
const packageCONFIG = {
  LICENSE,
  FILENAME,
  exportDefault,
  globalVariable,
  optInPolyfills: false, // By default, no polyfills (modern browsers only) - if yes, will target older browsers etc...
  targets: "> 0.25%, not dead", // Default browser targets, can be overridden
  useBuiltIns: 'usage', // Polyfill usage based on features used
  corejs: 3, // CoreJS version to use for polyfills
  // Output flags
  umdOutput: true,   // Flag to include UMD output (.umd.min.js)
  esmOutput: true,   // Flag to include ESM output (.min.js)
  cjsOutput: true,   // Flag to include CommonJS output (.min.cjs)
  mjsOutput: false,   // Flag to include ES Module output (.mjs)
};

export default packageCONFIG;
