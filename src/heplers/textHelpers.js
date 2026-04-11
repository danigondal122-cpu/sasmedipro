// utils/textHelpers.js

// Truncate long text (email, names, etc.)
export const truncateText = (text = "", maxLength = 20) => {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// Limit to N words instead of characters
export const truncateWords = (text = "", wordLimit = 8) => {
  if (!text) return "-";
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

// Short date format
export const formatDateShort = (date) => {
  if (!date) return "-";
  const d = new Date(date);

  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};