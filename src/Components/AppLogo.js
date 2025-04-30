import React from 'react';
import {Image} from 'react-native';
import {useSelector} from 'react-redux';
import {Images} from '../Config';

const AppLogo = ({style, resizeMode = 'contain'}) => {
  const {customizationData} = useSelector(state => state.Customization);

  const logoSource = customizationData.app_logo
    ? {uri: customizationData.app_logo}
    : Images.NEW_APP_LOGO;

  return <Image source={logoSource} style={style} resizeMode={resizeMode} />;
};

export default AppLogo;
