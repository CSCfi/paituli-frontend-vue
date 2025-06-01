const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    home: './src/home/home.js',
    download: './src/download/download.js',
    metadata: './src/metadata/metadata.js',
    header: './src/shared/header.js',
    contact: './src/contact/contact.js',
    files: './src/files/files.js',
    stac: './src/stac/stac.js',	
    help: './src/help/help.js',
    webservices: './src/webservices/webservices.js',
    opendata: './src/opendata/opendata.js',
    footer: './src/shared/footer.js',
    accessibility: './src/accessibility/accessibility.js',
    privacy: './src/privacy/privacy.js',    
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 
		  {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
		],
      },

      {
        test: /\.(gif|png|jpe?g)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },

      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin(
	  { 
        patterns:
			[  
			  {
				from: 'html/skeleton/*.html',
				to: "[name][ext]",
			  },
			  {
				from: 'html/content/*.html',
				to: "[name][ext]",
			  },
			  {
				from: 'img',
			  },
	  ]}),
  ],
}
