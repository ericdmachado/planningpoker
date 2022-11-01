const Observer = require('./Observer');

class Room extends Observer{

  name;
  title='';
  players = {};
  reveal = false;
  destroyed = false;
  createdAt = 0;

  constructor( name ){
    super();
    this.name = `public-poker-room-${name}`;
    this.createdAt = Date.now();
    return this;
  }

  addPlayer(player){
    this.players[player.id] = player;
  }

  removePlayer(player){
    delete this.players[player];
  }

  getPlayer = ( playerId ) => {
    return this.players[ playerId ];
  }

  set(key, value){
    this[key] = value;
    this.dispatch('change', { key, value });
  }

  reset = () => {
    Object.values(this.players).forEach(player=>player.set('value', ''));
  }
}

module.exports = Room;