import React from 'react';
import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import { HistoryIcon, ProfileIcon, SupportSvg, HomeSvg, LanguageSvg, MoreSvg, WhatsAppSvgIcon, HamburgerDrawerSvg, UserSvg } from '../../assets/icons/icons';
import { Color, } from '../theme/colors';
import { CommonActions, CompositeNavigationProp, getFocusedRouteNameFromRoute, NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { HOME_, HOME_SCREEN, SUPPORT_, LANGUAGE_, MORE_, LOCATION_, CALENDER_TASK, } from '../constants/app-routes.constants';
import Home from '../screens/home/home';
import Support from '../screens/home/support';
import Language from '../screens/home/language';
import MoreScreen from '../screens/home/more';
import Task from '../screens/home/calender-task';
import Location from '../screens/home/location';






export type RootStackParamList = {
  [HOME_]: NavigatorScreenParams<HomeParamList>;
  [SUPPORT_]: undefined;
  [LANGUAGE_]: undefined;
  [MORE_]: undefined;
  [CALENDER_TASK]: undefined;
  [LOCATION_]: undefined;
};

export type HomeParamList = {
  [HOME_SCREEN]: undefined;

};


const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<HomeParamList>();


export type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, typeof HOME_>,
  StackNavigationProp<HomeParamList>
>;

export const useHomeNavigation = () => useNavigation<HomeNavigationProp>();
function HomeStackScreens() {
  return (
    <Stack.Navigator initialRouteName={HOME_SCREEN} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={HOME_SCREEN} component={Home} />


    </Stack.Navigator>
  );
}


export default function BottomTabNavigator() {
  return (

    <Tab.Navigator
      initialRouteName={HOME_}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent;
          let iconColor = focused ? Color.primaryWhite : Color.grey;
          let iconSize = focused ? 20 : 20;

          switch (route.name) {
            case HOME_:
              IconComponent = HomeSvg;
              break;
            case SUPPORT_:
              IconComponent = SupportSvg;
              break;
            case LANGUAGE_:
              IconComponent = LanguageSvg;
              break;
            case MORE_:
              IconComponent = MoreSvg;
              break;
            case CALENDER_TASK:
              IconComponent = UserSvg;
              break;
            case LOCATION_:
              IconComponent = HamburgerDrawerSvg;
              break;
            default:
              IconComponent = null;
              break;
          }
          return (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? "#387d50" : 'transparent' },
              ]}
            >
              {IconComponent && { backgroundColor: focused } && <IconComponent color={iconColor} size={iconSize} />}
            </View>
          );
        },

        tabBarLabel: () => null,
        tabBarStyle: {
          height: 65,
          backgroundColor: Color.darkGreen,
          width: '90%',
          alignSelf: "center",
          borderRadius: 100,
          bottom: 10,
        },
  
      })}
    >
      <Tab.Screen name={HOME_} component={HomeStackScreens} />
      <Tab.Screen name={SUPPORT_} component={Support} />
      <Tab.Screen name={LANGUAGE_} component={Language} />
      <Tab.Screen name={MORE_} component={MoreScreen} />
      <Tab.Screen name={CALENDER_TASK} component={Task} />
      <Tab.Screen name={LOCATION_} component={Location} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center",
    marginTop: "80%",
  },
});