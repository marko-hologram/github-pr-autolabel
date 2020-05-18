const path = require("path");
const argv = require("yargs").argv;
const isProduction = argv.production;

const CopyPlugin = require("copy-webpack-plugin");
const absPath = (pathString) => {
  return path.resolve(__dirname, pathString);
};

const DIST_PATH = absPath("dist/");

module.exports = {
  entry: {
    background: path.resolve(__dirname, "./src/background.ts"),
    index: path.resolve(__dirname, "./src/index.ts"),
  },
  mode: isProduction ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  devtool: !isProduction ? "inline-source-map" : false,
  watch: !isProduction,
  output: {
    filename: "[name].js",
    path: DIST_PATH,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: absPath("./src/manifest.json"), to: DIST_PATH },
        { from: absPath("./src/frontend-ui"), to: DIST_PATH },
      ],
    }),
  ],
};
