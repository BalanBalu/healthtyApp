
/* path "node_modules/react-native-paper/src/components/CheckboxIOS.js" */


/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import color from 'color';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import { withTheme } from '../core/theming';
import type { Theme, $RemoveChildren } from '../types';

type Props = $RemoveChildren<typeof TouchableRipple> & {|
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked' | 'indeterminate',
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * Custom color for checkbox.
   */
  color?: string,
  /**
   * @optional
   */
  theme: Theme,
|};

/**
 * Checkboxes allow the selection of multiple options from a set.
 * This component follows platform guidelines for iOS.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/checkbox-enabled.ios.png" />
 *     <figcaption>Enabled</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-disabled.ios.png" />
 *     <figcaption>Disabled</figcaption>
 *   </figure>
 * </div>
 */
class CheckboxIOS extends React.Component<Props> {
  static displayName = 'Checkbox.IOS';

  render() {
    const { status, disabled, onPress, theme, ...rest } = this.props;
    const checked = status === 'checked';
    const indeterminate = status === 'indeterminate';

    const checkedColor = disabled
      ? theme.colors.disabled
      : this.props.color || theme.colors.accent;

    let rippleColor;

    if (disabled) {
      rippleColor = color(theme.colors.text)
        .alpha(0.16)
        .rgb()
        .string();
    } else {
      rippleColor = color(checkedColor)
        .fade(0.32)
        .rgb()
        .string();
    }

    const icon = indeterminate ? 'remove' : 'done';

    return (
      <TouchableRipple
        {...rest}
        borderless
        rippleColor={rippleColor}
        onPress={onPress}
        disabled={disabled}
        accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
        accessibilityComponentType="button"
        accessibilityRole="button"
        accessibilityStates={disabled ? ['disabled'] : undefined}
        accessibilityLiveRegion="polite"
        style={styles.container}
      >
        <View style={[ {opacity: indeterminate || checked ? 1 : 0 },styles.viewStyle]}>
          <Icon
            allowFontScaling={false}
            source={icon}
            size={18}
            color={"#fff"}
         
          />
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
     height:16, 
     width:'7%',
    borderColor:'#000',
    borderWidth:0.5
  },
  viewStyle:{
   marginTop:-3,
   backgroundColor:"#775DA3"
  }
  
});

export default withTheme(CheckboxIOS);
