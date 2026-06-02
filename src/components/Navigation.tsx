/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTheme, THEMES } from '../theme';
import { Palette } from 'lucide-react';
import { 
  LayoutDashboard, FolderKanban, Users, Settings, 
  LogOut, Menu, X, PlusCircle, CheckSquare, Bell, TrendingUp
} from 'lucide-react';

interface NavigationProps {
  children: React.ReactNode;
  onOpenNewTask: () => void;
}

function Navigation({ children, onOpenNewTask }: NavigationProps) {
  const { userProfile, logout, preferences, updatePreferences } = useApp();
  const theme = getTheme(preferences.theme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Team Members', path: '/team', icon: Users },
    { name: 'Performance Insights', path: '/insights', icon: TrendingUp },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${theme.bgPage} ${theme.textMain} flex flex-col md:flex-row antialiased transition-colors duration-200`}>
      {/* Mobile Top Header Navigation */}
      <header id="mobile-nav" className={`md:hidden ${theme.sidebarBg} border-b ${theme.sidebarBorder} px-4 py-3 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200`}>
        <div className="flex items-center gap-2">
          <div className={`h-9 w-9 rounded-xl ${theme.primaryBg} flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/25`}>
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className={`font-extrabold ${theme.textMain} text-lg tracking-tight`}>TaskFlow</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Create Task Floating Action Button shortcut */}
          <button
            onClick={onOpenNewTask}
            className={`p-1 ${theme.textMuted} hover:${theme.primaryText} transition`}
            title="Quick Create Task"
          >
            <PlusCircle className="h-6 w-6" />
          </button>
          
          <button
            id="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 ${theme.textMuted} hover:${theme.textMain} rounded-lg transition`}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Swipe Overlay Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div 
        className={`fixed inset-y-0 left-0 ${theme.sidebarBg} w-64 border-r ${theme.sidebarBorder} p-5 flex flex-col h-full z-30 transition-transform duration-300 transform md:hidden
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg ${theme.primaryBg} flex items-center justify-center text-white font-black`}>
              <CheckSquare className="h-4 w-4" />
            </div>
            <span className={`font-extrabold ${theme.textMain} tracking-tight text-base`}>TaskFlow</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className={`p-1 ${theme.textMuted} hover:${theme.textMain} rounded-md`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu rows in drawer */}
        <nav className="space-y-1 flex-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const IsActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${IsActive 
                    ? `${theme.id === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} ${theme.primaryText} font-bold border-l-2 ${theme.id === 'dark' ? 'border-violet-500' : 'border-indigo-600'}` 
                    : `${theme.textMuted} hover:${theme.id === 'dark' ? 'bg-slate-800/45' : 'bg-slate-50'} hover:${theme.textMain}`
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* QUICK THEME PICKER MOBILE */}
        <div className={`mb-4 p-3 rounded-xl border ${theme.sidebarBorder} ${theme.id === 'dark' ? 'bg-slate-800/35' : 'bg-slate-50'} transition-all`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${theme.textMuted} flex items-center gap-1`}>
              <Palette className="h-3.5 w-3.5" /> Workspace Theme
            </span>
            <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${theme.accentBgLight} ${theme.accentTextList}`}>
              {theme.name}
            </span>
          </div>
          <div className="flex items-center justify-between gap-1">
            {Object.values(THEMES).map((t) => {
              const active = preferences.theme === t.id;
              const bgPreview = 
                t.id === 'light' ? 'bg-indigo-600' :
                t.id === 'dark' ? 'bg-violet-600' :
                t.id === 'teal' ? 'bg-teal-600' :
                t.id === 'sunset' ? 'bg-orange-600' :
                t.id === 'ocean' ? 'bg-sky-600' :
                'bg-purple-600';

              return (
                <button
                  key={t.id}
                  onClick={() => updatePreferences({ theme: t.id })}
                  title={t.name}
                  className={`relative w-6 h-6 rounded-full ${bgPreview} flex items-center justify-center transition-all shadow-xs hover:scale-110 cursor-pointer duration-100 ring-offset-2
                    ${active ? 'ring-2 ring-slate-400' : 'opacity-85 hover:opacity-100'}
                  `}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick actions for mobile drawer */}
        <div className={`border-t ${theme.sidebarBorder} pt-4 mt-auto`}>
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className={`h-9 w-9 rounded-full ${theme.accentBgLight} ${theme.accentTextList} font-extrabold text-sm flex items-center justify-center shrink-0 border`}>
              {userProfile.avatar}
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold ${theme.textMain} truncate`}>{userProfile.name}</p>
              <p className={`text-[10px] ${theme.textMuted} truncate`}>{userProfile.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className={`flex items-center gap-3 w-full px-4 py-2.5 ${theme.textMuted} hover:bg-rose-50/20 hover:text-rose-600 rounded-xl text-sm font-bold transition`}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>


      {/* Desktop Main Left Sidebar Navigation */}
      <aside id="desktop-sidebar" className={`hidden md:flex flex-col w-64 ${theme.sidebarBg} border-r ${theme.sidebarBorder} h-screen sticky top-0 shrink-0 p-6 transition-colors duration-200`}>
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`w-8 h-8 ${theme.primaryBg} rounded-lg flex items-center justify-center text-white font-bold`}>P</div>
          <div>
            <span className={`font-bold ${theme.textMain} text-xl tracking-tight block leading-tight`}>ProjectHub</span>
            <span className={`text-[9px] ${theme.primaryText} font-extrabold uppercase tracking-widest block mt-0.5`}>Bento Workspace</span>
          </div>
        </div>

        {/* TASK CREATOR SHORTCUT */}
        <button
          id="sidebar-btn-quick-task"
          onClick={onOpenNewTask}
          className={`flex items-center justify-center gap-2 w-full px-4 py-3 mb-6 ${theme.primaryBg} ${theme.primaryHover} text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg active:translate-y-0.5 transition cursor-pointer`}
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>New Task</span>
        </button>

        {/* SIDENAV PAGES */}
        <nav className="space-y-1 flex-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const IsActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md font-semibold transition-all duration-150 text-sm
                  ${IsActive 
                    ? `${theme.id === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} ${theme.primaryText} font-bold border-l-2 ${theme.id === 'dark' ? 'border-violet-500' : 'border-indigo-600'}` 
                    : `${theme.textMuted} hover:${theme.id === 'dark' ? 'bg-slate-800/40' : 'bg-slate-50'} hover:${theme.textMain}`
                  }
                `}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-colors ${IsActive ? `${theme.primaryText}` : `${theme.textMuted}`}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* QUICK THEME PICKER DESKTOP */}
        <div className={`mb-6 p-3 rounded-xl border ${theme.sidebarBorder} ${theme.id === 'dark' ? 'bg-slate-800/35' : 'bg-slate-50'} transition-all`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${theme.textMuted} flex items-center gap-1`}>
              <Palette className="h-3.5 w-3.5" /> Workspace Theme
            </span>
            <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${theme.accentBgLight} ${theme.accentTextList}`}>
              {theme.name}
            </span>
          </div>
          <div className="flex items-center justify-between gap-1">
            {Object.values(THEMES).map((t) => {
              const active = preferences.theme === t.id;
              const bgPreview = 
                t.id === 'light' ? 'bg-indigo-600' :
                t.id === 'dark' ? 'bg-violet-600' :
                t.id === 'teal' ? 'bg-teal-600' :
                t.id === 'sunset' ? 'bg-orange-600' :
                t.id === 'ocean' ? 'bg-sky-600' :
                'bg-purple-600';

              return (
                <button
                  key={t.id}
                  onClick={() => updatePreferences({ theme: t.id })}
                  title={t.name}
                  className={`relative w-6 h-6 rounded-full ${bgPreview} flex items-center justify-center transition-all shadow-xs hover:scale-110 cursor-pointer duration-100 ring-offset-2
                    ${active ? 'ring-2 ring-slate-400' : 'opacity-85 hover:opacity-100'}
                  `}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* USER PROFILE INFO & SIGN OUT FOOTER */}
        <div className={`border-t ${theme.sidebarBorder} pt-5 mt-auto`}>
          <div className={`flex items-center gap-3 p-2 rounded-lg ${theme.id === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <div className={`w-10 h-10 rounded-full ${theme.accentBgLight} flex items-center justify-center ${theme.accentTextList} font-extrabold uppercase shrink-0 border ${theme.sidebarBorder}`}>
              {userProfile.avatar}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className={`text-sm font-semibold truncate leading-tight ${theme.textMain}`}>{userProfile.name}</p>
              <p className={`text-xs ${theme.textMuted} truncate leading-none mt-0.5`}>{userProfile.title || 'Admin'}</p>
            </div>
          </div>

          <button
            id="sidebar-btn-logout"
            onClick={handleLogoutClick}
            className={`flex items-center gap-3.5 w-full mt-4 px-4 py-2 ${theme.textMuted} hover:bg-rose-50/20 hover:text-rose-600 rounded-xl text-sm font-bold transition duration-200 cursor-pointer`}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container Content */}
      <main id="main-content-layout" className="flex-1 overflow-x-hidden min-h-screen">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

export default React.memo(Navigation);
