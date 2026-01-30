/**
 * Generates a random 6-character alphanumeric string for game identification
 * Uses uppercase letters and numbers to avoid confusion (excludes similar chars like 0/O, 1/I)
 * 
 * @returns {string} A 6-character game code (e.g., "A3K7M2")
 */


function randomCode(): string {
  // Character set excludes ambiguous characters (0, O, 1, I, l)
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  
  return code;
}

export default randomCode