/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppPreferences, UserProfile } from '../types';
import { THEMES } from '../theme';
import { 
  Settings, User as UserIcon, Keyboard, 
  Sparkles, Sliders, Bell, CheckSquare, Save, Eye, Palette
} from 'lucide-react';

export default function SettingsPage() {
  const { preferences, userProfile, updatePreferences, updateUserProfile } = useApp();

  // Profile forms
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileEmail, setProfileEmail] = useState(userProfile.email);
  const [profileTitle, setProfileTitle] = useState(userProfile.title);

  // Prefs forms
  const [theme, setTheme] = useState<AppPreferences['theme']>(preferences.theme);
  const [density, setDensity] = useState<AppPreferences['density']>(preferences.density);

  useEffect(() => {
    setTheme(preferences.theme);
  }, [preferences.theme]);
  
  const [notifyAssignments, setNotifyAssignments] = useState(preferences.notifyAssignments);
  const [notifyReminders, setNotifyReminders] = useState(preferences.notifyReminders);
  const [notifyComments, setNotifyComments] = useState(preferences.notifyComments);
  const [notifyUpdates, setNotifyUpdates] = useState(preferences.notifyUpdates);

  const [defaultView, setDefaultView] = useState<AppPreferences['defaultView']>(preferences.defaultView);
  const [showCompleted, setShowCompleted] = useState(preferences.showCompleted);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = profileName
      .split(' ')
      .map(p => p[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    updateUserProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      title: profileTitle.trim(),
      avatar: initials || "AJ"
    });
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      theme,
      density,
      notifyAssignments,
      notifyReminders,
      notifyComments,
      notifyUpdates,
      defaultView,
      showCompleted
    });
  };

  return (
    <div id="settings-view" className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto flex flex-col h-full">
      {/* Page Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          Workspace Configurations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Adjust profile cards, default view layouts, notification alerts, visual spacings, and themes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Category tabs */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-150 p-4 space-y-1 text-xs">
            <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-3 px-3">Sections</h3>
            <a href="#section-profile" className="flex items-center gap-2.5 px-3 py-2.5 bg-blue-50/70 text-blue-700 font-extrabold rounded-lg ring-1 ring-blue-100">
              <UserIcon className="h-4.5 w-4.5" />
              <span>Personal Profile</span>
            </a>
            <a href="#section-preferences" className="flex items-center gap-2.5 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-bold rounded-lg transition">
              <Sliders className="h-4.5 w-4.5" />
              <span>App Preferences</span>
            </a>
            <a href="#section-themes" className="flex items-center gap-2.5 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-bold rounded-lg transition">
              <Palette className="h-4.5 w-4.5" />
              <span>Workspace Themes</span>
            </a>
            <a href="#section-notifications" className="flex items-center gap-2.5 px-3 py-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-bold rounded-lg transition">
              <Bell className="h-4.5 w-4.5" />
              <span>Alert Notifications</span>
            </a>
            <div className="border-t border-slate-100 pt-3 mt-3 text-slate-400 px-3">
              <p className="text-[10px] leading-relaxed">TaskFlow Prototype Build<br />Version 1.0.0 (June 2026)</p>
            </div>
          </div>
        </div>

        {/* Right Side: Configuration panes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* A. Profile configuration */}
          <section id="section-profile" className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <UserIcon className="h-4.5 w-4.5 text-blue-600" /> Personal Identity Details
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1.5">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1.5">Job Title / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Designer"
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1.5">Email Coordinate *</label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg leading-none shadow-xs transition cursor-pointer"
                >
                  <Save className="h-4 w-4" /> Save Identity Parameters
                </button>
              </div>
            </form>
          </section>

          {/* B. Preferences Configuration */}
          <section id="section-preferences" className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <Sliders className="h-4.5 w-4.5 text-blue-600" /> Default App Preferences
            </h2>
            <form onSubmit={handlePreferencesSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Default workspace view Preference */}
                <div>
                  <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1.5">Default Workspace view</label>
                  <select
                    value={defaultView}
                    onChange={(e) => setDefaultView(e.target.value as AppPreferences['defaultView'])}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="board">📋 Kanban cards Board</option>
                    <option value="list">📝 Structured Rows List</option>
                  </select>
                </div>

                {/* Spacing Layout density option */}
                <div>
                  <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1.5">Layout Density spacing</label>
                  <select
                    value={density}
                    onChange={(e) => setDensity(e.target.value as AppPreferences['density'])}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="comfortable">Comfortable Spacings</option>
                    <option value="compact">Compact Listings density</option>
                  </select>
                </div>

                {/* Workspace theme picker select */}
                <div>
                  <label className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider mb-1.5">Color Palette Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as AppPreferences['theme'])}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-lg bg-white uppercase"
                  >
                    {Object.values(THEMES).map((t) => (
                      <option key={t.id} value={t.id}>
                        🎨 {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Show Completed task cards checkbox option */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="flex items-start gap-3 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="rounded-sm border-slate-300 text-blue-300 text-blue-600 focus:ring-blue-400 mt-0.5 h-4 w-4 shrink-0"
                  />
                  <div>
                    <span className="block font-bold text-slate-805 text-xs">Retain closed task cards</span>
                    <span className="block text-[10px] text-slate-400 font-medium font-normal mt-0.5">If disabled, task cards marked 'Done' are immediately filtered out from default workspace lists.</span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-850 hover:bg-slate-950 text-white font-bold rounded-lg shadow-xs transition cursor-pointer"
                >
                  <Save className="h-4 w-4" /> Save Default Attributes
                </button>
              </div>
            </form>
          </section>

          {/* Visual Themes Interactive Gallery selection block */}
          <section id="section-themes" className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Palette className="h-4.5 w-4.5 text-blue-600" /> Bento Color Themes
              </h2>
              <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                6 Style Modules
              </span>
            </div>
            
            <p className="text-[11px] text-slate-450 leading-relaxed font-normal">
              Click any style card below to immediately activate its balanced visual bento configurations, colors, borders, and layout properties:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(THEMES).map((t) => {
                const isActive = preferences.theme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      updatePreferences({ theme: t.id });
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 select-none flex flex-col justify-between h-32 group
                      ${isActive 
                        ? 'border-indigo-600 ring-2 ring-indigo-50 bg-indigo-50/10' 
                        : 'border-slate-200 hover:border-slate-350 bg-slate-50/20'
                      }
                    `}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-800">{t.name}</span>
                        {/* Circle color preview pills */}
                        <div className="flex gap-1">
                          <span className={`w-2.5 h-2.5 rounded-full ${t.primaryBg}`} />
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-850" />
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-200" />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 leading-normal font-normal">{t.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/50">
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-350">
                        {t.id === 'dark' ? 'Dark theme' : 'Light Theme'}
                      </span>
                      {isActive ? (
                        <span className="text-[10px] font-extrabold text-indigo-600 flex items-center gap-1">
                          ● Active Theme
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition">
                          Apply Style
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* C. Notification configurations options */}
          <section id="section-notifications" className="bg-white rounded-2xl border border-slate-150 p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <Bell className="h-4.5 w-4.5 text-blue-600" /> Alerts & Communications
            </h2>
            <div className="space-y-3">
              <p className="text-[10.5px] text-slate-400 leading-normal mb-3 font-normal">Check which notifications you would like simulated in real-time as sliding toast alarms:</p>
              
              <div className="space-y-3.5">
                {/* Rule 1 */}
                <label className="flex items-start gap-3 select-none cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={notifyAssignments}
                    onChange={(e) => setNotifyAssignments(e.target.checked)}
                    className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-400 mt-0.5 h-4.5 w-4.5 shrink-0"
                  />
                  <div>
                    <span className="block font-bold text-slate-750 text-xs py-0.5 leading-none transition group-hover:text-blue-600">Workload Assignments</span>
                    <span className="text-[10px] text-slate-400 font-normal leading-normal">Trigger dynamic notices once a workspace card gets assigned to your profile.</span>
                  </div>
                </label>

                {/* Rule 2 */}
                <label className="flex items-start gap-3 select-none cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={notifyReminders}
                    onChange={(e) => setNotifyReminders(e.target.checked)}
                    className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-400 mt-0.5 h-4.5 w-4.5 shrink-0"
                  />
                  <div>
                    <span className="block font-bold text-slate-750 text-xs py-0.5 leading-none transition group-hover:text-blue-600">Deadlines Reminders</span>
                    <span className="text-[10px] text-slate-400 font-normal leading-normal">Simulate automated alarm events on upcoming critical timelines within 48 hours.</span>
                  </div>
                </label>

                {/* Rule 3 */}
                <label className="flex items-start gap-3 select-none cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={notifyComments}
                    onChange={(e) => setNotifyComments(e.target.checked)}
                    className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-400 mt-0.5 h-4.5 w-4.5 shrink-0"
                  />
                  <div>
                    <span className="block font-bold text-slate-750 text-xs py-0.5 leading-none transition group-hover:text-blue-600">Thread Updates</span>
                    <span className="text-[10px] text-slate-400 font-normal leading-normal">Recieve notifications when team members post comment messages in your active workspaces pages.</span>
                  </div>
                </label>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
