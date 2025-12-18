import { useState } from 'react';
import { Home } from './components/Home';
import { AITutor } from './components/AITutor';
import { Materials } from './components/Materials';
import { Progress } from './components/Progress';
import { Settings } from './components/Settings';
import { Assignments } from './components/Assignments';
import { AboutUs } from './components/AboutUs';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'ai-tutor':
        return <AITutor />;
      case 'materials':
        return <Materials />;
      case 'assignments':
        return <Assignments />;
      case 'progress':
        return <Progress />;
      case 'about':
        return <AboutUs />;
      case 'settings':
        return <Settings isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className={`min-h-screen flex ${isDarkTheme ? 'dark' : ''}`}>
      <div className="flex-1 flex bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isDarkTheme={isDarkTheme}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <div className="flex-1 flex flex-col">
          <Header isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}