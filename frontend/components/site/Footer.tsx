import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Brendan Wenzel · Newport Beach, CA</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/services" className="hover:text-zinc-300">Services</Link>
          <Link href="/portfolio" className="hover:text-zinc-300">Portfolio</Link>
          <a
            href="https://www.linkedin.com/in/brendanwenzel/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300"
          >
            LinkedIn
          </a>
          <Link href="/privacy-policy" className="hover:text-zinc-300">Privacy</Link>
          <Link href="/terms-of-service" className="hover:text-zinc-300">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
