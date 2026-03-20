// Utility functions for the LinkedIn Message Generator

export const getCharacterCount = (text) => {
  return text.length;
};

export const getWordCount = (text) => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const validateConnectionRequest = (text) => {
  const charCount = getCharacterCount(text);
  return {
    isValid: charCount <= 300,
    charCount,
    exceedsLimit: charCount > 300,
    nearLimit: charCount > 250 && charCount <= 300
  };
};

export const validateDirectMessage = (text) => {
  const wordCount = getWordCount(text);
  return {
    wordCount,
    isOptimal: wordCount >= 80 && wordCount <= 150,
    tooLong: wordCount > 150
  };
};