import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User2, Menu, X } from "lucide-react";
import useAuth from "../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Find Lawyers & Law Firms", to: "/findprofile" },
  { label: "Ask Queries", to: "/querypage" },
  { label: "Blogs", to: "/blogs" },
  { label: "Lawyer Signup", href: "https://www.google.com" },
  { label: "Help Centre", to: "/support" },
] as const;

export default function Header() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Clear search when navigating to a different page
  useEffect(() => {
    setQ(""); // Clear search on component mount
  }, []);

  // Simple auto-search on Enter key or after typing
  useEffect(() => {
    if (q.trim()) {
      const timeoutId = setTimeout(() => {
        setOpen(false);
        navigate(`/findprofile?search=${encodeURIComponent(q.trim())}`);
      }, 800); // 800ms delay

      return () => clearTimeout(timeoutId);
    }
  }, [q, navigate]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = q.trim();
    if (term) {
      setOpen(false);
      navigate(`/findprofile?search=${encodeURIComponent(term)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 py-3">
          <img src="/assets/Group1.png" alt="Expert Vakeel" className="h-9 w-auto select-none sm:h-10" draggable={false} />
        </Link>

        <form onSubmit={onSubmit} className="hidden flex-1 justify-center px-6 lg:flex">
          <label className="relative block w-full max-w-[520px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search lawyers, law firms..."
              aria-label="Search"
              className="h-11 w-full rounded-full bg-gray-100 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none ring-1 ring-black/5 transition focus:bg-white focus:ring-2 focus:ring-[#FFA800]/40"
            />
          </label>
        </form>

        <div className="flex items-center gap-3 lg:gap-8">
          <div className="hidden items-center gap-8 text-sm font-medium text-gray-600 lg:flex">
            <nav className="flex items-center gap-8">
              {NAV_ITEMS.map((n) => {
                // Special case: Ask Queries requires login
                if (n.label === "Ask Queries" && !user) {
                  return (
                    <button
                      key={`${n.label}-guest`}
                      onClick={() => navigate("/login")}
                      className="hover:text-[#FFA800]"
                    >
                      {n.label}
                    </button>
                  );
                }

                // External link (href) -> <a>
                if ("href" in n && n.href) {
                  return (
                    <a
                      key={`${n.label}-href`}
                      href={n.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#FFA800]"
                    >
                      {n.label}
                    </a>
                  );
                }

                // Internal link (to) -> <Link>
                return (
                  <Link key={`${n.label}-to`} to={(n as any).to} className="hover:text-[#FFA800]">
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            {user ? (
              <div className="flex items-center gap-4">
                <span>Hello, {user.name || (user as any).fullName}</span>
                <button onClick={async () => { await logout(); navigate("/login"); }} className="rounded-full bg-[#FFA800] px-4 py-1 text-sm font-semibold text-black hover:brightness-95">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 hover:text-[#FFA800]">
                <User2 className="h-4 w-4" /><span>Login / Sign Up</span>
              </Link>
            )}
          </div>
          <button aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((s) => !s)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA800]/40 lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="px-4 pb-3 lg:hidden">
        <label className="relative block w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search lawyers, law firms..."
            aria-label="Search"
            className="h-11 w-full rounded-full bg-gray-100 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 outline-none ring-1 ring-black/5 transition focus:bg-white focus:ring-2 focus:ring-[#FFA800]/40"
          />
        </label>
      </form>

      <div id="mobile-menu" className={`lg:hidden overflow-hidden border-t border-gray-200 transition-[max-height,opacity] duration-300 ease-out ${open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="mx-auto max-w-[1280px] px-4 pb-4 pt-3">
          <nav className="grid gap-2 text-[15px] font-medium text-gray-700">
            {NAV_ITEMS.map((n) => {
              if (n.label === "Ask Queries" && !user) {
                return (
                  <button
                    key={`${n.label}-mobile-guest`}
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="rounded-lg px-2 py-2 text-left hover:text-[#FFA800] hover:bg-gray-50"
                  >
                    {n.label}
                  </button>
                );
              }

              if ("href" in n && n.href) {
                return (
                  <a
                    key={`${n.label}-mobile-href`}
                    href={n.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-2 py-2 hover:text-[#FFA800] hover:bg-gray-50"
                  >
                    {n.label}
                  </a>
                );
              }

              return (
                <Link key={`${n.label}-mobile-to`} to={(n as any).to} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 hover:text-[#FFA800] hover:bg-gray-50">
                  {n.label}
                </Link>
              );
            })}
            {user ? (
              <button onClick={async () => { setOpen(false); await logout(); navigate("/login"); }} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#FFA800] px-4 py-2 text-sm font-semibold text-black hover:brightness-95">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#FFA800] px-4 py-2 text-sm font-semibold text-black hover:brightness-95">
                <User2 className="h-4 w-4" />Login / Sign Up
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
