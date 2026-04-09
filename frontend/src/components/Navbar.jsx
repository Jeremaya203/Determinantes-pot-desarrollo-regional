import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Intro', href: '#intro' },
  { label: 'Clasificación', href: '#clasificacion' },
  { label: 'Práctica', href: '#practica' },
  { label: 'Finalidad', href: '#finalidad' },
  { label: 'Tensión', href: '#tension' },
  { label: 'Debate', href: '#postulados' },
  { label: 'Actividad', href: '#actividad' },
  { label: 'Bibliografía', href: '#bibliografia' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0f0a]/90 backdrop-blur-md border-b border-[rgba(160,140,100,0.15)] py-3'
          : 'py-5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="font-mono text-xs tracking-widest uppercase text-earth-400 hover:text-earth-300 transition-colors"
        >
          Det. <span className="text-earth-300">POT</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-xs tracking-wider uppercase text-earth-500 hover:text-earth-200 transition-colors duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menú"
        >
          <span className={`block w-5 h-px bg-earth-400 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-earth-400 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-earth-400 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0e1510]/95 backdrop-blur-md border-t border-[rgba(160,140,100,0.15)] px-6 py-4">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-xs tracking-wider uppercase text-earth-400 hover:text-earth-200 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
