import Link from 'next/link';

const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-mono text-sm text-zinc-100 hover:text-white">
          brendanwenzel<span className="text-zinc-500">.com</span>
        </Link>
        <nav className="flex items-center gap-6">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
