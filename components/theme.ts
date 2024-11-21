// https://github.com/jsamr/react-native-font-demo#ios
// See above demo to add fonts for IOS

import { MD3LightTheme as DefaultTheme, MD3Theme } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

export type TCustomColorKey = keyof TCustomTheme['colors'];

export type TCustomElevation = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type TCustomTheme = MD3Theme & {
  colors: MD3Colors & {
    transparent: string;
    primaryBlue: string;
    placeholderGrey: string;
    lightGrey: string;
    lightGreen: string;
    blueSurface: string;
    onBlueSurface: string;
    handleGray: string;

    green: string;
    blue: string;
    orange: string;
    yellow: string;
    pastelOrange: string;
    pastelGreen: string;
    pastelBlue: string;
    redText: string;
    darkText: string;
    textDark: string;
    textMedium: string;
    textLight: string;

    textInverseDark: string;
    textInverseMedium: string;
    textInverseLight: string;

    neutralLight: string;
    neutralDark: string;
  };
  spacing: (val: number) => number;
  elevation: {
    none: null;
    low: TCustomElevation;
    // medium: TCustomShadow;
    high: TCustomElevation;
  };
  radius: {
    md: number;
    sm: number;
  };
};

export const customTheme: TCustomTheme = {
  ...DefaultTheme,
  fonts: {
    default: {
      fontFamily: 'Nunito-Regular',
      fontWeight: '400',
      letterSpacing: 0,
    },
    displayLarge: {
      fontFamily: 'Nunito-Regular',
      fontSize: 57,
      letterSpacing: -0.25,
      lineHeight: 64,
      fontWeight: '400',
    },
    displayMedium: {
      fontFamily: 'Nunito-Regular',
      fontSize: 45,
      letterSpacing: 0,
      lineHeight: 52,
      fontWeight: '400',
    },
    displaySmall: {
      fontFamily: 'Nunito-Regular',
      fontSize: 36,
      letterSpacing: 0,
      lineHeight: 44,
      fontWeight: '400',
    },
    headlineLarge: {
      fontFamily: 'Nunito-Regular',
      fontSize: 32,
      letterSpacing: 0,
      lineHeight: 38.4,
      fontWeight: '400',
    },
    headlineMedium: {
      fontFamily: 'Nunito-Regular',
      fontSize: 28,
      letterSpacing: 0,
      lineHeight: 36,
      fontWeight: '400',
    },
    headlineSmall: {
      fontFamily: 'Nunito-Regular',
      fontSize: 20,
      letterSpacing: 0,
      lineHeight: 24,
      fontWeight: '400',
    },
    titleLarge: {
      fontFamily: 'Nunito-Regular',
      fontSize: 20,
      letterSpacing: 0,
      lineHeight: 36.46,
      fontWeight: '400',
    },
    titleMedium: {
      fontFamily: 'Nunito-Regular',
      fontSize: 16,
      letterSpacing: 0.15,
      lineHeight: 24,
      fontWeight: '400',
    },
    titleSmall: {
      fontFamily: 'Nunito-Regular',
      fontSize: 14,
      letterSpacing: 0.1,
      lineHeight: 20,
      fontWeight: '400',
    },
    labelLarge: {
      fontFamily: 'Nunito-Regular',
      fontSize: 14,
      letterSpacing: 0,
      lineHeight: 20,
      fontWeight: '400',
    },
    labelMedium: {
      fontFamily: 'Nunito-Regular',
      fontSize: 12,
      letterSpacing: 0,
      lineHeight: 26,
      fontWeight: '400',
    },
    labelSmall: {
      fontFamily: 'Nunito-Regular',
      fontSize: 10,
      letterSpacing: 0,
      lineHeight: 16,
      fontWeight: '400',
    },
    bodyLarge: {
      fontFamily: 'Nunito-Regular',
      fontSize: 16,
      letterSpacing: 0.5,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodyMedium: {
      fontFamily: 'Nunito-Regular',
      fontSize: 14,
      letterSpacing: 0,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodySmall: {
      fontFamily: 'Nunito-Regular',
      fontSize: 12,
      letterSpacing: 0.4,
      lineHeight: 16,
      fontWeight: '400',
    },
  },
  colors: {
    ...DefaultTheme.colors,
    surface: 'rgb(248, 251, 254)',
    primaryBlue: 'rgba(29, 113, 184, 1)',
    placeholderGrey: 'rgba(110, 110, 110, 100)',
    lightGrey: 'rgba(105, 105, 105, 100)',
    lightGreen: 'rgba(24, 166, 97, 100)',

    transparent: 'rgba(0,0,0,0)',

    blueSurface: 'rgb(64, 72, 128)',
    onBlueSurface: 'rgb(255, 255, 255)',

    handleGray: 'rgba(188, 188, 188, 1)',

    green: 'rgb(57, 210, 126)',
    blue: 'rgb(55, 159, 206)',
    orange: 'rgb(241, 178, 62)',
    yellow: 'rgba(255, 183, 51, 1)',

    pastelBlue: 'rgb(226, 246, 255)',
    pastelGreen: 'rgb(227, 247, 236)',
    pastelOrange: 'rgb(255, 243, 221)',

    darkText: 'red',
    // textDark: 'rgb(28, 27, 31)',
    textDark: '#2B2829',
    textMedium: 'rgb(66, 66, 66)',
    textLight: 'rgb(99, 99, 99)',

    textInverseDark: 'rgb(255, 255, 255)',
    textInverseMedium: 'rgb(255, 255, 255)',
    textInverseLight: 'rgb(255, 255, 255)',
    redText: 'rgba(255, 24, 24, 1)',
    neutralDark: 'rgb(0, 0, 0)',
    neutralLight: 'rgb(255, 255, 255)',
  },
  spacing: val => val * 8,
  elevation: {
    none: null,
    low: {
      shadowColor: 'rgba(0, 0, 0, 1)',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 2,
    },
    high: {
      shadowColor: 'rgba(0, 0, 0, 0.75)',
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 10,
    },
  },
  radius: {
    md: 12,
    sm: 6,
  },
};
