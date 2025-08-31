'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface MenuItem {
  name: string;
  href: string;
  subItems?: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard' },
  {
    name: 'Users',
    href: '/users',
    // subItems: [
    //   { name: 'Manage Users', href: '/users' },
    // ],
  },
  {
    name: 'Providers',
    href: '/providers',
    subItems: [
      { name: 'Add Provider', href: '/providers/add' },
      { name: 'Manage Providers', href: '/providers/manage' },
    ],
  },
  {
    name: 'Categories',
    href: '/categories',
    subItems: [
      { name: 'Add Category', href: '/categories/add' },
      { name: 'Manage Providers', href: '/categories' },
    ],
  },
  {
    name: 'Services',
    href: '/services',
    subItems: [
      { name: 'Add Service', href: '/services/add' },
      { name: 'Manage Services', href: '/services' },
    ],
  },
  {
    name: 'Bookings',
    href: '/bookings',
    subItems: [
      { name: 'View Bookings', href: '/bookings/view' },
      { name: 'Manage Bookings', href: '/bookings/manage' },
    ],
  },
  {
    name: 'Payments',
    href: '/payments',
    subItems: [
      { name: 'View Payments', href: '/payments/view' },
      { name: 'Manage Payments', href: '/payments/manage' },
    ],
  },
  {
    name: 'Marketing',
    href: '/marketing',
    subItems: [
      { name: 'Create Campaign', href: '/marketing/create' },
      { name: 'Manage Campaigns', href: '/marketing/manage' },
    ],
  },
  {
    name: 'Support',
    href: '/support',
    subItems: [
      { name: 'View Tickets', href: '/support/tickets' },
      { name: 'Manage Support', href: '/support/manage' },
    ],
  },
];

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white shadow-xl p-6 fixed top-0 left-0"
    >
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="text-yellow-400">Admin</span> Panel
      </h1>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <div key={item.name}>
            <div
              className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer literal cursor-pointer"
              onClick={() => toggleMenu(item.name)}
            >
              <Link href={item.href} className="flex-1 text-sm font-medium">
                {item.name}
              </Link>
              {item.subItems && (
                <ChevronDownIcon
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    openMenu === item.name ? 'rotate-180' : ''
                  }`}
                />
              )}
            </div>
            <AnimatePresence>
              {openMenu === item.name && item.subItems && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 overflow-hidden"
                >
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className="block p-2 text-sm text-gray-200 hover:bg-blue-500 hover:text-white rounded-md transition-colors duration-200"
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;