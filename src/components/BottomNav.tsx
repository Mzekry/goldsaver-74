import React from 'react';
import { Link } from 'react-router-dom';

type Tab = 'home' | 'market' | 'wallet' | 'settings';

// In RTL flex-row, first DOM item = rightmost visual position
// Order: Home (right) → Market → [FAB center] → Wallet → Settings (left)
export function BottomNav({ active }: { active: Tab }) {
  const leftTabs = [
    { id: 'home' as Tab, icon: 'dashboard', label: 'الرئيسية', href: '/' },
    { id: 'market' as Tab, icon: 'trending_up', label: 'السوق', href: '/market' },
  ];
  const rightTabs = [
    { id: 'wallet' as Tab, icon: 'account_balance_wallet', label: 'المحفظة', href: '/wallet' },
    { id: 'settings' as Tab, icon: 'settings', label: 'الإعدادات', href: '/settings' },
  ];

  const NavTab = ({ tab }: { tab: (typeof leftTabs)[0] }) => {
    const isActive = active === tab.id;
    return (
      <Link
        to={tab.href}
        className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all duration-300 ${
          isActive
            ? 'text-primary bg-primary-container/20'
            : 'text-on-surface-variant opacity-60 hover:bg-surface-container-high'
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
        >
          {tab.icon}
        </span>
        <span className="font-label-sm text-label-sm">{tab.label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 w-full z-50 rounded-t-xl bg-surface shadow-[0px_-8px_24px_rgba(10,31,68,0.06)] border-t border-outline-variant/30">
      <div className="flex flex-row justify-around items-center w-full px-base py-2 max-w-7xl mx-auto">
        {/* RTL: first = rightmost. Home, Market on the right side */}
        {leftTabs.map((tab) => <NavTab key={tab.id} tab={tab} />)}

        {/* Center FAB — plus icon only, no text, elevated */}
        <Link
          to="/add-record"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-container to-primary-fixed-dim shadow-lg shadow-primary-container/40 -mt-7 border-4 border-surface active:scale-90 transition-transform duration-200"
        >
          <span
            className="material-symbols-outlined text-on-primary-container"
            style={{ fontSize: 28, fontVariationSettings: "'wght' 600" }}
          >
            add
          </span>
        </Link>

        {/* Wallet, Settings on the left side */}
        {rightTabs.map((tab) => <NavTab key={tab.id} tab={tab} />)}
      </div>
    </nav>
  );
}
