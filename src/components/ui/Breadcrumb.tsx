'use client';

import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  theme?: 'dark' | 'light';
}

export default function Breadcrumb({ items, theme = 'light' }: BreadcrumbProps) {
  const isDark = theme === 'dark';
  
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className={`h-4 w-4 mx-2 ${isDark ? 'text-white/60' : 'text-gray-400'}`} />
            )}
            {item.active ? (
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.label}
              </span>
            ) : item.onClick ? (
              <button
                onClick={item.onClick}
                className={`transition-colors hover:underline ${
                  isDark 
                    ? 'text-white/80 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ) : (
              <Link
                href={item.href || '#'}
                className={`transition-colors ${
                  isDark 
                    ? 'text-white/80 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
