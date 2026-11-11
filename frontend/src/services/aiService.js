// Conversational AI Engine for Dr. Tooth Buddy AI
export const askDentalAI = async (query) => {
  const q = query.toLowerCase().trim();

  // 1. Interactive Casual Chat & Greetings
  if (['hello', 'hi', 'hey', 'hiya', 'sup', 'good morning', 'good evening'].some(w => q === w || q.startsWith(w + ' '))) {
    return "Hello there, Smile Hero! 🦷✨ I'm Dr. Tooth Buddy AI! How are your teeth feeling today? Asking a question or ready to brush?";
  }

  if (['how are you', 'how r u', 'how are u', 'how r you', 'how do you do'].some(w => q.includes(w))) {
    return "I'm feeling sparkling clean and super excited to help you keep your teeth healthy today! 🪥 How are you doing, superhero?";
  }

  if (['who are you', 'what is your name', 'whats your name', 'who r u'].some(w => q.includes(w))) {
    return "I am Dr. Tooth Buddy AI! 🦸‍♂️ Your personal superhero dental assistant here to answer questions, share fun tooth facts, and help you earn stars!";
  }

  if (['thank you', 'thanks', 'thx', 'ty'].some(w => q.includes(w))) {
    return "You're super welcome, Smile Hero! Keep up the amazing work keeping your smile clean! ⭐";
  }

  // 2. Specific Dental & Health Topic Intelligence
  if (q.includes('tooth bug') || q.includes('sugar bug') || q.includes('germ') || q.includes('bacteria') || q.includes('plaque')) {
    return "Tooth bugs (or sugar bugs!) are tiny invisible germs that love eating leftover sweets on your teeth. When they eat sugar, they make sticky acids that cause cavities! Brushing twice a day washes them right off! 🧼";
  }

  if (q.includes('black') || q.includes('dark') || q.includes('stain') || q.includes('spot')) {
    return "Black marks on teeth can be dark food stains or tiny cavities forming in the enamel! 🦷 Show a parent or caregiver so a friendly dentist can take a quick look and clean them right up!";
  }

  if (q.includes('cavity') || q.includes('decay') || q.includes('hole')) {
    return "A cavity is a tiny hole in a tooth caused by sugar bug acids! To avoid them: 1) Brush twice a day for 2 minutes with fluoride paste! 2) Drink fresh water. 3) Swap sticky candy for crunchy apples! 🍎";
  }

  if (q.includes('gum') || q.includes('bleed') || q.includes('blood') || q.includes('pink')) {
    return "Gums bleed when soft plaque germs rest near them for too long. Gently brushing in small circular moves along your gumline every day keeps them strong and healthy! 💖";
  }

  if (q.includes('hurt') || q.includes('pain') || q.includes('ache') || q.includes('wobble') || q.includes('loose')) {
    return "Oh no! 🦷 If a tooth hurts or wiggles, tell a grown-up right away so your dentist can help! Don't brush super hard over sore spots.";
  }

  if (q.includes('candy') || q.includes('sugar') || q.includes('sweet') || q.includes('soda') || q.includes('chocolate')) {
    return "Sugary treats are yummy, but sugar bugs love feeding on leftover sweets! Drink fresh water right after eating candy to rinse your enamel clean! 💧";
  }

  if (q.includes('how long') || q.includes('timer') || q.includes('minute')) {
    return "Dentists recommend brushing for 2 full minutes twice a day—once when you wake up and once before bedtime! ⏱️";
  }

  if (q.includes('floss')) {
    return "Flossing cleans between tight teeth where toothbrush bristles can't reach! It keeps hidden sugar bugs away. 🧵";
  }

  if (q.includes('fluoride') || q.includes('paste')) {
    return "Fluoride is like a superhero shield for your tooth enamel! It rebuilds weak spots and protects teeth against plaque acids. 🛡️";
  }

  // 3. Dynamic Generative Fallback for Open-Ended Questions
  return `That's a great question about "${query}"! 🦷 As your superhero dental assistant, I recommend brushing all 3 surfaces of your teeth for 2 minutes twice a day to stay sparkling clean! What else would you like to know? ⭐`;
};