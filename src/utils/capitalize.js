export function capitalizeFirstLetter(sentence) {
    if (sentence.length === 0) {
      return sentence;
    }
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }
