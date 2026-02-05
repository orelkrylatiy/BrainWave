import { Home, Bot, BookOpen, TrendingUp, Settings, ClipboardList, Info, Menu, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkTheme: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isDarkTheme, isCollapsed, setIsCollapsed }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'ai-tutor', label: 'AI Репетитор', icon: Bot },
    { id: 'materials', label: 'Материалы', icon: BookOpen },
    { id: 'assignments', label: 'Задания', icon: ClipboardList },
    { id: 'progress', label: 'Прогресс', icon: TrendingUp },
    { id: 'about', label: 'О нас', icon: Info },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#1a1a1a] dark:bg-black p-6 flex flex-col transition-all duration-300`}>
      <div className="mb-12 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L3 7V13L10 18L17 13V7L10 2Z" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="10" cy="10" r="3" fill="white"/>
            </svg>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-white tracking-tight">AI Wave</h1>
              <p className="text-gray-400 text-xs">ОГЭ/ЕГЭ Информатика</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}