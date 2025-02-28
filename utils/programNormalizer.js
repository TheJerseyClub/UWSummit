// Program names
const CS_NAME = 'Computer Science';
const CS_BBA_NAME = 'Computer Science & Business Administration Double Degree';
const SE_NAME = 'Software Engineering';
const CE_NAME = 'Computer Engineering';
const EE_NAME = 'Electrical Engineering';
const ECE_NAME = 'Electrical Engineering';
const MECH_NAME = 'Mechanical Engineering';
const TRON_NAME = 'Mechatronics Engineering';
const SYDE_NAME = 'Systems Design Engineering';
const AFM_NAME = 'Accounting and Financial Management';
const NANO_NAME = 'Nanotechnology Engineering';
const CIVIL_NAME = 'Civil Engineering';
const CHEM_NAME = 'Chemical Engineering';
const MGMT_NAME = 'Management Engineering';
const AERO_NAME = 'Aerospace Engineering';
const ARCH_NAME = 'Architecture';
const ENV_NAME = 'Environmental Engineering';
const BIO_NAME = 'Biomedical Engineering';
const MATH_NAME = 'Mathematics';
const ACTSCI_NAME = 'Actuarial Science';
const CFM_NAME = 'Computing and Financial Management';
const STATS_NAME = 'Statistics';
const CO_NAME = 'Combinatorics and Optimization';
const PMATH_NAME = 'Pure Mathematics';
const AMATH_NAME = 'Applied Mathematics';
const BBA_NAME = 'Business Administration';
const FARM_NAME = 'Financial Analysis and Risk Management';
const GBDA_NAME = 'Global Business and Digital Arts';

// Program emojis
const CS_EMOJI = '💻🧑‍🔬';
const CS_BBA_EMOJI = '💻💼';
const SE_EMOJI = '👨‍💻🧠';
const CE_EMOJI = '🔌';
const EE_EMOJI = '⚡';
const MECH_EMOJI = '⚙️';
const TRON_EMOJI = '🤖';
const SYDE_EMOJI = '🧠💡';
const AFM_EMOJI = '💰';
const NANO_EMOJI = '🔬';
const CIVIL_EMOJI = '🏗️';
const CHEM_EMOJI = '🧑‍🔬';
const MGMT_EMOJI = '📊';
const ARCH_EMOJI = '🏛️';
const ENV_EMOJI = '🌱';
const BIO_EMOJI = '🧬';
const MATH_EMOJI = '🔢';
const ACTSCI_EMOJI = '📈';
const CFM_EMOJI = '💹';
const STATS_EMOJI = '📊';
const CO_EMOJI = '🎲';
const PMATH_EMOJI = '➗';
const AMATH_EMOJI = '📐';
const BBA_EMOJI = '💼';
const FARM_EMOJI = '📊';
const GBDA_EMOJI = '🎨';

