import { ColorValue } from 'react-native';

export type ColorThemeKeys = 'background' | 'text';

type ColorTheme = Record<ColorThemeKeys, ColorValue>;

const commonColors: ColorTheme = {
  background: '#FFFFFF',
  text: '#000000',
};

// const darkTheme: ColorTheme = {
//   background: '#000000',
//   text: '#FFFFFF',
//   ...commonColors,
// };
//
// const lightTheme: ColorTheme = {
//   background: '#FFFFFF',
//   text: '#000000',
//   ...commonColors,
// };

const useColors = () => {
  // const colorTheme = useColorScheme();
  // return colorTheme ? darkTheme : lightTheme;

  return commonColors;
};

export default useColors;
