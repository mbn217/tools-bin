import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  FileText,
  ChevronLeft,
  ChevronRight,
  Wrench,
} from 'lucide-react';

const tools = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'YT Transcript', path: '/youtube-transcript', icon: FileText },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-white border-r border-surface-200 overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-50">
          <Wrench size={18} className="text-accent-500" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold tracking-tight text-gray-900 whitespace-nowrap"
          >
            Tools Bin
          </motion.span>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {tools.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                isActive
                  ? 'text-accent-600'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-surface-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-accent-50"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon size={20} className="relative z-10 shrink-0" />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative z-10 text-sm font-medium whitespace-nowrap"
                  >
                    {name}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t border-surface-200 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </motion.aside>
  );
}
