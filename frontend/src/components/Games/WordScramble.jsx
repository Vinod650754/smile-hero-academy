import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const WORD_DATABASE = [
  { original: 'FLOSS', hint: 'Cleans tight spaces between teeth where bristles cannot reach!' },
  { original: 'ENAMEL', hint: 'The hard superhero outer shell protecting your tooth!' },
  { original: 'SHIELD', hint: 'What fluoride builds on teeth to stop plaque acids!' },
  { original: 'CAVITY', hint: 'A tiny hole caused when sugar bugs eat sweet treats!' },
  { original: 'PLAQUE', hint: 'The sticky germ layer that gentle brushing washes away!' }
];

// Helper to shuffle letters without revealing the original word
function scrambleWord(word) {
  let arr = word.split('');
  while (arr.join('') === word) {
    arr.sort(() => Math.random() - 0.5);
  }
  return arr.join('  ');
}

export default function WordScramble({ onBack, onComplete }) {
  const [wordList, setWordList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledText, setScrambledText] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [isDone, setIsDone] = useState(false);

  const startNewDeck = () => {
    const shuffled = [...WORD_DATABASE].sort(() => Math.random() - 0.5).slice(0, 4);
    setWordList(shuffled);
    setCurrentIndex(0);
    setScrambledText(scrambleWord(shuffled[0].original));
    setInputVal('');
    setFeedback(null);
    setIsDone(false);
  };

  useEffect(() => {
    startNewDeck();
  }, []);

  const currentItem = wordList[currentIndex];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentItem || feedback) return;

    if (inputVal.trim().toUpperCase() === currentItem.original) {
      setFeedback('correct');
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });

      setTimeout(() => {
        setFeedback(null);
        setInputVal('');
        if (currentIndex + 1 < wordList.length) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          setScrambledText(scrambleWord(wordList[nextIdx].original));
        } else {
          setIsDone(true);
          onComplete(20, 'Game Explorer');
        }
      }, 900);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div className="bubbly-card" style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#0284c7', fontSize: '14px' }}>🔤 Word Scramble</div>
      </div>

      {!isDone ? (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px' }}>
            <span>Word {currentIndex + 1} of {wordList.length}</span>
            <span style={{ color: '#0284c7' }}>⭐ Reward: 20 Stars</span>
          </div>

          <div style={{
            background: feedback === 'correct' ? '#dcfce7' : feedback === 'wrong' ? '#fee2e2' : '#f0f9ff',
            border: `3px solid ${feedback === 'correct' ? '#22c55e' : feedback === 'wrong' ? '#ef4444' : '#bae6fd'}`,
            borderRadius: '20px',
            padding: '20px 14px',
            marginBottom: '14px',
            transition: 'all 0.2s ease'
          }}>
            {/* Scrambled Letters Display */}
            <div style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '0.25em', color: '#0284c7' }}>
              {scrambledText}
            </div>

            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginTop: '10px' }}>
              💡 Hint: {currentItem?.hint}
            </div>
          </div>

          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Type your answer here..."
            style={{
              padding: '12px 16px',
              border: '3px solid #bae6fd',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '900',
              outline: 'none',
              width: '85%',
              marginBottom: '12px',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}
          />
          <br />
          <button type="submit" className="bubbly-btn-primary" style={{ width: 'auto', padding: '10px 28px' }}>
            SUBMIT ANSWER
          </button>
        </form>
      ) : (
        <div style={{ padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🎉</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>All Words Unscrambled!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#15803d', margin: '6px 0 16px 0' }}>+20 ⭐ Stars Earned!</div>
          <button className="bubbly-btn-primary" onClick={startNewDeck} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px' }}>
            <RotateCcw size={16} /> Play Fresh Deck 🔄
          </button>
        </div>
      )}
    </div>
  );
}