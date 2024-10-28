import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import nodeExternals from 'webpack-node-externals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  mode: 'production',
  entry: './index.ts',
  target: 'node',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
