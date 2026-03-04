import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ToolCard({ name, description, icon: Icon, path, color }) {
  return (
    <Link to={path}>
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="group relative bg-white border border-surface-200 rounded-2xl p-6 cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 relative z-10"
          style={{ backgroundColor: `${color}14` }}
        >
          <Icon size={24} style={{ color }} />
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-1 relative z-10">
          {name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed relative z-10">
          {description}
        </p>

        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-accent-50/50 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </Link>
  );
}
