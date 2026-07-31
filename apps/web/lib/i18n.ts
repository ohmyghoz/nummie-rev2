/**
 * Interpolasi `{key}` di string kamus. `copy/` sengaja tidak punya helper sendiri
 * (murni data) — ini satu-satunya tempat pola `{amount}`/`{child}`/dst. diselesaikan.
 */
export function tr(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  );
}
