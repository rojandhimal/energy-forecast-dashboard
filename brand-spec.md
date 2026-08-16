# GridSense AI Brand Spec

```css
:root {
  --bg: oklch(98% 0.005 250);
  --surface: oklch(100% 0 0);
  --fg: oklch(22% 0.02 240);
  --muted: oklch(50% 0.018 240);
  --border: oklch(90% 0.008 240);
  --accent: oklch(58% 0.16 145);

  --font-display: "IBM Plex Sans", "Aptos Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-body: "Inter", "Aptos", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "IBM Plex Mono", ui-monospace, Menlo, monospace;
}
```

GridSense AI uses a restrained tech-utility system: light operational surfaces, compact navigation, green as an energy/status accent, mono numerals for forecast values, and dense dashboard panels built for grid-operator scanning.

Observed visual rules:

- Use green sparingly for active model state, forecast line, and primary execution controls.
- Keep the background cool and nearly white, with white panels and fine borders for a utility-console feel.
- Treat data values as the visual anchor: mono numerals, short labels, clear units.
- Prefer filled charts and status matrices over decorative illustration.
- Keep rounded corners modest at 6-8px and avoid marketing-style hero composition.
