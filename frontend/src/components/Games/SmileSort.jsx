import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

// Dynamic Pool of Foods for high replayability
const FOOD_DATABASE = [
  { id: 1, name: 'Crispy Apple', type: 'healthy', emoji: '🍎', fact: 'Apples scrub teeth clean like natural brushes!' },
  { id: 2, name: 'Fizzy Soda', type: 'sugary', emoji: '🥤', fact: 'Soda has sugars and acids that wear down enamel.' },
  { id: 3, name: 'Fresh Water', type: 'healthy', emoji: '💧', fact: 'Water washes away food bugs and plaque acids!' },
  { id: 4, name: 'Sticky Toffee', type: 'sugary', emoji: '🍬', fact: 'Sticky candy gets trapped inside tooth grooves.' },
  { id: 5, name: 'Crunchy Carrot', type: 'healthy', emoji: '🥕', fact: 'Crunchy veggies stimulate saliva to protect teeth.' },
  { id: 6, name: 'Sugary Donut', type: 'sugary', emoji: '🍩', fact: 'Donuts feed sugar bugs that cause cavities.' },
  { id: 7, name: 'Fresh Milk', type: 'healthy', emoji: '🥛', fact: 'Milk is rich in calcium for strong tooth bones!' },
  { id: 8, name: 'Lollipop', type: 'sugary', emoji: '🍭', fact: 'Lollipops bathe teeth in sugar for a long time.' },
  { id: 9, name: 'Strawberries', type: 'healthy', emoji: '🍓', fact: 'Packed with vitamins to keep gums healthy & strong!' },
  { id: 10, name: 'Gummy Worms', type: 'sugary', emoji: '🪱', fact: 'Gummies stick tightly between tight tooth gaps.' },
  { id: 11, name: 'Broccoli', type: 'healthy', emoji: '🥦', fact: 'Full of calcium and minerals to build strong teeth!' },
  { id: 12, name: 'Chocolate Bar', type: 'sugary', emoji: '🍫', fact: 'Rinse with fresh water right after eating chocolate!' }
];

export default function SmileSort({ onBack, onComplete }) {
  const [foodQueue, setFoodQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [isComplete, setIsComplete] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Initialize randomized 8-item food deck
  const startNewGame = () => {
    const shuffled = [...FOOD_DATABASE]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
    setFoodQueue(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    setAnimating(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const currentItem = foodQueue[currentIndex];

  const handleSortChoice = (choiceType) => {
    if (animating || !currentItem) return;
    setAnimating(true);

    const isCorrect = choiceType === currentItem.type;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setAnimating(false);
      if (currentIndex + 1 < foodQueue.length) {
        setCurrentIndex(i => i + 1);
      } else {
        setIsComplete(true);
        const finalScore = isCorrect ? score + 1 : score;
        onComplete(finalScore * 4, 'Game Explorer');
      }
    }, 900);
  };

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#059669', fontSize: '14px' }}>🥦 Smile Sort</div>
      </div>

      {!isComplete ? (
        <div>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '10px' }}>
            <span>Item {currentIndex + 1} of {foodQueue.length}</span>
            <span style={{ color: '#059669' }}>⭐ Score: {score}</span>
          </div>

          {/* Interactive Animated Food Card */}
          <div style={{
            background: feedback === 'correct' ? '#dcfce7' : feedback === 'wrong' ? '#fee2e2' : '#f0f9ff',
            border: `3px solid ${feedback === 'correct' ? '#22c55e' : feedback === 'wrong' ? '#ef4444' : '#bae6fd'}`,
            borderRadius: '24px',
            padding: '20px 14px',
            marginBottom: '16px',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: feedback ? 'scale(1.04)' : 'scale(1)'
          }}>
            {/* Feedback Pop Indicator */}
            {feedback && (
              <div style={{ position: 'absolute', top: '10px', right: '14px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '11px', color: feedback === 'correct' ? '#15803d' : '#b91c1c' }}>
                {feedback === 'correct' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                {feedback === 'correct' ? 'GREAT CHOICE!' : 'SUGAR BUG ALERT!'}
              </div>
            )}

            {/* Food Emoji */}
            <div style={{
              fontSize: '4.5rem',
              filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.12))',
              transition: 'transform 0.2s ease',
              transform: animating ? 'translateY(-6px)' : 'none'
            }}>
              {currentItem?.emoji}
            </div>

            {/* Food Name */}
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>
              {currentItem?.name}
            </div>

            {/* Fact Tip */}
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', marginTop: '6px', minHeight: '28px' }}>
              {currentItem?.fact}
            </div>
          </div>

          {/* Sorting Choice Baskets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => handleSortChoice('healthy')}
              disabled={animating}
              style={{
                background: 'linear-gradient(180deg, #34d399 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '14px',
                fontWeight: '900',
                fontSize: '13px',
                boxShadow: '0 6px 14px rgba(5, 150, 105, 0.3)',
                cursor: animating ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'transform 0.1s active'
              }}
            >
              <span style={{ fontSize: '1.6rem' }}>🦷</span>
              TOOTH HERO
            </button>

            <button
              onClick={() => handleSortChoice('sugary')}
              disabled={animating}
              style={{
                background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '14px',
                fontWeight: '900',
                fontSize: '13px',
                boxShadow: '0 6px 14px rgba(220, 38, 38, 0.3)',
                cursor: animating ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'transform 0.1s active'
              }}
            >
              <span style={{ fontSize: '1.6rem' }}>🦠</span>
              SUGAR BUG
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🏆</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Sorting Completed!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#059669', margin: '6px 0 16px 0' }}>
            You scored {score} / {foodQueue.length}! +{score * 4} ⭐ Stars!
          </div>
          <button
            className="bubbly-btn-primary"
            onClick={startNewGame}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px', background: 'linear-gradient(180deg, #34d399 0%, #059669 100%)' }}
          >
            <RotateCcw size={16} /> Play Again 🔄
          </button>
        </div>
      )}
    </div>
  );
}