# Source assets

Originals that generated composites in `public/projects/`, kept out of `public/`
so they are versioned but not deployed — nothing on the site links to them and
they were 3.3MB of dead weight in the bundle.

- `carder-source/` — the eight showcase captures from carder.app, composed into
  `carder-hero.png`, `carder-media.png` and `carder-tiers.png`.

Regenerate the composites by pointing the compose script at this directory.
