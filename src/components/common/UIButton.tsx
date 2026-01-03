import useColors from '../../hooks/useColors.ts';
import { Button, ButtonProps } from 'react-native';

const UIButton = (props: ButtonProps) => {
  const colors = useColors();

  return <Button color={colors.text} {...props} />;
};

export default UIButton;
