import React from 'react';
import Button from 'apsl-react-native-button';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleProp,
  Text,
  Button as OriButton,
} from 'react-native';

type Props = {
  type?: 'default' | 'error' | 'inline';
  style?: any;
  textStyle?: StyleProp<Text>;
  disabled?: boolean;
  [other: string]: any;
};

class TButton extends React.Component<Props> {
  render() {
    return (
      <Button
        {...this.props}
        textStyle={[
          textStyles.default,
          textStyles[this.props.type],
          this.props.textStyle,
        ]}
        style={[styles.default, styles[this.props.type], this.props.style]}
        isDisabled={this.props.disabled}
      >
        {this.props.children}
      </Button>
    );
  }
}

const styles = {
  default: {
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: '#705949',
  },
  error: {
    backgroundColor: '#ff4400',
  },
  inline: {
    backgroundColor: 'transparent',
  },
};

const textStyles = {
  default: {
    color: 'white',
  },
  inline: {
    color: '#705949',
  },
};

export default TButton;
