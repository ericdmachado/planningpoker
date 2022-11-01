class Observer {
  #events = {};

  constructor() {}

  disconnect() {
    this.dispatch('disconnect', this);
  }

  on(event, callback) {
    if(!this.#events[event]) this.#events[event] = [];
    this.#events[event].push(callback);
  }

  dispatch(event, data) {
    if(event in this.#events)
      Object.values(this.#events[event]).forEach((event) => event.call(this, data));
  }
}

module.exports = Observer;