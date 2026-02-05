import { Trophy, Target, CheckCircle2 } from 'lucide-react';

export function Progress() {
  const stats = [
    { label: 'Всего занятий', value: '45', icon: Target },
    { label: 'Задач решено', value: '127', icon: CheckCircle2 },
    { label: 'Достижений', value: '12', icon: Trophy },
  ];

  const recentActivities = [
    { task: 'Алгоритмы сортировки', score: 95, date: 'Сегодня' },
    { task: 'Системы счисления', score: 88, date: 'Вчера' },
    { task: 'Логические операции', score: 92, date: '2 дня назад' },
    { task: 'Работа со строками', score: 100, date: '3 дня назад' },
    { task: 'Графы и деревья', score: 85, date: '4 дня назад' },
  ];

  const subjects = [
    { name: 'Алгоритмы', progress: 75 },
    { name: 'Программирование', progress: 60 },
    { name: 'Математическая логика', progress: 85 },
    { name: 'Системы счисления', progress: 90 },
  ];

  return (
    <div className="p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-gray-900 dark:text-gray-100 text-3xl mb-3">Ваш прогресс</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Отслеживайте свои успехи и достижения
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center">
                    <Icon size={20} className="text-white dark:text-gray-900" />
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                </div>
                <div className="text-gray-900 dark:text-gray-100 text-4xl">{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* Прогресс по темам */}
        <div className="mb-10">
          <h3 className="text-gray-900 dark:text-gray-100 text-xl mb-4">Прогресс по темам</h3>
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={index} className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-900 dark:text-gray-100">{subject.name}</span>
                  <span className="text-gray-600 dark:text-gray-400">{subject.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 dark:bg-white transition-all duration-300"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Последняя активность */}
        <div>
          <h3 className="text-gray-900 dark:text-gray-100 text-xl mb-4">Последняя активность</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 dark:bg-gray-900"
              >
                <div>
                  <div className="text-gray-900 dark:text-gray-100 mb-1">{activity.task}</div>
                  <div className="text-gray-500 text-sm">{activity.date}</div>
                </div>
                <div className="text-gray-900 dark:text-gray-100 text-2xl">
                  {activity.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
