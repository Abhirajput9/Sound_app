import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BOTTOM_TAB_NAVIGATOR } from '../constants/app-routes.constants';
import BottomTabNavigator from './tab.navigator';
import { Color } from '../theme/colors';





export type UserLoginParams = {
    [BOTTOM_TAB_NAVIGATOR]: undefined;
};

const Stack = createStackNavigator<UserLoginParams>();

const AppNavigator = () => {


    return (
        <GestureHandlerRootView style={{ flex: 1, }}>
            <SafeAreaProvider>
                <StatusBar
                    barStyle={'dark-content'}
                    backgroundColor={'#FFFFFF'}
                    translucent={false}
                />
                <NavigationContainer >
                    <Stack.Navigator
                        initialRouteName={BOTTOM_TAB_NAVIGATOR}
                        screenOptions={{ headerShown: false }}

                    >
                        <Stack.Screen name={BOTTOM_TAB_NAVIGATOR} component={BottomTabNavigator} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default AppNavigator;
