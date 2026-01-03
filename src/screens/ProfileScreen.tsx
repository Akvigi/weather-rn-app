import useAppStore from '../store/appStore.ts';
import { Text, View } from 'react-native';

const ProfileScreen = () => {
  useAppStore(); // const appStore = useAppStore();

  return (
    <View>
      <Text>12312312</Text>
    </View>
  );
};

export default ProfileScreen;
