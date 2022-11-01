import { flatten } from "lodash";

class GoogleAnalytics {
  constructor(){}

  static parseData(args){
    let data = [];
  
    if (args?.user)
      data.push(
        ...flatten(
          Object.keys(args.user).map((key) => [`user.${key}`, args.user[key]])
        )
      );
    if (args?.session) data.push("user.session", args.session);
  
    let obj = [...data]
      .filter((x, y) => y % 2 == 0)
      .reduce(
        (a, b, i) => ({ ...a, [b]: [...data].filter((x, y) => y % 2 != 0)[i] }),
        {}
      );
  
    return obj;
  }

  static gtag(...args){
    if (window.location.search.match(/debug=ui/))
      console.info('Google Analytics::', ...args);
    if(process.env.NODE_ENV == 'production') window.gtag(...args);
  }

  static register(event, data){
    GoogleAnalytics.gtag('event', event, GoogleAnalytics.parseData(data));
  }
};

export default GoogleAnalytics;
