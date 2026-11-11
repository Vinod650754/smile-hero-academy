export const DENTAL_GAMES_DATABASE = [
  { id: 'g1', title: 'Smile Sort', category: 'Nutrition', emoji: '🥦', color: 'bg-emerald-500', stars: 15, desc: 'Sort healthy foods vs sugary teeth-bugs!' },
  { id: 'g2', title: 'Memory Match', category: 'Puzzle', emoji: '🂠', color: 'bg-indigo-500', stars: 20, desc: 'Flip and match hidden tooth hero pairs!' },
  { id: 'g3', title: 'Plaque Hunter', category: 'Action', emoji: '🧼', color: 'bg-cyan-500', stars: 15, desc: 'Tap and clean dirty plaque spots before time runs out!' },
  { id: 'g4', title: 'Myth Busters', category: 'Trivia', emoji: '💡', color: 'bg-amber-500', stars: 10, desc: 'Bust common dental myths with true/false cards!' },
  { id: 'g5', title: 'Gum Shield', category: 'Care', emoji: '🛡️', color: 'bg-rose-500', stars: 15, desc: 'Protect sensitive gums with gentle brushing choices!' },
  { id: 'g6', title: 'Floss Runner', category: 'Skill', emoji: '🧵', color: 'bg-purple-500', stars: 20, desc: 'Guide floss between tight teeth to clean hidden gaps!' },
  { id: 'g7', title: 'Fluoride Blast', category: 'Action', emoji: '⚡', color: 'bg-blue-500', stars: 15, desc: 'Zap sugar bugs using enamel-strengthening fluoride shields!' },
  { id: 'g8', title: 'Enamel Builder', category: 'Puzzle', emoji: '🧱', color: 'bg-teal-500', stars: 25, desc: 'Stack calcium & water blocks to reinforce tooth strength!' },
  { id: 'g9', title: 'Cavity Dodge', category: 'Arcade', emoji: '👾', color: 'bg-pink-500', stars: 20, desc: 'Dodge sticky candy monsters & drink crisp fresh water!' },
  { id: 'g10', title: 'Rinse Master', category: 'Timing', emoji: '🌊', color: 'bg-sky-500', stars: 15, desc: 'Time your mouthwash swishes to eliminate bacteria!' },
  { id: 'g11', title: 'Tooth Inspector', category: 'Observation', emoji: '🔍', color: 'bg-violet-500', stars: 15, desc: 'Spot missing brush spots on 3D tooth models!' },
  { id: 'g12', title: 'Night Guard', category: 'Habits', emoji: '🌙', color: 'bg-slate-700', stars: 20, desc: 'Log bedtime brushing routine to protect teeth overnight!' }
];

// Seeded Pseudo-Random Daily Shuffler
export function getDailyShuffledGames() {
  const todayStr = new Date().toISOString().split('T')[0];
  let seed = 0;
  for (let i = 0; i < todayStr.length; i++) seed += todayStr.charCodeAt(i);

  const array = [...DENTAL_GAMES_DATABASE];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor((seed * (i + 1)) % array.length);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}