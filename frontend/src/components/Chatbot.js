import React, { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Network Traffic IDS Assistant. How can I help you?", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    'hello': "Hey there! Welcome to Network Traffic IDS. What would you like to know?",
    'help': "I can help you with:\n• Understanding predictions\n• Uploading files\n• API documentation\n• System status\n\nWhat interests you?",
    'predict': "To make a prediction, go to the 'Single Prediction' tab and fill in network traffic features!",
    'batch': "The Batch Upload allows you to upload CSV files with multiple network flows for analysis. Simply drag & drop your file!",
    'api': "Our API is available at http://localhost:8000. Full documentation at http://localhost:8000/docs",
    'status': "The system is running smoothly! Models are loaded and ready.",
    'attack': "We detect 9 types of attacks: Generic, Exploits, Fuzzers, Backdoors, Analysis, DoS, Reconnaissance, Shellcode, and Worms.",
    'default': "I can help with predictions, batch uploads, API info, and more. Ask me anything!"
  };

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(botResponses)) {
      if (msg.includes(key)) {
        return response;
      }
    }
    return botResponses.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, userMsg]);
    setInput('');

    // Simulate bot response delay
    setTimeout(() => {
      const botMsg = {
        id: messages.length + 2,
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-2xl shadow-blue-500/50 flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform duration-300 z-40 animate-bounce-light"
        title="Chat with Assistant"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl shadow-blue-500/30 flex flex-col border border-blue-500/20 animate-slideInRight z-40">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-bold text-white">IDS Assistant</h3>
                <p className="text-xs text-blue-100">Always online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none'
                      : 'bg-slate-700/50 text-gray-100 rounded-bl-none border border-slate-600/50'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-700/50 p-4 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
