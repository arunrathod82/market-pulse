import { Activity, Bell, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onEnableNotifications: () => void;
}

const Header = ({ onEnableNotifications }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Market<span className="text-primary">Pulse</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 ml-4 px-2 py-1 rounded-sm bg-secondary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-slow" />
            <span className="text-xs font-mono text-muted-foreground">LIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnableNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </button>
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-muted-foreground text-xs font-mono">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Auto-refresh: 15s
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
