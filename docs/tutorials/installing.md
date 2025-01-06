# Installing and building locally

To install and build `skraafoto_frontend` locally, run these commands:

1. `git clone https://github.com/SDFIdk/skraafoto_frontend`
2. `cd skraafoto_frontend`
3. `npm install`

## Configuration (config.js)
Skraafoto expects to find a `config.js` file in the root folder when hosted.

When running a development server, `config.js` should reside in the `public/` folder.

The contents of `config.js` should be a single Javascript object defined like so:
```
const environment = {
  
  // STAC TOKEN can be aquired from https://dataforsyningen.dk/
  API_STAC_TOKEN: "[ INSERT TOKEN ]",
  API_STAC_BASEURL: "https://api.dataforsyningen.dk/rest/skraafoto_api/v1.0",

  // DHM URL and auth can be aquired from https://datafordeler.dk/dataoversigt/danmarks-hoejdemodel-dhm/koter/
  API_DHM_WCS_BASEURL: "https://services.datafordeler.dk/DHMNedboer/dhm_wcs/1.0.0/WCS",
  API_DHM_BASEURL: "https://services.datafordeler.dk/DHMTerraen/DHMKoter/1.0.0/GEOREST/HentKoter",
  API_DHM_TOKENA: "[ INSERT USERNAME-LIKE TOKEN ]",
  API_DHM_TOKENB: "[ INSERT PASSWORD-LIKE TOKEN ]"

}
```
You'll need to supply your own tokens for your particular configuration.
You can copy and edit `public/config.js.example` to use as your own `config.js`.

## Build the documentation
First, run `npm run docs` to build the documentation pages.
Then you can run `npm run serve-docs` and access the documentation in a browser at `localhost:8001`

## Build for development
Run `npm run dev` to start a development server running locally at `localhost:8000`

## Build for production
Run `npm run build` to make a production build. The built resources are saved in `dist/` folder; ready to be hosted along with the static assets in the `public` folder.

## Run tests 

### Playwright E2E tests
You'll need to install Playwright dependencies **once** before running the E2E tests. 
Do so with `npx playwright install --with-deps`

Then make sure you have a local development server running. 
Run `npm run dev`, open a browser, and point it to `localhost:8000`

Now you can run the test using:
`npm run test` or `npm run test -- --ui` (the latter opens the Playwright test UI)

The Playwright test suite will present you with a HTML report if some tests fail.

### Unit tests
Unit tests are run with `npm run test-unit`

## Updating local terrain model

Skråfoto uses a terrain elevation model hosted as a single GeoTiff file for events where Datafordeler service is unavailable. To update the terrain model, simply download a new GeoTiff from Datafordeler with the following URL (supply your own username/password):

https://services.datafordeler.dk/DHMNedboer/dhm_wcs/1.0.0/WCS?SERVICE=WCS&COVERAGE=dhm_terraen&RESPONSE_CRS=epsg:25832&CRS=epsg:25832&FORMAT=GTiff&REQUEST=GetCoverage&VERSION=1.0.0&username=xxx&password=xxx&height=1000&width=1260&bbox=430000,6040000,900000,6413000
