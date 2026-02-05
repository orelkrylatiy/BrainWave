import { Book, ChevronRight, FileText } from 'lucide-react';

export function Materials() {
  const topics = [
    {
      category: 'Алгоритмы',
      items: [
        'Линейные алгоритмы',
        'Ветвления и циклы',
        'Алгоритмы сортировки',
        'Алгоритмы поиска',
      ],
    },
    {
      category: 'Программирование',
      items: [
        'Основы Python',
        'Работа со строками',
        'Списки и кортежи',
        'Функции и рекурсия',
      ],
    },
    {
      category: 'Математическая логика',
      items: [
        'Логические операции',
        'Таблицы истинности',
        'Булева алгебра',
        'Логические выражения',
      ],
    },
    {
      category: 'Системы счисления',
      items: [
        'Двоичная система',
        'Восьмеричная система',
        'Шестнадцатеричная система',
        'Перевод между системами',
      ],
    },
  ];

  return (
    <div className="p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-gray-900 dark:text-gray-100 text-3xl mb-3">Материалы</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Все необходимые материалы для подготовки к экзамену
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {topics.map((topic, topicIndex) => (
            <div
              key={topicIndex}
              className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center">
                  <Book size={20} className="text-white dark:text-gray-900" />
                </div>
                <h3 className="text-gray-900 dark:text-gray-100 text-xl">{topic.category}</h3>
              </div>
              <div className="space-y-2">
                {topic.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100">{item}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors"
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
