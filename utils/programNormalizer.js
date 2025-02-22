// Program names
const CS_NAME = 'Computer Science';
const SE_NAME = 'Software Engineering';
const ECE_NAME = 'Electrical Engineering';
const MECH_NAME = 'Mechanical Engineering';
const SYDE_NAME = 'Systems Design Engineering';

// Program emojis
const CS_EMOJI = '💻';
const SE_EMOJI = '⚡';
const ECE_EMOJI = '⚡';
const MECH_EMOJI = '⚙️';
const SYDE_EMOJI = '🎯';

export const PROGRAM_MAPPING = {
  'cs': { name: CS_NAME, emoji: CS_EMOJI },
  'computer science': { name: CS_NAME, emoji: CS_EMOJI },
  'se': { name: SE_NAME, emoji: SE_EMOJI },
  'software engineering': { name: SE_NAME, emoji: SE_EMOJI },
  'ece': { name: ECE_NAME, emoji: ECE_EMOJI },
  'electrical engineering': { name: ECE_NAME, emoji: ECE_EMOJI },
  'honours electrical engineering': { name: ECE_NAME, emoji: ECE_EMOJI },
  'mechanical engineering': { name: MECH_NAME, emoji: MECH_EMOJI },
  'mech eng': { name: MECH_NAME, emoji: MECH_EMOJI },
  'systems design engineering': { name: SYDE_NAME, emoji: SYDE_EMOJI },
  'syde': { name: SYDE_NAME, emoji: SYDE_EMOJI },
  'honours systems design engineering': { name: SYDE_NAME, emoji: SYDE_EMOJI },
  'honours syde': { name: SYDE_NAME, emoji: SYDE_EMOJI },
  'honours software engineering': { name: SE_NAME, emoji: SE_EMOJI },
  'honours se': { name: SE_NAME, emoji: SE_EMOJI },
  'honours computer science': { name: CS_NAME, emoji: CS_EMOJI },
  'honours cs': { name: CS_NAME, emoji: CS_EMOJI },
  // Add more mappings as needed
};

export const normalizeProgram = (program) => {
  if (!program) return { name: 'Not specified', emoji: '❓' };
  
  const normalizedInput = program.toLowerCase().trim();
  
  // Check for direct matches
  for (const [key, value] of Object.entries(PROGRAM_MAPPING)) {
    if (normalizedInput.includes(key)) {
      return value;
    }
  }
  
  // If no match found, return original with a default emoji
  return { name: program, emoji: '📚' };
}; 