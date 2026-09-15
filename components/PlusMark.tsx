/** Drawn rather than set in a font, so it keeps the double-stroke the rest of
 *  the page uses: a committed line with the searching one showing under it.
 *  Rotates 45° to an × when its row is open. Shared by the Work timeline and
 *  the project cards. */
export default function PlusMark({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`plus-mark ${open ? "is-open" : ""}`}
      aria-hidden
    >
      <g className="plus-ghost">
        <path d="M3.5 10.4C7.1 9.9 13.1 10.1 16.7 10.2" />
        <path d="M10.3 3.5C9.9 7.1 10 13.1 10.2 16.7" />
      </g>
      <g className="plus-ink">
        <path d="M3 10C6.6 9.5 12.6 9.7 16.2 9.8" />
        <path d="M9.9 3.1C9.5 6.7 9.6 12.7 9.8 16.3" />
      </g>
    </svg>
  );
}
