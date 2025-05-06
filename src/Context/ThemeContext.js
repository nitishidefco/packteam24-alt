import React, {createContext, useContext} from 'react';
import {useSelector} from 'react-redux';
import {COLOR} from '../Config/AppStyling';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const {customizationData} = useSelector(state => state.Customization);

  const theme = {
    ...COLOR,
    PRIMARY: customizationData.app_main_color || COLOR.PURPLE,
    SECONDARY: customizationData.app_main_color || COLOR.SECONDARY,
    LOGO: customizationData.app_logo,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
