import useColors from '../../hooks/useColors.ts';
import { Text, TextProps } from 'react-native';

const UIText = (props: TextProps) => {
  const colors = useColors();

  return <Text style={{ color: colors.text }} {...props} />;
};

export default UIText;
