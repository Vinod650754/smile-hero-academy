import React, { useState, useRef, useEffect } from 'react';

const QUICK_PROMPTS = [
  '🪥 How long should I brush?',
  '🍬 Why do sugar bugs hurt teeth?',
  '🧵 How do I floss properly?',
  '🛡️ What does fluoride do?',
];

// Conversational AI Engine for Dr. Tooth Buddy AI
const askDentalAI = async (query) => {
  const q = query.toLowerCase().trim();

  // 1. Interactive Casual Chat & Greetings
  if (['hello', 'hi', 'hey', 'hiya', 'sup', 'good morning', 'good evening'].some((w) => q === w || q.startsWith(w + ' '))) {
    return "Hello there, Smile Hero! 🦷✨ I'm Dr. Tooth Buddy AI! How are your teeth feeling today? Asking a question or ready to brush?";
  }

  if (['how are you', 'how r u', 'how are u', 'how r you', 'how do you do'].some((w) => q.includes(w))) {
    return "I'm feeling sparkling clean and super excited to help you keep your teeth healthy today! 🪥 How are you doing, superhero?";
  }

  if (['who are you', 'what is your name', 'whats your name', 'who r u'].some((w) => q.includes(w))) {
    return "I am Dr. Tooth Buddy AI! 🦸‍♂️ Your personal superhero dental assistant here to answer questions, share fun tooth facts, and help you earn stars!";
  }

  if (['thank you', 'thanks', 'thx', 'ty'].some((w) => q.includes(w))) {
    return "You're super welcome, Smile Hero! Keep up the amazing work keeping your smile clean! ⭐";
  }

  // 2. Specific Dental & Health Topic Intelligence
  if (q.includes('tooth bug') || q.includes('sugar bug') || q.includes('germ') || q.includes('bacteria') || q.includes('plaque')) {
    return 'Tooth bugs (or sugar bugs!) are tiny invisible germs that love eating leftover sweets on your teeth. When they eat sugar, they make sticky acids that cause cavities! Brushing twice a day washes them right off! 🧼';
  }

  if (q.includes('black') || q.includes('dark') || q.includes('stain') || q.includes('spot')) {
    return 'Black marks on teeth can be dark food stains or tiny cavities forming in the enamel! 🦷 Show a parent or caregiver so a friendly dentist can take a quick look and clean them right up!';
  }

  if (q.includes('cavity') || q.includes('decay') || q.includes('hole')) {
    return 'A cavity is a tiny hole in a tooth caused by sugar bug acids! To avoid them: 1) Brush twice a day for 2 minutes with fluoride paste! 2) Drink fresh water. 3) Swap sticky candy for crunchy apples! 🍎';
  }

  if (q.includes('gum') || q.includes('bleed') || q.includes('blood') || q.includes('pink')) {
    return 'Gums bleed when soft plaque germs rest near them for too long. Gently brushing in small circular moves along your gumline every day keeps them strong and healthy! 💖';
  }

  if (q.includes('hurt') || q.includes('pain') || q.includes('ache') || q.includes('wobble') || q.includes('loose')) {
    return "Oh no! 🦷 If a tooth hurts or wiggles, tell a grown-up right away so your dentist can help! Don't brush super hard over sore spots.";
  }

  if (q.includes('candy') || q.includes('sugar') || q.includes('sweet') || q.includes('soda') || q.includes('chocolate')) {
    return 'Sugary treats are yummy, but sugar bugs love feeding on leftover sweets! Drink fresh water right after eating candy to rinse your enamel clean! 💧';
  }

  if (q.includes('how long') || q.includes('timer') || q.includes('minute')) {
    return 'Dentists recommend brushing for 2 full minutes twice a day—once when you wake up and once before bedtime! ⏱️';
  }

  if (q.includes('floss')) {
    return "Flossing cleans between tight teeth where toothbrush bristles can't reach! It keeps hidden sugar bugs away. 🧵";
  }

  if (q.includes('fluoride') || q.includes('paste')) {
    return 'Fluoride is like a superhero shield for your tooth enamel! It rebuilds weak spots and protects teeth against plaque acids. 🛡️';
  }

  // 3. Dynamic Generative Fallback for Open-Ended Questions
  return `That's a great question about "${query}"! 🦷 As your superhero dental assistant, I recommend brushing all 3 surfaces of your teeth for 2 minutes twice a day to stay sparkling clean! What else would you like to know? ⭐`;
};

