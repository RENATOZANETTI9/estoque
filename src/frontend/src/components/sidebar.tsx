'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, LayoutDashboard, Tag, ArrowLeftRight } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Produtos', icon: Package },
  { href: '/categories', label: 'Categorias', icon: Tag },
  { href: '/stock', label: 'Estoque', icon: ArrowLeftRight },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800/50 border-r border-white/10 min-h-screen p-4">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold text-white">Estoque</h2>
        <p className="text-xs text-gray-400">Zanetti Fabrica de Softwares</p>
      </div>
      <nav className="space-y-1">
        {navItems.map(function(item) {
          var isActive = pathname === item.href;
          var Icon = item.icon;
          var baseClasses = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors';
          var activeClasses = isActive
            ? baseClasses + ' bg-cyan-500/20 text-cyan-400'
            : baseClasses + ' text-gray-400 hover:text-white hover:bg-gray-700/50';
          return (
            <Link key={item.href} href={item.href} className={activeClasses}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}