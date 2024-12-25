import React from 'react';
import {COLOR} from '../../Config/AppStyling';

const initialState = {
  dark: false,
  theme: COLOR.light,
  toggle: () => {},
};
const ThemeContext = React.createContext(initialState);

function ThemeProvider({children}) {
  const [dark, setDark] = React.useState(false); // Default theme is light

  // To toggle between dark and light modes
  const toggle = () => {
    setDark(!dark);
  };

  // Filter the styles based on the theme selected
  const theme = dark ? COLOR.dark : COLOR.light;

  return (
    <ThemeContext.Provider value={{theme, dark, toggle}}>
      {children}
    </ThemeContext.Provider>
  );
}
export {ThemeProvider, ThemeContext};
