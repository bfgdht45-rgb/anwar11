'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/lib/store';
import { Calculator, LogOut, Home, Moon, Sun, Bell } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface DashboardLayoutProps {
  items: NavItem[];
  activeItem: string;
  onItemChange: (id: string) => void;
  children: React.ReactNode;
  title: string;
  roleLabel: string;
  roleIcon: string;
}

export function DashboardLayout({
  items, activeItem, onItemChange, children, title, roleLabel, roleIcon
}: DashboardLayoutProps) {
  const { currentUser, logout, setView, theme, toggleTheme, notifications } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser) return null;

  const unreadNotifications = notifications.filter(n => !n.read && (n.userId === currentUser.id || !n.userId)).length;
  const activeItemObj = items.find(i => i.id === activeItem);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <Home className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold leading-tight">{title}</h1>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => onItemChange('notifications')}>
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 left-1 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Button>
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-lg">
              {currentUser.avatar}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => { logout(); setView('landing'); }} title="تسجيل الخروج">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-16 right-0 z-30 h-[calc(100vh-4rem)] w-64 bg-card border-l transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}>
          <ScrollArea className="h-full">
            <div className="p-3">
              <div className="flex items-center gap-2 p-3 mb-2 rounded-lg bg-muted/50">
                <span className="text-2xl">{roleIcon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate text-sm">{currentUser.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{currentUser.email}</div>
                </div>
              </div>
              <nav className="space-y-1">
                {items.map(item => (
                  <Button
                    key={item.id}
                    variant={activeItem === item.id ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3 h-11"
                    onClick={() => { onItemChange(item.id); setMobileOpen(false); }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-right">{item.label}</span>
                    {item.badge ? (
                      <Badge variant="secondary" className="text-xs">{item.badge}</Badge>
                    ) : null}
                  </Button>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" className="w-full justify-start gap-3 h-11" onClick={() => setView('landing')}>
                  <Home className="w-5 h-5" />
                  <span>الصفحة الرئيسية</span>
                </Button>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 top-16 z-20 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{activeItemObj?.label}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

// ===== Shared Components =====
export function StatCard({ icon: Icon, label, value, color = 'text-emerald-600', trend }: {
  icon: LucideIcon; label: string; value: string | number; color?: string; trend?: string;
}) {
  return (
    <div className="bg-card rounded-xl p-5 border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20">
            {trend}
          </Badge>
        )}
      </div>
      <div className="text-2xl font-bold mb-1">{typeof value === 'number' ? value.toLocaleString('ar-EG') : value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: LucideIcon; title: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
      <h3 className="font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      {action}
    </div>
  );
}
