import { Bot, BookOpen, TrendingUp, ClipboardList, ArrowRight } from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

export function Home({ setActiveTab }: HomeProps) {
  const mainFeatures = [
    {
      id: 'ai-tutor',
      icon: Bot,
      title: 'AI Репетитор',
      description: 'Задавайте вопросы и получайте мгновенные ответы',
      color: 'bg-gray-900 dark:bg-white',
      iconColor: 'text-white dark:text-gray-900',
    },
    {
      id: 'materials',
      icon: BookOpen,
      title: 'Материалы',
      description: 'Полная база знаний по информатике',
      color: 'bg-gray-900 dark:bg-white',
      iconColor: 'text-white dark:text-gray-900',
    },
    {
      id: 'assignments',
      icon: ClipboardList,
      title: 'Задания',
      description: 'Проверяйте текущие задания и дедлайны',
      color: 'bg-gray-900 dark:bg-white',
      iconColor: 'text-white dark:text-gray-900',
    },
    {
      id: 'progress',
      icon: TrendingUp,
      title: 'Прогресс',
      description: 'Следите за своими достижениями',
      color: 'bg-gray-900 dark:bg-white',
      iconColor: 'text-white dark:text-gray-900',
    },
  ];

  return (
    <div className="p-12 flex items-center justify-center min-h-full">
      <div className="max-w-6xl w-full">
        {/* Hero секция */}
        <div className="mb-16 text-center">
          <h1 className="text-gray-900 dark:text-gray-100 text-6xl mb-6">
            AI Wave
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-2xl">
            Ваш персональный помощник в подготовке к экзаменам
          </p>
        </div>

        {/* Кнопки основного функционала */}
        <div className="grid grid-cols-2 gap-6">
          {mainFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className="group p-10 rounded-3xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-left"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  <Icon size={32} className={feature.iconColor} />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 text-2xl mb-3 flex items-center justify-between">
                  {feature.title}
                  <ArrowRight 
                    size={24} 
                    className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 group-hover:translate-x-1 transition-all" 
                  />
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">{feature.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
