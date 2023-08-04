function devLog(...params) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...params);
  }
}

module.exports = devLog;
