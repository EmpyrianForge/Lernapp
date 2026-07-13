import type { ReactNode } from 'react'

// Eigenes, monochromes Line-Icon-Set (currentColor, dünne Striche) im Linear-Stil.
// Ersetzt die Emoji-Icons in Kacheln, Header und Chrome.

const P: Record<string, ReactNode> = {
  // Lernmodi
  cards: <><rect x="3" y="7" width="13" height="13" rx="2" /><path d="M8 4h10a2 2 0 0 1 2 2v10" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.3 9.2a2.7 2.7 0 0 1 4-.4c1.2 1.2.6 2.5-.6 3.2-.8.5-1.2 1-1.2 1.8" /><circle cx="11.5" cy="16.6" r="0.6" fill="currentColor" stroke="none" /></>,
  activity: <path d="M3 12h4l2.5-6 4 12 2.5-6H21" />,
  calculator: <><rect x="5" y="3" width="14" height="18" rx="2" /><rect x="8" y="6" width="8" height="3" rx="0.5" /><path d="M8.5 13h0M12 13h0M15.5 13h0M8.5 17h0M12 17h0M15.5 17h0" /></>,
  braces: <><path d="M8 4c-1.6 0-2 1-2 2.5S6 9 4.5 9C6 9 6 10.5 6 12s.4 5 2 5" /><path d="M16 4c1.6 0 2 1 2 2.5S18 9 19.5 9C18 9 18 10.5 18 12s-.4 5-2 5" /></>,
  'file-text': <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 16.5h4" /></>,
  clipboard: <><rect x="5" y="5" width="14" height="16" rx="2" /><path d="M9 5V3.6A1.6 1.6 0 0 1 10.6 2h2.8A1.6 1.6 0 0 1 15 3.6V5" /><path d="M8.5 11h7M8.5 14.5h5" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.7" fill="currentColor" stroke="none" /></>,
  'bar-chart': <><path d="M4 20h16" /><rect x="6" y="11" width="3" height="7" rx="0.5" /><rect x="11" y="7" width="3" height="11" rx="0.5" /><rect x="16" y="14" width="3" height="4" rx="0.5" /></>,
  // Interaktive Übungen
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  network: <><rect x="9" y="2.5" width="6" height="5" rx="1" /><rect x="2.5" y="16.5" width="6" height="5" rx="1" /><rect x="15.5" y="16.5" width="6" height="5" rx="1" /><path d="M12 7.5v4M12 11.5H5.5v5M12 11.5h6.5v5" /></>,
  hash: <><path d="M4 9h16M4 15h16M10 3.5 8 20.5M16 3.5l-2 17" /></>,
  scale: <><path d="M12 3v18M6 21h12M5 7h14M12 4l-1 1" /><path d="M5 7 2.5 12.5a3 3 0 0 0 5 0zM19 7l-2.5 5.5a3 3 0 0 0 5 0z" /></>,
  'git-graph': <><circle cx="6" cy="6" r="2.2" /><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="12" r="2.2" /><path d="M8.2 6h3.8a3 3 0 0 1 3 3v.8M8.2 18h3.8a3 3 0 0 0 3-3v-.8" /></>,
  link: <><path d="M9 12h6" /><path d="M8.5 8H7a4 4 0 0 0 0 8h1.5" /><path d="M15.5 8H17a4 4 0 0 1 0 8h-1.5" /></>,
  shapes: <><circle cx="7" cy="8" r="3.2" /><rect x="13" y="4.8" width="6.4" height="6.4" rx="1" /><path d="M11 14.5 14.2 20H7.8z" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 5.5h1.4v3M4 17.2h1.6M4 15.6h1.4l-1.4 3h1.6" /></>,
  // Werkzeuge
  search: <><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 21 21" /></>,
  'card-plus': <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M12 9v6M9 12h6" /></>,
  gear: <><circle cx="12" cy="12" r="3.1" /><path d="M19.4 12.9a1.6 1.6 0 0 1 0-1.8l1.1-1.6-2-3.4-1.9.6a1.6 1.6 0 0 1-1.6-.9L14 2h-4l-1 1.8a1.6 1.6 0 0 1-1.6.9l-1.9-.6-2 3.4 1.1 1.6a1.6 1.6 0 0 1 0 1.8L3.5 14.5l2 3.4 1.9-.6a1.6 1.6 0 0 1 1.6.9L10 22h4l1-1.8a1.6 1.6 0 0 1 1.6-.9l1.9.6 2-3.4z" /></>,
  // Chrome
  brand: <><path d="M3 9l9-4 9 4-9 4z" /><path d="M7 11v4c0 1.6 2.4 3 5 3s5-1.4 5-3v-4" /></>,
  flame: <path d="M12 3c.6 2.8 3.8 3.8 3.8 7.6a3.8 3.8 0 0 1-7.6 0c0-1.3.4-2.2 1-2.9.3 1.1 1.1 1.5 1.6 1.5C10.3 8 10.8 5.4 12 3z" />,
  save: <><path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" /><path d="M8 4v5h7V4" /><rect x="8" y="13" width="7" height="6" rx="0.5" /></>,
  download: <><path d="M12 3v12" /><path d="M7 11l5 4 5-4" /><path d="M5 20h14" /></>,
  upload: <><path d="M12 21V9" /><path d="M7 13l5-4 5 4" /><path d="M5 4h14" /></>,
  play: <path d="M8 5l11 7-11 7z" fill="currentColor" stroke="none" />,
  bookmark: <path d="M6 4h12v16l-6-4-6 4z" />,
  'bookmark-fill': <path d="M6 4h12v16l-6-4-6 4z" fill="currentColor" />,
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  alert: <><path d="M12 3.5l9 15.5H3z" /><path d="M12 10v4" /><circle cx="12" cy="16.6" r="0.6" fill="currentColor" stroke="none" /></>,
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
  wrench: <path d="M14.5 6.5a3.8 3.8 0 0 0-5 4.9L4 16.9 7.1 20l5.5-5.5a3.8 3.8 0 0 0 4.9-5l-2.4 2.4-2.5-.5-.5-2.5z" />,
  timer: <><circle cx="12" cy="13.5" r="7.5" /><path d="M12 13.5V9.5" /><path d="M9.5 2.5h5" /></>,
}

export function Icon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {P[name] ?? P.help}
    </svg>
  )
}
