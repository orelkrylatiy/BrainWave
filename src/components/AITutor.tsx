import { useState } from 'react';
import { Send, Clock, Menu, X } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  text: string;
  time: string;
}

interface ChatHistory {
  id: number;
  title: string;
  time: string;
}

export function AITutor() {
  const [mode, setMode] = useState<'question' | 'homework'>('question');
  const [inputText, setInputText] = useState('');
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(true);
  
  const chatHistory: ChatHistory[] = [
    { id: 1, title: 'Алгоритмы сортировки', time: '10 минут назад' },
    { id: 2, title: 'Системы счисления', time: '2 часа назад' },
    { id: 3, title: 'Графы и деревья', time: 'Вчера' },
    { id: 4, title: 'Логические операции', time: '2 дня назад' },
    { id: 5, title: 'Рекурсия в Python', time: '3 дня назад' },
  ];

  const messages: Message[] = [
    {
      id: 1,
      type: 'user',
      text: 'Можешь объяснить, как работает алгоритм пузырьковой сортировки?',
      time: '14:32'
    },
    {
      id: 2,
      type: 'ai',
      text: 'Конечно! Пузырьковая сортировка (Bubble Sort) — это простой алгоритм сортировки, который работает следующим образом:\n\n1. Проходим по массиву и сравниваем соседние элементы\n2. Если элемент слева больше элемента справа, меняем их местами\n3. Повторяем процесс, пока массив не будет отсортирован\n\nСложность алгоритма: O(n²) в худшем случае.',
      time: '14:32'
    },
    {
      id: 3,
      type: 'user',
      text: 'А можешь показать пример кода на Python?',
      time: '14:33'
    },
    {
      id: 4,
      type: 'ai',
      text: 'Вот пример реализации:\n\n```python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\n# Пример использования\nlist = [64, 34, 25, 12, 22]\nprint(bubble_sort(list))\n```\n\nЭтот код сортирует массив по возрастанию.',
      time: '14:33'
    }
  ];

  const handleSend = () => {
    if (inputText.trim()) {
      // Здесь будет логика отправки сообщения
      setInputText('');
    }
  };

  return (
    <div className="h-full flex">
      {/* Сайдбар истории чатов */}
      <div className={`${isHistorySidebarOpen ? 'w-80' : 'w-0'} border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 dark:text-gray-100">История чатов</h3>
            <button
              onClick={() => setIsHistorySidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              <X size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="space-y-2 overflow-auto">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                className="w-full text-left p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-gray-100 truncate">{chat.title}</p>
                    <p className="text-gray-500 text-sm mt-1">{chat.time}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Основная область чата */}
      <div className="flex-1 flex flex-col p-12">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            {!isHistorySidebarOpen && (
              <button
                onClick={() => setIsHistorySidebarOpen(true)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <Menu size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            )}
            <h2 className="text-gray-900 dark:text-gray-100 text-3xl">AI Репетитор</h2>
          </div>
          
          {/* Переключатель режимов */}
          <div className="inline-flex bg-gray-100 dark:bg-gray-900 rounded-2xl p-1">
            <button
              onClick={() => setMode('question')}
              className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                mode === 'question'
                  ? 'bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Задать вопрос
            </button>
            <button
              onClick={() => setMode('homework')}
              className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                mode === 'homework'
                  ? 'bg-white dark:bg-black text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Проверить ДЗ
            </button>
          </div>
        </div>

        {/* Область сообщений с ограничением */}
        <div className="flex-1 overflow-auto mb-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl ${
                    message.type === 'user'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
                  } rounded-3xl px-6 py-4`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' 
                      ? 'text-gray-400 dark:text-gray-600' 
                      : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Поле ввода */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === 'question' ? 'Задайте ваш вопрос...' : 'Опишите задание...'}
              className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 transition-colors"
            />
            <button
              onClick={handleSend}
              className="px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              aria-label="Отправить"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
