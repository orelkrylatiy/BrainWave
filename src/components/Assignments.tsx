import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export function Assignments() {
  const assignments = [
    {
      id: 1,
      title: 'Алгоритмы поиска',
      description: 'Реализовать бинарный поиск и линейный поиск',
      deadline: '25 ноября',
      status: 'active',
      priority: 'high',
      timeLeft: '4 дня',
    },
    {
      id: 2,
      title: 'Системы счисления',
      description: 'Решить 10 задач на перевод чисел',
      deadline: '28 ноября',
      status: 'active',
      priority: 'medium',
      timeLeft: '7 дней',
    },
    {
      id: 3,
      title: 'Работа со строками',
      description: 'Написать программу для обработки текста',
      deadline: '30 ноября',
      status: 'active',
      priority: 'medium',
      timeLeft: '9 дней',
    },
    {
      id: 4,
      title: 'Графы',
      description: 'Изучить алгоритмы обхода графов (DFS, BFS)',
      deadline: '3 декабря',
      status: 'active',
      priority: 'low',
      timeLeft: '12 дней',
    },
    {
      id: 5,
      title: 'Логические операции',
      description: 'Решить задачи на построение таблиц истинности',
      deadline: '18 ноября',
      status: 'completed',
      priority: 'high',
      timeLeft: 'Завершено',
    },
    {
      id: 6,
      title: 'Основы Python',
      description: 'Написать 5 простых программ',
      deadline: '15 ноября',
      status: 'completed',
      priority: 'medium',
      timeLeft: 'Завершено',
    },
  ];

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return '';
    }
  };

  return (
    <div className="p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-gray-900 dark:text-gray-100 text-3xl mb-3">Задания</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Отслеживайте текущие и выполненные задания
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle size={20} className="text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Активных</span>
            </div>
            <div className="text-gray-900 dark:text-gray-100 text-4xl">{activeAssignments.length}</div>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 size={20} className="text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Завершённых</span>
            </div>
            <div className="text-gray-900 dark:text-gray-100 text-4xl">{completedAssignments.length}</div>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Всего</span>
            </div>
            <div className="text-gray-900 dark:text-gray-100 text-4xl">{assignments.length}</div>
          </div>
        </div>

        {/* Текущие задания */}
        <div className="mb-10">
          <h3 className="text-gray-900 dark:text-gray-100 text-xl mb-4">Текущие задания</h3>
          <div className="space-y-4">
            {activeAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-gray-900 dark:text-gray-100 text-lg">{assignment.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-white text-xs ${getPriorityColor(assignment.priority)}`}>
                        {getPriorityLabel(assignment.priority)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{assignment.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={16} />
                        <span>{assignment.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={16} />
                        <span>{assignment.timeLeft}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Завершённые задания */}
        <div>
          <h3 className="text-gray-900 dark:text-gray-100 text-xl mb-4">Завершённые задания</h3>
          <div className="space-y-3">
            {completedAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 opacity-60"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-500" />
                    <div>
                      <h4 className="text-gray-900 dark:text-gray-100">{assignment.title}</h4>
                      <p className="text-gray-500 text-sm">{assignment.description}</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">{assignment.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
