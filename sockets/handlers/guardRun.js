const guardRun = ({ handler, props }) => {
  try {
    return handler(props);
  } catch (error) {
    handleError(props.socket, error);
  }
};

module.exports = guardRun;