export const PROGRAM_MAPPING = {
  // Engineering Programs
  'mechatronics engineering': { name: TRON_NAME, emoji: TRON_EMOJI },
  'mechatronics': { name: TRON_NAME, emoji: TRON_EMOJI },
  'tron': { name: TRON_NAME, emoji: TRON_EMOJI },
  'mechanical engineering': { name: MECH_NAME, emoji: MECH_EMOJI },
  'mech': { name: MECH_NAME, emoji: MECH_EMOJI },
  'software engineering': { name: SE_NAME, emoji: SE_EMOJI },
  'se': { name: SE_NAME, emoji: SE_EMOJI },
  'computer engineering': { name: CE_NAME, emoji: CE_EMOJI },
  'ce': { name: CE_NAME, emoji: CE_EMOJI },
  'comp eng': { name: CE_NAME, emoji: CE_EMOJI },
  'electrical engineering': { name: EE_NAME, emoji: EE_EMOJI },
  'ee': { name: EE_NAME, emoji: EE_EMOJI },
  'elec eng': { name: EE_NAME, emoji: EE_EMOJI },
  'ece': { name: 'Electrical & Computer Engineering', emoji: '⚡🔌' },
  'electrical and computer engineering': { name: 'Electrical & Computer Engineering', emoji: '⚡🔌' },
  'electrical & computer engineering': { name: 'Electrical & Computer Engineering', emoji: '⚡🔌' },
  'systems design engineering': { name: SYDE_NAME, emoji: SYDE_EMOJI },
  'syde': { name: SYDE_NAME, emoji: SYDE_EMOJI },
  'nanotechnology engineering': { name: NANO_NAME, emoji: NANO_EMOJI },
  'nano': { name: NANO_NAME, emoji: NANO_EMOJI },
  'civil engineering': { name: CIVIL_NAME, emoji: CIVIL_EMOJI },
  'civil': { name: CIVIL_NAME, emoji: CIVIL_EMOJI },
  'chemical engineering': { name: CHEM_NAME, emoji: CHEM_EMOJI },
  'management engineering': { name: MGMT_NAME, emoji: MGMT_EMOJI },
  'architecture': { name: ARCH_NAME, emoji: ARCH_EMOJI },
  'environmental engineering': { name: ENV_NAME, emoji: ENV_EMOJI },
  'biomedical engineering': { name: BIO_NAME, emoji: BIO_EMOJI },
  
  // Math Faculty Programs
  'computer science': { name: CS_NAME, emoji: CS_EMOJI },
  'cs': { name: CS_NAME, emoji: CS_EMOJI },
  'comp sci': { name: CS_NAME, emoji: CS_EMOJI },
  'honours computer science': { name: CS_NAME, emoji: CS_EMOJI },
  'bachelor of computer science': { name: CS_NAME, emoji: CS_EMOJI },
  'bcs': { name: CS_NAME, emoji: CS_EMOJI },
  'computer science and business administration': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'computer science & business administration': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'cs/bba': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'cs and bba': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'cs & bba': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'cs bba': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'computer science and business': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'computer science business double degree': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'cs double degree': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'laurier double degree cs': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'double degree cs': { name: CS_BBA_NAME, emoji: CS_BBA_EMOJI },
  'mathematics': { name: MATH_NAME, emoji: MATH_EMOJI },
  'math': { name: MATH_NAME, emoji: MATH_EMOJI },
  'actuarial science': { name: ACTSCI_NAME, emoji: ACTSCI_EMOJI },
  'computing and financial management': { name: CFM_NAME, emoji: CFM_EMOJI },
  'cfm': { name: CFM_NAME, emoji: CFM_EMOJI },
  'statistics': { name: STATS_NAME, emoji: STATS_EMOJI },
  'stats': { name: STATS_NAME, emoji: STATS_EMOJI },
  'combinatorics and optimization': { name: CO_NAME, emoji: CO_EMOJI },
  'co': { name: CO_NAME, emoji: CO_EMOJI },
  'pure mathematics': { name: PMATH_NAME, emoji: PMATH_EMOJI },
  'pmath': { name: PMATH_NAME, emoji: PMATH_EMOJI },
  'applied mathematics': { name: AMATH_NAME, emoji: AMATH_EMOJI },
  'amath': { name: AMATH_NAME, emoji: AMATH_EMOJI },
  
  // Business Programs
  'accounting and financial management': { name: AFM_NAME, emoji: AFM_EMOJI },
  'afm': { name: AFM_NAME, emoji: AFM_EMOJI },
  'business administration': { name: BBA_NAME, emoji: BBA_EMOJI },
  'financial analysis and risk management': { name: FARM_NAME, emoji: FARM_EMOJI },
  'farm': { name: FARM_NAME, emoji: FARM_EMOJI },
  
  // Arts & Business Programs
  'global business and digital arts': { name: GBDA_NAME, emoji: GBDA_EMOJI },
  'gbda': { name: GBDA_NAME, emoji: GBDA_EMOJI },
  'digital arts': { name: GBDA_NAME, emoji: GBDA_EMOJI },
  'global business': { name: GBDA_NAME, emoji: GBDA_EMOJI },
  
  // Common variations with honours prefix
  'honours mechanical engineering': { name: MECH_NAME, emoji: MECH_EMOJI },
  'honours software engineering': { name: SE_NAME, emoji: SE_EMOJI },
  'honours computer science': { name: CS_NAME, emoji: CS_EMOJI },
  'honours mathematics': { name: MATH_NAME, emoji: MATH_EMOJI },
  
  // Bachelor of X variations
  'bachelor of engineering': { name: 'Engineering', emoji: '⚙️' },
  'bachelor of mathematics': { name: MATH_NAME, emoji: MATH_EMOJI },
  'bachelor of computer science': { name: CS_NAME, emoji: CS_EMOJI },
  'bachelor of business administration': { name: BBA_NAME, emoji: BBA_EMOJI },
};

export const normalizeProgram = (program) => {
  if (!program) return { name: 'Not specified', emoji: '❓' };
  
  const normalizedInput = program.toLowerCase().trim();
  
  // Handle special case for Mechatronics with variations
  if (normalizedInput.includes('mechatronics') || 
      normalizedInput.includes('robotics') || 
      normalizedInput.includes('automation engineering')) {
    return { name: TRON_NAME, emoji: TRON_EMOJI };
  }
  
  // First try exact matches
  for (const [key, value] of Object.entries(PROGRAM_MAPPING)) {
    if (normalizedInput === key) {
      return value;
    }
  }
  
  // Then try word boundary matches to prevent partial word matching
  for (const [key, value] of Object.entries(PROGRAM_MAPPING)) {
    const keyWords = key.split(' ');
    const inputWords = normalizedInput.split(/[\s,]+/);
    
    // Check if all key words appear as complete words in the input
    if (keyWords.every(word => 
      inputWords.some(inputWord => inputWord === word)
    )) {
      return value;
    }
  }
  
  // If no match found but we have a program name, return it with a default emoji
  if (program) {
    // Clean up the program name
    const cleanedName = program
      .split(/[\s,]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .replace(/^Bachelor Of /i, '')
      .replace(/^Honours /i, '');
    return { name: cleanedName, emoji: '📚' };
  }
  
  // Last resort
  return { name: 'Not specified', emoji: '❓' };
}; 