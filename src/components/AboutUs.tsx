import { Bot, BookOpen, TrendingUp, Zap } from 'lucide-react';

export function AboutUs() {
  const features = [
    {
      icon: Bot,
      title: 'AI Репетитор',
      description: 'Персональный помощник для подготовки к экзаменам',
    },
    {
      icon: BookOpen,
      title: 'Материалы',
      description: 'Полная база знаний по информатике',
    },
    {
      icon: TrendingUp,
      title: 'Отслеживание прогресса',
      description: 'Следите за своими достижениями',
    },
    {
      icon: Zap,
      title: 'Быстрые ответы',
      description: 'Мгновенная помощь в решении задач',
    },
  ];

  return (
    <div className="p-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero секция */}
        <div className="mb-20 text-center">
          <h1 className="text-gray-900 dark:text-gray-100 text-5xl mb-6">
            О платформе AI Wave
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto">
            Персонализированное обучение с помощью искусственного интеллекта для подготовки к ОГЭ/ЕГЭ по информатике
          </p>
        </div>

        {/* Карточки возможностей */}
        <div className="grid grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center mb-4">
                  <Icon size={24} className="text-white dark:text-gray-900" />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-8 rounded-3xl bg-gray-50 dark:bg-gray-900">
            <div className="text-gray-900 dark:text-gray-100 text-4xl mb-2">1000+</div>
            <div className="text-gray-600 dark:text-gray-400">Решённых задач</div>
          </div>
          <div className="text-center p-8 rounded-3xl bg-gray-50 dark:bg-gray-900">
            <div className="text-gray-900 dark:text-gray-100 text-4xl mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-400">Доступность AI</div>
          </div>
          <div className="text-center p-8 rounded-3xl bg-gray-50 dark:bg-gray-900">
            <div className="text-gray-900 dark:text-gray-100 text-4xl mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-400">Средний балл</div>
          </div>
        </div>
      </div>
    </div>
  );
}
