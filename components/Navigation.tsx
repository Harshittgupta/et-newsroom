"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Zap, Video, GitBranch, Globe2, Menu, X, Bell, Search, LogOut, Settings, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/my-et",        label: "My ET",          icon: TrendingUp, color: "text-gold"       },
  { href: "/navigator",    label: "News Navigator",  icon: Zap,        color: "text-scarlet"    },
  { href: "/video-studio", label: "Video Studio",    icon: Video,      color: "text-azure"      },
  { href: "/story-arc",    label: "Story Arc",       icon: GitBranch,  color: "text-jade"       },
  { href: "/vernacular",   label: "Vernacular",      icon: Globe2,     color: "text-purple-400" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserEmail(data.user.email ?? null);
        setUserName(data.user.user_metadata?.full_name ?? data.user.email?.split("@")[0] ?? "User");
      }
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = userName ? userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gold rounded flex items-center justify-center">
                <span className="font-display font-black text-ink-950 text-sm">ET</span>
              </div>
              <span className="font-display font-bold text-pearl text-sm hidden sm:block">
                Newsroom <span className="text-gold text-xs font-body font-normal">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon, color }) => (
                <Link key={href} href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all duration-200
                    ${pathname === href ? "text-gold bg-gold/10" : "text-pearl/60 hover:text-pearl"}`}>
                  <Icon size={12} className={pathname === href ? "text-gold" : color} />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center text-pearl/40 hover:text-pearl/80 transition-colors">
                <Search size={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-pearl/40 hover:text-pearl/80 transition-colors relative">
                <Bell size={14} />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-scarlet rounded-full" />
              </button>

              {/* User avatar */}
              {userName ? (
                <div className="relative">
                  <button onClick={() => setUserOpen(!userOpen)}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-ink-950 text-xs font-bold hover:scale-105 transition-transform">
                    {initials}
                  </button>

                  <AnimatePresence>
                    {userOpen && (
                      <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        className="absolute right-0 top-10 w-52 glass rounded-xl overflow-hidden shadow-2xl border border-white/5 z-50">
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-pearl/90 text-sm font-medium truncate">{userName}</p>
                          <p className="text-pearl/40 text-xs truncate">{userEmail}</p>
                        </div>
                        <div className="p-1">
                          <Link href="/settings" onClick={() => setUserOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-pearl/60 hover:text-pearl hover:bg-white/5 rounded-lg text-sm transition-colors">
                            <Settings size={13} /> Settings
                          </Link>
                          <button onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-3 py-2 text-scarlet/70 hover:text-scarlet hover:bg-scarlet/5 rounded-lg text-sm transition-colors">
                            <LogOut size={13} /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className="text-xs text-pearl/60 hover:text-pearl px-3 py-1.5 glass rounded-lg transition-colors">
                  Sign in
                </Link>
              )}

              <button className="md:hidden text-pearl/60" onClick={() => setOpen(!open)}>
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 z-40 glass border-b border-white/5 md:hidden">
            {navItems.map(({ href, label, icon: Icon, color }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm border-b border-white/5
                  ${pathname === href ? "text-gold bg-gold/5" : "text-pearl/60"}`}>
                <Icon size={14} className={color} />
                {label}
              </Link>
            ))}
            {userName && (
              <button onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-6 py-3 text-sm text-scarlet/70">
                <LogOut size={14} /> Sign out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close user dropdown on outside click */}
      {userOpen && <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />}
    </>
  );
}
