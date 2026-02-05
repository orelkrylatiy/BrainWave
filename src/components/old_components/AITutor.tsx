import React, { useState } from 'react';
import { Send, Clock, Menu, X, AlertCircle } from 'lucide-react';
import { gigaChatService } from '../services/gigachat';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatHistory: ChatHistory[] = [];

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const currentTime = new Date().toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      text: inputText,
      time: currentTime
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      // Формируем системное сообщение в зависимости от режима
      const systemMessage = mode === 'question'
        ? 'Ты — опытный AI репетитор по информатике. Объясняй понятно и подробно, используй примеры кода когда это уместно.'
        : 'Ты — AI репетитор по информатике. Проверяй домашние задания, указывай на ошибки и объясняй правильные решения.';

      // Отправляем запрос в GigaChat
      const response = await gigaChatService.sendMessage([
        { role: 'system', content: systemMessage },
        { role: 'user', content: inputText }
      ]);

      // Добавляем ответ AI
      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        text: response,
        time: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError('Ошибка при отправке сообщения. Проверьте настройки API.');
      console.error('Ошибка:', err);
    } finally {
      setIsLoading(false);
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
                  <Clock size={16} className="text-gray-400 mt-1 shrink-0" />
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
            {/* Проверка конфигурации */}
            {!gigaChatService.isConfigured() && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-yellow-900 dark:text-yellow-100 font-medium">
                    Прокси-сервер не запущен
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                    Запустите прокси: cd proxy && node server.js
                  </p>
                </div>
              </div>
            )}

            {/* Ошибка */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 dark:text-red-500 mt-0.5" />
                <p className="text-red-900 dark:text-red-100">{error}</p>
              </div>
            )}

            {/* Сообщения */}
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

            {/* Индикатор загрузки */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-900 rounded-3xl px-6 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
                  </div>
                </div>
              </div>
            )}
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
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
