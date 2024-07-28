export function capitalizeFirstAndLast(sentence) {
    // Split the sentence into words
    const words = sentence.trim().split(" ");
    
    // Check if there are enough words
    if (words.length < 2) {
      return "Sentence must contain at least two words.";
    }
    
    // Get the first and last words
    const firstWord = words[0];
    const lastWord = words[words.length - 1];
    
    // Get the first letter of the first and last words and capitalize them
    const firstLetter = firstWord.charAt(0).toUpperCase();
    const lastLetter = lastWord.charAt(0).toUpperCase();
    
    // Return the result
    return firstLetter + lastLetter;
  }