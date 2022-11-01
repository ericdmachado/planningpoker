import moment from 'moment';

const DEVELOPMENT = process.env.NODE_ENV != 'production';
const searchParams = new URLSearchParams(window.location.search);
const DEBUG = searchParams.get('debug') === "ui";
const oldConsole = window.console;

const debug = (type, args) => {
  if( DEVELOPMENT || DEBUG ) oldConsole[type](`${moment().format("HH:mm:ss")} -`, ...args);
}

const Console = {
  info(...args) {
    debug('info', args);
  },
  warn(...args){
    debug('warn', args);
  },
  log(...args){
    debug('log', args);
  }, 
  error(...args){
    debug('error', args);
  }
};

window.console = Console;

export default Console;