import {Linking, Platform} from 'react-native';

export const GlobalFunctions = {
  openMap: (lat, lng, siteName) => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${lat},${lng}`;
    const label = siteName;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  },
  getHours: totalMinutes => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours == 0) {
      return ` ${minutes} minutes`;
    }
    return ` ${hours} hours ${minutes} minutes`;
  },
  notificationNavigation: remoteMessage => {
    const {post_id, notification_obj, notification_type} =
      remoteMessage?.data ?? {};

    // if (notification_type == CONST.CHAT) {
    //     navigate('ConversationList');
    //     return;
    // }
  },
};
