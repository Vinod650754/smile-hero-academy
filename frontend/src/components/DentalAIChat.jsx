import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { askDentalAI } from '../services/aiService';

export default function DentalAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi Smile Hero! 🦷 I am Dr. Tooth Buddy AI! Ask me any question about your teeth, cavities, black marks, or brushing!' }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsThinking(true);

    const aiAnswer = await askDentalAI(userText);

    setMessages(prev => [...prev, { sender: 'ai', text: aiAnswer }]);
    setIsThinking(false);
  };

  return (
    <div style={{ position: 'absolute', bottom: '72px', right: '12px', left: '12px', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
            color: '#ffffff',
            border: '3px solid #ffffff',
            borderRadius: '99px',
            padding: '8px 16px',
            boxShadow: '0 6px 16px rgba(2, 132, 199, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: '900',
            fontSize: '11px'
          }}
        >
          <Bot size={18} />
          <span>Dr. Tooth AI</span>
        </button>
      ) : (
        <div style={{
          width: '100%',
          maxHeight: '460px',
          height: '65vh',
          background: '#ffffff',
          borderRadius: '24px',
          border: '4px solid #0284c7',
          boxShadow: '0 16px 36px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: '#0284c7',
            color: '#ffffff',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', items: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🦷</span>
              <div>
                <div style={{ fontWeight: '900', fontSize: '12px' }}>Dr. Tooth Buddy AI</div>
                <div style={{ fontSize: '9px', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Sparkles size={9} /> Dental AI Model
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', background: '#f0f9ff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 12px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: '700',
                  lineHeight: '1.45',
                  background: m.sender === 'user' ? '#0284c7' : '#ffffff',
                  color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                  border: m.sender === 'user' ? 'none' : '1px solid #e0f2fe',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#0284c7', fontWeight: '800' }}>
                <Loader2 size={14} className="animate-spin" /> Dr. Tooth is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div style={{ padding: '8px 10px', background: '#ffffff', borderTop: '1px solid #e0f2fe', display: 'flex', gap: '6px' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask any dental question..."
              style={{
                flex: 1,
                border: '1px solid #bae6fd',
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '11px',
                fontWeight: '700',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              disabled={isThinking}
              style={{ background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '12px', padding: '8px 12px', cursor: 'pointer' }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}