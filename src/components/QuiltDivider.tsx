/**
 * Decorative quilt-star band that recurs between page sections — the heritage-quilt
 * motif built from the carpenter's-wheel spark mark (`/images/brand/quilt-band.svg`,
 * tiled by the `.spark-quilt-divider` utility in globals.css).
 *
 * Purely decorative: rendered `aria-hidden` so assistive tech skips it. Pass extra
 * spacing/width via `className` (e.g. full-bleed breakouts on constrained layouts).
 */
export default function QuiltDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      role="presentation"
      className={`spark-quilt-divider ${className}`.trim()}
    />
  );
}
