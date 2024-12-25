import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import {ICON, Images} from '../../Config';
import {AppStyle, COLOR, Matrics, typography} from '../../Config/AppStyling';
import {TouchableOpacityComp} from '../HOC';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';

const DropdownMenu = ({
  data = [],
  onChange = () => {},
  value = '',
  labelField = '',
  valueField = '',
  placeholder = '',
  containerStyle = {},
  placeholderStyle = {},
  itemContainerStyle = {},
  renderItem,
  maxHeight,
  multiSelect = false,
  changePlaceholderStyle = false,
  dropdownMinHeight = Matrics.s(50),
  dropdownMaxHeight = Matrics.s(100),
  dropdownPosition = 'auto',
  refProp,
  dropdownStyle,
  inputStyle = {},
  leftIcon,
}) => {
  const [isFocus, setFocus] = useState(false);

  return (
    <View style={containerStyle && containerStyle}>
      {multiSelect == true ? (
        <MultiSelect
          ref={refProp}
          data={data}
          renderItem={renderItem}
          onChange={onChange}
          value={value}
          placeholder={placeholder?.toString()}
          placeholderStyle={
            changePlaceholderStyle
              ? [STYLES.itemTextStyle]
              : [STYLES.placeholderStyle, placeholderStyle && placeholderStyle]
          }
          search={false}
          maxHeight={maxHeight}
          labelField={labelField}
          valueField={valueField}
          containerStyle={STYLES.containerStyle}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          visibleSelectedItem={false}
          autoScroll={false}
          style={[
            STYLES.dropdown,
            {minHeight: dropdownMinHeight, maxHeight: dropdownMaxHeight},
            isFocus && {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
            isFocus && Platform.OS == 'ios' && {borderBottomWidth: 0},
          ]}
          selectedTextStyle={STYLES.selectedText}
          renderRightIcon={() => (
            <Image
              source={ICON.ARROWDOWN}
              style={isFocus && {transform: [{rotate: '180deg'}]}}
            />
          )}
          showsVerticalScrollIndicator={false}
          activeColor={COLOR.DROPDOWNBG}
          itemTextStyle={STYLES.itemTextStyle}
          itemContainerStyle={itemContainerStyle}
        />
      ) : (
        <Dropdown
          ref={refProp}
          data={data}
          renderItem={renderItem}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          placeholderStyle={
            changePlaceholderStyle
              ? [STYLES.itemTextStyle]
              : [STYLES.placeholderStyle, placeholderStyle && placeholderStyle]
          }
          search={false}
          maxHeight={maxHeight}
          labelField={labelField}
          valueField={valueField}
          containerStyle={STYLES.containerStyle}
          dropdownPosition={dropdownPosition}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoScroll={false}
          style={[
            dropdownStyle,
            STYLES.dropdown,
            // isFocus && {
            //   borderBottomLeftRadius: 0,
            //   borderBottomRightRadius: 0,
            // },
            // isFocus && Platform.OS == 'ios' && {borderBottomWidth: 0},
          ]}
          selectedTextStyle={[STYLES.selectedText, inputStyle]}
          renderRightIcon={() => (
            <Image
              source={Images.DOWNARROW}
              style={isFocus && {transform: [{rotate: '180deg'}]}}
            />
          )}
          renderLeftIcon={() => (
            <Image
              source={leftIcon}
              style={leftIcon ? {marginRight: Matrics.vs(5)} : null}
            />
          )}
          showsVerticalScrollIndicator={false}
          activeColor={COLOR.DROPDOWNBG}
          itemTextStyle={STYLES.itemTextStyle}
          itemContainerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: COLOR.UNDERLINE,
            overflow: 'hidden',
            // borderRadius: Matrics.ms(10),
          }}
        />
      )}
    </View>
  );
};

export default React.memo(DropdownMenu);
const STYLES = StyleSheet.create({
  dropdown: {
    borderBottomWidth: Matrics.ms(1),
    borderBottomColor: COLOR.UNDERLINE,
    width: '100%',
    paddingTop: Matrics.ms(5),
    paddingBottom: Matrics.ms(5),
    paddingRight: Matrics.ms(5),
  },
  containerStyle: {
    // borderBottomWidth: Matrics.ms(1),
    backgroundColor: COLOR.DROPDOWNBG,
    marginTop: Matrics.ms(5),
    borderRadius: Matrics.ms(10),
    overflow: 'hidden',
    ...AppStyle.shadowBlack,
  },
  placeholderStyle: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs15,
    color: COLOR.PLACEHOLDER,
    fontWeight: '500',
  },
  selectedText: {
    // paddingVertical: Matrics.ms(11),
    // textTransform: 'capitalize',
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs15,
    color: COLOR.APPBLACK,
    fontWeight: '500',
  },
  itemTextStyle: {
    fontFamily: typography.fontFamily.Montserrat.Regular,
    fontSize: typography.fontSizes.fs15,
    color: COLOR.APPBLACK,
    fontWeight: '500',
  },
});
