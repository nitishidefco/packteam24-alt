import {useEffect, useState} from 'react';

let globalState = false;

const listeners = new Set();

const setSignedin = nextGlobalState => {
  globalState = nextGlobalState;
  listeners.forEach(listener => listener());
};

export const useSignedIn = () => {
  const [isSignedin, setState] = useState(globalState);
  useEffect(() => {
    const listener = () => {
      setState(globalState);
    };
    listeners.add(listener);
    listener(); // in case it's already changed
    return () => listeners.delete(listener); // cleanup
  }, []);
  return {isSignedin, setSignedin};
};
