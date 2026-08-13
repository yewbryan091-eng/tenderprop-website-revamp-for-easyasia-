# West Malaysia geometry source

The homepage map is generated from **Natural Earth 1:10m Admin 0 Countries** and **Admin 1 States/Provinces**, published public-domain vector datasets.

- Coastline dataset: `ne_10m_admin_0_countries.geojson`
- State-boundary dataset: `ne_10m_admin_1_states_provinces_lines.geojson`
- Feature: `ISO_A3 = MYS`
- Pinned source revision: `ca96624a56bd078437bca8184e78163e5039ad19`
- Source URL: `https://github.com/nvkelso/natural-earth-vector/blob/ca96624a56bd078437bca8184e78163e5039ad19/geojson/ne_10m_admin_0_countries.geojson`
- Natural Earth download page: `https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-countries/`
- Natural Earth Admin 1 page: `https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/`

`npm run generate:west-malaysia` selects every complete Malaysia polygon component whose easternmost longitude is west of `105.5E`. This keeps the peninsula, Penang, Langkawi and the other published western islands while excluding East Malaysia without clipping or redrawing any coastline coordinate.

The same longitude rule selects 24 complete Admin 1 boundary-line components for faint, published state-line detail. The generator applies a local equirectangular projection with a mid-latitude cosine correction, inverts latitude for SVG coordinates, and rounds display coordinates to two decimals. It does not simplify, smooth or hand-draw the geometry. The script produces both the website path data and the clean design SVG from one source so they cannot drift.
