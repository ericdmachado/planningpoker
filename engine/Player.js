const Observer = require('./Observer');

class Player extends Observer {
  
  spectator = false;
  color;
  value='';
  id;
  room;

  constructor(playerId, name = "", spectator = false) {
    super();
    this.id = playerId;
    this.color = `#${Math.random().toString(16).slice(2,8)}`;
    this.spectator = spectator;
    this.name = name;
    this.value = '';
    
    return this;
  }

  set(key, value){
    this[key] = value;
    this.dispatch('change', { key, value, player: this });
  }

  disconnect = () => {
    this.dispatch('disconnect', this);
  }
}

module.exports = Player;