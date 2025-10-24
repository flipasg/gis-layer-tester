# GIS Layer Tester

Angular 17 workspace that lets you rapidly preview GeoServer WMS layers in both OpenLayers (2D) and Cesium (3D) engines. It includes the supporting tooling (Angular Material, Cesium widgets, Turf helpers, etc.) that matches the dependency baseline requested.

## Getting started

1. Install dependencies  
   `npm install`
2. Launch the dev server  
   `npm start`
3. Open `http://localhost:4200/` and enter the URL of your GeoServer WMS endpoint plus the fully-qualified layer name (e.g. `workspace:layer`). Use the toolbar toggle to switch between OpenLayers and Cesium renderers.

> Cesium static assets are copied into `assets/cesium` during the build. Keep `window.CESIUM_BASE_URL` pointed at that folder if you move files around.

## Project structure

- `src/app/features/map-view/containers/map-viewer` – UI shell with WMS form, renderer toggle, and map host region.
- `src/app/features/map-view/components/openlayers-map` – Minimal OpenLayers viewer that keeps a base OSM layer and dynamically refreshes GeoServer tiles.
- `src/app/features/map-view/components/cesium-map` – Cesium viewer configured with an OpenStreetMap base layer, Cesium compass widget, and WMS overlay management.
- `src/app/core/models` – Shared types for map configuration.

## Testing & linting

- `npm test` runs Karma/Jasmine unit tests (currently only app bootstrap smoke tests are included).
- `npm run build` produces a production bundle with Cesium assets under `dist/gis-layer-tester/assets/cesium`.

Feel free to extend the form/store or plug in additional services (Turf, codemirror-based styling editors, etc.) as your layer-testing flows grow.
