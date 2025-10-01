import fs from "fs"
import path from "path";

const packagePath = path.join(process.cwd(), 'node_modules', 'react-use-face-detection', 'package.json');
try {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('Package entry points:', {
    main: pkg.main,
    module: pkg.module,
    exports: pkg.exports,
    browser: pkg.browser
  });
} catch (error) {
  console.error('Error reading package.json:', error);
}