import { uniq } from "lodash";

const System = {
  fibonacci(n){
    var i = 2, fib = [0, 1];
    for (i; i <= n; i++) fib[i] = fib[i - 2] + fib[i - 1];
    return [...uniq(fib)].sort((a, b)=>(a-b));
  }
};

export default System;