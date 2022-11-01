const moment = require("moment");

const Log = (...args) => {
  console.info(`${moment().format("HH:mm:ss")} -`, ...args);
};

module.exports = {
  Log,
  log: {
    update: "game::updated",
    register: "game::updated",
  },
};
