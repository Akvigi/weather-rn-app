import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { StaticParamList } from '@react-navigation/core';
import HomeScreen from './screens/HomeScreen.tsx';
import useColors from './hooks/useColors.ts';
import WeatherSearchScreen from './screens/WeatherSearchScreen.tsx';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    WeatherSearch: WeatherSearchScreen,
  },
});

// bun add/npm i @react-navigation/bottom-tabs
// const BottomRootStack = createBottomTabNavigator({
//   screens: {
//     Home: HomeScreen,
//     Profile: ProfileScreen,
//   },
// });

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

function App() {
  const colors = useColors();

  const styles = { flex: 1, backgroundColor: colors.background };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles}>
        <Navigation />
      </View>
    </SafeAreaProvider>
  );
}

export default App;
