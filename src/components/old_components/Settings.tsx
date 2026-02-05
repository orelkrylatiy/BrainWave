import { Moon, Sun, Bell, User, Languages, HelpCircle } from 'lucide-react';

interface SettingsProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (value: boolean) => void;
}

export function Settings({ isDarkTheme, setIsDarkTheme }: SettingsProps) {
  const settingSections = [
    {
      title: 'Внешний вид',
      items: [
        {
          icon: isDarkTheme ? Sun : Moon,
          label: 'Тема оформления',
          description: isDarkTheme ? 'Тёмная тема' : 'Светлая тема',
          action: () => setIsDarkTheme(!isDarkTheme),
        },
      ],
    },
    {
      title: 'Учётная запись',
      items: [
        {
          icon: User,
          label: 'Профиль',
          description: 'Управление профилем',
        },
        {
          icon: Bell,
          label: 'Уведомления',
          description: 'Настройки уведомлений',
        },
      ],
    },
    {
      title: 'Общие',
      items: [
        {
          icon: Languages,
          label: 'Язык',
          description: 'Русский',
        },
        {
          icon: HelpCircle,
          label: 'Помощь и поддержка',
          description: 'Часто задаваемые вопросы',
        },
      ],
    },
  ];

  return (
    <div className="p-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h2 className="text-gray-900 dark:text-gray-100 text-3xl mb-3">Настройки</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Персонализируйте свой опыт использования платформы
          </p>
        </div>

        <div className="space-y-8">
          {settingSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-gray-900 dark:text-gray-100 mb-4">{section.title}</h3>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      onClick={item.action}
                      className="w-full flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-white dark:text-gray-900" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-gray-900 dark:text-gray-100 mb-1">{item.label}</div>
                        <div className="text-gray-500 text-sm">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
