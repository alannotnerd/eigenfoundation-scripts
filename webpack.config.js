const path = require('path')

module.exports = {
  mode: "production",
  entry: {
    main: "./src/eligibility-response.ts",
    verifier: "./src/verify-message.ts"
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: "[name]-bundle.js" // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
}