export default function DentalAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello there, Smile Hero! 🦷✨ I'm Dr. Tooth Buddy AI! Ask me anything about brushing, sugar bugs, or keeping your teeth sparkling clean!",
    },
  ]);

  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (rawText) => {
    const text = (rawText ?? input).trim();
    if (!text) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      const replyText = await askDentalAI(text);
      setMessages((prev) => [...prev, { sender: 'bot', text: replyText }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Bottom-Right Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '82px',
          zIndex: 999,
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          color: '#ffffff',
          border: '1.5px solid rgba(255, 255, 255, 0.85)',
          borderRadius: '99px',
          padding: '11px 18px',
          fontWeight: 900,
          fontSize: '0.92rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 12px 28px rgba(2, 132, 199, 0.35)',
          cursor: 'pointer',
        }}
      >
        <span>🤖</span>
        <span>Dr. Tooth AI</span>
      </button>

      {/* Single-Click Full Chat Modal */}
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(15, 42, 68, 0.32)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(24px) saturate(185%)',
              WebkitBackdropFilter: 'blur(24px) saturate(185%)',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              borderRadius: '28px',
              boxShadow: '0 24px 54px rgba(15, 42, 68, 0.22)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #e0f2fe, #ccfbf1)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.45rem' }}>🦷</span>
                <div>
                  <div style={{ fontWeight: 900, color: '#102a43', fontSize: '1rem' }}>
                    Ask Dr. Tooth AI
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0d9488' }}>
                    ● Online Smile Coach
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Dr. Tooth AI"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '99px',
                  border: '1px solid rgba(16, 42, 67, 0.12)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#102a43',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Body */}
            <div
              style={{
                padding: '16px',
                maxHeight: '290px',
                minHeight: '200px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '84%',
                    padding: '11px 15px',
                    borderRadius:
                      m.sender === 'user'
                        ? '20px 20px 6px 20px'
                        : '20px 20px 20px 6px',
                    background:
                      m.sender === 'user'
                        ? 'linear-gradient(135deg, #0d9488, #0284c7)'
                        : '#ffffff',
                    color: m.sender === 'user' ? '#ffffff' : '#102a43',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    lineHeight: 1.45,
                    boxShadow: '0 6px 16px rgba(16, 42, 67, 0.07)',
                  }}
                >
                  {m.text}
                </div>
              ))}
              {isTyping && (
                <div style={{ fontSize: '0.8rem', color: '#60758a', fontWeight: 700 }}>
                  Dr. Tooth is thinking... 🪥
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick Tap Chips */}
            <div
              style={{
                padding: '0 16px 10px',
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
              }}
            >
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  style={{
                    background: 'rgba(224, 242, 254, 0.85)',
                    border: '1px solid #bae6fd',
                    color: '#0369a1',
                    borderRadius: '99px',
                    padding: '6px 11px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              style={{
                padding: '12px 16px 16px',
                display: 'flex',
                gap: '8px',
                borderTop: '1px solid rgba(16, 42, 67, 0.08)',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Dr. Tooth a question..."
                style={{
                  flex: 1,
                  borderRadius: '99px',
                  border: '1.5px solid #cbd5e1',
                  padding: '10px 16px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  outline: 'none',
                  background: '#ffffff',
                }}
              />
              <button
                type="submit"
                className="bb-btn bb-btn--primary"
                style={{ padding: '10px 18px', fontWeight: 900 }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}