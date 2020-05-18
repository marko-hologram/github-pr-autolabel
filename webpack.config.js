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
    index: path.resolve(__dirname, "./src/index.ts"),
    options: path.resolve(__dirname, "./src/options.ts"),
    contentScript: path.resolve(__dirname, "./src/contentScript.ts"),
  },
  mode: isProduction ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
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
        { from: absPath("./src/frontend-ui"), to: DIST_PATH },
        { from: absPath("./src/background-ui"), to: DIST_PATH },
        { from: absPath("./src/assets/icon"), to: DIST_PATH + "/assets/icon" },
      ],
    }),
  ],
};
