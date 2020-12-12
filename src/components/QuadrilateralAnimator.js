import React from 'react';
import {
	StyleSheet,
	View,
	Animated,
} from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	group: {
		width: 100,
		height: 150,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	quadrilateral: {
		width: 40,
		height: 40,
            
	},

});

// @flow


const ObjectAnimated = ({ value, x, y }) => (
	<Animated.Image source={require('../../assets/health_care_plus.png')}
		style={[styles.quadrilateral, {
			transform: [{
				rotateX: value.interpolate({
					inputRange: [0, 1, 2],
					outputRange: x,
				}),
			}, {
				rotateY: value.interpolate({
					inputRange: [0, 1, 2],
					outputRange: y,
				}),
			}],
		}]}
	/>
);

class Quadrilateral extends React.Component {
	constructor(props) {
		super(props);
		this.animatedValue = new Animated.Value(0);
	}

	componentWillMount() {
		this.animate();
	}

	setTimingAnimated(originalValue, newValue, duration) {
		return Animated.timing(originalValue, {
			toValue: newValue,
			duration,
			useNativeDriver: true,
		});
	}

	animate() {
		Animated.sequence([
			this.setTimingAnimated(this.animatedValue, 0, 800),
			this.setTimingAnimated(this.animatedValue, 1, 800),
			this.setTimingAnimated(this.animatedValue, 2, 800),
		]).start(() => this.animate());
	}

	render() {
        const { active } = this.props;
        
		return (
					<ObjectAnimated
						value={this.animatedValue}
						x={['0deg', '-180.1deg', '-180deg']}
						y={['0deg', '0deg', '-179.9deg']}
					/>
		)
	}
}

export default Quadrilateral;