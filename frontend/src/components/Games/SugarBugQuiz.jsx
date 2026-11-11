import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const QUESTION_POOL = [
  { q: 'How long should you brush your teeth twice a day?', options: ['30 seconds', '1 minute', '2 full minutes', '5 minutes'], correct: 2, tip: 'Dentists recommend 2 full minutes for a complete clean!' },
  { q: 'What should you drink after eating sugary treats?', options: ['Soda', 'Fresh Water', 'Fruit Juice', 'Milkshake'], correct: 1, tip: 'Fresh water washes away leftover sugar bugs and acids!' },
  { q: 'What does fluoride do for your teeth?', options: ['Acts like a superhero shield', 'Makes teeth sticky', 'Feeds sugar bugs', 'Makes teeth soft'], correct: 0, tip: 'Fluoride strengthens tooth enamel against plaque acids!' },
  { q: 'How often should you replace your toothbrush?', options: ['Every week', 'Every 3 to 4 months', 'Once a year', 'Never'], correct: 1, tip: 'Fresh bristles clean plaque much better than worn ones!' },
  { q: 'When is the most important time to brush besides morning?', options: ['Before lunch', 'Right before bedtime', 'After playing', 'At midnight'], correct: 1, tip: 'Bedtime brushing protects teeth from sugar bugs overnight!' }
];

export default function SugarBugQuiz({ onBack, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const startQuiz = () => {
    const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5).slice(0, 4);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsComplete(false);
  };

  useEffect(() => {
    startQuiz();
  }, []);

  const handleSelect = (optIdx) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);

    const currentQ = questions[currentIndex];
    const isCorrect = optIdx === currentQ.correct;
    const updatedScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(updatedScore);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
      } else {
        setIsComplete(true);
        onComplete(updatedScore * 5, 'Sugar Bug Buster');
      }
    }, 1200);
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="bubbly-card" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontWeight: '900', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ fontWeight: '900', color: '#7e22ce', fontSize: '14px' }}>🧠 Sugar Bug Quiz</div>
      </div>

      {!isComplete ? (
        <div>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', marginBottom: '4px' }}>Question {currentIndex + 1} of {questions.length}</div>
          <div style={{ fontSize: '14px', fontWeight: '900', color: '#1e293b', marginBottom: '14px' }}>{currentQ?.q}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {currentQ?.options.map((opt, i) => {
              let bg = '#ffffff', border = '#bae6fd';
              if (selectedOption !== null) {
                if (i === currentQ.correct) { bg = '#dcfce7'; border = '#22c55e'; }
                else if (i === selectedOption) { bg = '#fee2e2'; border = '#ef4444'; }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: bg,
                    border: `2px solid ${border}`,
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#1e293b',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div style={{ background: '#f3e8ff', padding: '10px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', color: '#6b21a8' }}>
              💡 Tip: {currentQ?.tip}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🧠</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b', marginTop: '6px' }}>Quiz Finished!</div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#7e22ce', margin: '6px 0 16px 0' }}>Score: {score} / {questions.length}! +{score * 5} ⭐ Stars!</div>
          <button className="bubbly-btn-primary" onClick={startQuiz} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '12px 24px', background: 'linear-gradient(180deg, #c084fc 0%, #7e22ce 100%)' }}>
            <RotateCcw size={16} /> Try Fresh Questions
          </button>
        </div>
      )}
    </div>
  );
}