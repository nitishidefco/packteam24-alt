import {StyleSheet} from 'react-native';

import Matrics from './Matrics';
import COLOR from './colors';
import typography from './typography';

const styles = StyleSheet.create({
  flexone: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  backIcon: {
    height: Matrics.ms(18),
    width: Matrics.ms(18),
    tintColor: COLOR.WHITE,
  },
  shadow: {
    shadowColor: COLOR.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  shadowUp: {
    shadowColor: COLOR.PRIMARY,
    shadowOffset: {width: Matrics.s(0), height: Matrics.vs(5)},
    shadowRadius: Matrics.mvs(20),
    shadowOpacity: 0.2,
    elevation: Matrics.vs(5),
  },
  root: {
    marginHorizontal: Matrics.ms(15),
    marginTop: Matrics.ms(15),
    flex: 1,
  },
  rootTop: {
    marginTop: Matrics.ms(15),
    flex: 1,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: Matrics.ms(10),
    textTransform: 'uppercase',
    fontFamily: typography.fontFamily.RobotoSlab.Light,
    fontSize: typography.fontSizes.fs12,
    color: COLOR.GRAY4,
    textAlign: 'center',
  },
  emptyTextDesc: {
    marginTop: Matrics.ms(10),
    fontFamily: typography.fontFamily.RobotoSlab.Light,
    fontSize: typography.fontSizes.fs12,
    color: COLOR.GRAY4,
  },
  flexGrow: {
    flexGrow: 1,
  },
  shadowColor: shadowColor => ({
    shadowColor: shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  }),
});

export default styles;
