import { Moon, Sun, User } from 'lucide-react';

interface HeaderProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (value: boolean) => void;
}

export function Header({ isDarkTheme, setIsDarkTheme }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 px-12 py-6 flex items-center justify-end gap-3 transition-colors duration-300">
      <button
        onClick={() => setIsDarkTheme(!isDarkTheme)}
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        aria-label="Переключить тему"
      >
        {isDarkTheme ? (
          <Sun size={20} className="text-gray-600 dark:text-gray-400" />
        ) : (
          <Moon size={20} className="text-gray-600" />
        )}
      </button>
      <button
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        aria-label="Профиль"
      >
        <User size={20} className="text-gray-600 dark:text-gray-400" />
      </button>
    </header>
  );
}