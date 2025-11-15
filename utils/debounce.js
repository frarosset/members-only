function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function debounceWithMaxWait(fn, delay, maxWait) {
  let timeout, start;
  return (...args) => {
    const now = Date.now();
    if (!start) start = now;

    clearTimeout(timeout);

    if (now - start >= maxWait) {
      start = null;
      fn(...args); // force call
    } else {
      timeout = setTimeout(() => {
        start = null;
        fn(...args);
      }, delay);
    }
  };
}

module.exports = { debounce, debounceWithMaxWait };
