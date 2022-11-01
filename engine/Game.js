const { Log } = require('@engine/Log');
const Player = require('@engine/Player');
const Room = require('@engine/Room');
const BSON = require('bson');
const development = process.env.NODE_ENV == 'development';
const expiresTime = development ? 300000 : 14400000; //5 minutes or 4 hours
const checkValidGameTimeout = development ? 20000 : 900000; //20 seconds or 15 minutes

class Game {
  #rooms = {};
  io;

  constructor(io) {
    this.io = io;
    return this;
  }

  hasRoom(game) {
    return game in this.#rooms;
  }

  createRoom(game) {
    this.#rooms[game] = new Room(game);
    return this.#rooms[game];
  }

  getRoom(game){
    return this.#rooms[game];
  }

  destroyRoom(game){
    delete this.#rooms[game];
  }

  start = (socket) => {
    const player = new Player( socket.id );

    socket.on('register', ({ game })=>{
      if(!game) return;

      socket.join(game);

      if (!this.hasRoom(game)) {
        this.createRoom(game);
      }
      player.set('room', game);

      this.getRoom(game).addPlayer(player);

      this.io.in(game).emit('registered', BSON.serialize(this.getRoom( game )));

      Log('CONNECT:', socket.id, 'ROOM:', game);

      socket.on('interface::data', async ( bsonData )=>{
        if( !bsonData ) return;

        const data = BSON.deserialize(bsonData), room = this.getRoom( game );

        Log('ACTION:', data.action, 'ROOM:', game);

        switch( data.action ){
          case 'start':
            room?.set('reveal', false );
            room?.reset();
          break;
          
          case 'game.title':
            room?.set('title', data.value );
          break;

          case 'reveal':
            room?.set('reveal', true );
          break;
          
          case 'user.name':
            room?.getPlayer( data.user )?.set('name', data.name );
          break;
          
          case 'vote':
            room?.getPlayer( data.user )?.set('value', data.value );
          break;

          case 'spectator':
            room?.getPlayer( data.user )?.set('spectator', data.spectator );
          break;

          case 'stop':
            if(data.admin) room?.set('destroyed', true);
            else socket.disconnect();
          break;
        }

        this.emitMessageToUsers(game);
      });

      player.on('disconnect', (player)=>{
        Log('DISCONNECT:', socket.id, 'ROOM:', game);
        this.getRoom(game)?.removePlayer(player.id);
        socket.disconnect();
      });
    });

    socket.on('disconnect', player.disconnect);
  }

  emitMessageToUsers( game ){
    this.io.in(game).emit('backend::data', BSON.serialize({action: 'change', room: this.getRoom( game )}));
  }

  logSessionsSize(){
    Log('Sessions::', Object.keys(this.#rooms).length);
  }

  checkExpired = () => {
    this.logSessionsSize();
    
    Object.values(this.#rooms)
      .filter(game=>!game.destroyed)
      .forEach(game=>{
        let expired = Date.now() >= (game.createdAt + expiresTime), 
            name = this.getGameName(game), 
            room = this.getRoom( name );
        
        Log('ROOM:', name, 'Has expired?', expired);

        if(!Object.keys(game.players).length || expired ){
          room.set('destroyed', true);
          this.emitMessageToUsers(name);
          this.checkDestroyed();
          this.logSessionsSize();
        }
      });
  }

  checkDestroyed = () => {
    Object.values(this.#rooms).forEach(game=>{
      const gameName = this.getGameName(game);
      Log('Has destroyed? ::', gameName, game.destroyed);
      if( game.destroyed ){
        this.destroyRoom(gameName);
        this.logSessionsSize();
      }
    });
  }

  getGameName( game ){
    return game.name.replace(/(public|poker|room|\-)/g, '');
  }

  checkValidGame = () => {
    this.checkExpired();
    this.checkDestroyed();
  }
  
  cronjob(){
    Log('Start cronjob');

    //Destroy inactive sessions 
    setInterval(this.checkValidGame, checkValidGameTimeout);

    this.checkValidGame();
  }
}

module.exports = Game;