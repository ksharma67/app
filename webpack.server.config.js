const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production', // Set to 'production' for production build
  target: 'node', // Specify the target environment (Node.js)
  entry: './server.js', // Entry point for your server code
  output: {
    filename: 'server.bundle.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply the loader to JavaScript files
        exclude: /node_modules/, // Exclude the node_modules directory
        use: {
          loader: 'babel-loader', // You can use Babel for transpilation if needed
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // Add any other extensions you may use (e.g., .jsx)
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /express[\\/]lib/,
      path.resolve(__dirname, 'node_modules'),
      {
        // context settings if needed
      }
    ),
    new webpack.ContextReplacementPlugin(
      /sequelize[\\/]lib/,
      path.resolve(__dirname, 'node_modules'),
      {
        // context settings if needed
      }
    )
  ]
};
