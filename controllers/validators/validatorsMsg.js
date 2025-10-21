module.exports = {
  notEmpty: (field) => `The ${field} cannot be empty.`,
  minMaxLength: (field, min, max) => {
    if (min === max) {
      return `The ${field} must have ${min} ${
        min === 1 ? "character" : "characters"
      }.`;
    } else {
      return `The ${field} must have between ${Math.min(
        min,
        max
      )} and ${Math.max(min, max)} characters.`;
    }
  },
  maxLength: (field, max) => {
    return `The ${field} must have at most ${max} ${
      max === 1 ? "character" : "characters"
    }.`;
  },
};
