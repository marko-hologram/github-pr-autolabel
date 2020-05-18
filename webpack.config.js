const path = require("path");
const argv = require("yargs").argv;
const isProduction = argv.production;

module.exports = {
  entry: "./src/index.ts",
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
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
