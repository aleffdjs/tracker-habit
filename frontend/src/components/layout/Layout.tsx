
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Settings, Calendar, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/create', icon: PlusCircle, label: 'Adicionar' },
    { path: '/manage', icon: Settings, label: 'Gerenciar' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 pb-20">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-border z-50">
        <div className="container max-w-4xl mx-auto">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <NavItem 
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                isActive={location.pathname === item.path} 
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ path, label, icon: Icon, isActive }) => {
  return (
    <Link 
      to={path} 
      className={cn(
        "flex flex-col items-center justify-center w-full py-1 text-xs font-medium transition-colors",
        isActive 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div className="relative">
        <Icon size={22} />
        {isActive && (
          <motion.div
            className="absolute -bottom-2 left-1/2 w-1 h-1 bg-primary rounded-full"
            layoutId="nav-indicator"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
            style={{ x: '-50%' }}
          />
        )}
      </div>
      <span className="mt-1">{label}</span>
    </Link>
  );
};

export default Layout;
