import { View } from 'react-native';
import UIButton from '../components/common/UIButton.tsx';
import { useNavigation } from '@react-navigation/core';

const HomeScreen = () => {
  const nav = useNavigation();
  return (
    <View>
      <UIButton
        title={'Go to Weather Search'}
        onPress={() => nav.navigate('WeatherSearch')}
      />
    </View>
  );
};

export default HomeScreen;
