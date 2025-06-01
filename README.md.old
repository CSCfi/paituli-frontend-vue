# AVAA Paituli Frontend

This is the repository for the frontend of AVAA project's Paituli service. It is a node project that builds static resources that can be served via any webserver. Main libraries used in the website are jQuery, Bootstrap and Openlayers.

# Install dependencies

Dependencies and development dependencies can be found from **package.json**. Run the following to download and install them

`npm install`

# Run development server

To start the development server run

`npm start`

which starts a development server in **localhost:9000**. It also creates a proxy making it possible to run the backend development server at the same time. Backend dataset query is proxied to localhost:9000/api/datasets/<locale>

These development environment specific configurations can be found from **webpack.dev.js** and **.env.development**

# Building the App

To create the test or production build, run

`npm run build-test`
or
`npm run build`

The built files can then be found in the newly created /dist directory

Configuration for the environments can be found from **.env.test**/**.env.production** and **webpack.test.js**/**webpack.prod.js**
