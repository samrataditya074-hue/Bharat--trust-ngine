// src/utils/legalLogic.js

/**
 * Applies the Limitation Act, 1963 to calculate the statutory deadline for appeals.
 * 
 * @param {string} orderDate - ISO string or Date object of the judgment/order.
 * @param {string} caseType - The type of case/appeal (e.g., 'High Court Appeal', 'Supreme Court Appeal').
 * @returns {object} - Contains the deadline Date object, total days allowed, and days remaining.
 */
export const calculateLimitationDate = (orderDate, caseType) => {
  const dateOfOrder = new Date(orderDate);
  let daysAllowed = 30; // default for many civil suits

  // Hardcoded logic based on Limitation Act, 1963
  if (caseType.toLowerCase().includes('high court appeal')) {
    daysAllowed = 90;
  } else if (caseType.toLowerCase().includes('supreme court')) {
    daysAllowed = 60; // Just an example, Supreme Court usually has different periods
  }

  const deadline = new Date(dateOfOrder);
  deadline.setDate(deadline.getDate() + daysAllowed);

  const today = new Date(); // In a real app, this would just be new Date()
  
  // For hackathon demo purposes, if orderDate is today, we simulate a ticking clock
  const timeDiff = deadline.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return {
    deadline,
    daysAllowed,
    daysRemaining,
    isUrgent: daysRemaining <= 7 && daysRemaining >= 0,
    isExpired: daysRemaining < 0
  };
};
