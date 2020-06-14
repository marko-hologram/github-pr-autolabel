const path = require("path");
const argv = require("yargs").argv;
const isProduction = argv.production;

const CopyPlugin = require("copy-webpack-plugin");
const absPath = (pathString = "") => {
  return path.resolve(__dirname, pathString);
};

const DIST_PATH = absPath("dist/");

module.exports = {
  entry: {
    background: path.resolve(__dirname, "./src/background.ts"),
    popup: path.resolve(__dirname, "./src/popup.tsx"),
    options: path.resolve(__dirname, "./src/options.tsx"),
    contentScript: path.resolve(__dirname, "./src/contentScript.ts"),
  },
  mode: isProduction ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "~": absPath(),
    },
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
        { from: absPath("./src/html"), to: DIST_PATH },
        { from: absPath("./src/assets/icon"), to: DIST_PATH + "/assets/icon" },
      ],
    }),
  ],
};
