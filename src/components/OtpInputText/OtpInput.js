import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Content, Item, Input } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';
import {primaryColor} from '../../setup/config'

class OtpInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otp: [],
            noOfDigits:this.props&&this.props.noOfDigits?Number(this.props.noOfDigits):6,
        };
        this.otpTextInput = [];
    }
    componentDidMount() {
        this.otpTextInput[0]._root.focus();
    }

    renderInputs() {
        const inputs = Array(this.state.noOfDigits).fill(0);   //for 6 digit OTP code
        const txt = inputs.map(
            (i, j) =>
                <Col key={j}
                    style={styles.txtMargin}
                >
                    <Item style={{ borderBottomWidth: 0, borderBottomColor: primaryColor, marginTop: 1, backgroundColor: '#EAF5F5', borderRadius: 20, height: 70 }}>
                        <Input
                            style={[styles.inputRadius, { borderRadius: 10 }]}
                            maxLength={1}
                            keyboardType="numeric"
                            onChangeText={v => this.focusNext(j, v)}
                            onKeyPress={e => this.focusPrevious(e.nativeEvent.key, j)}
                            ref={ref => this.otpTextInput[j] = ref}
                        />
                    </Item></Col>
        );
        return txt;
    }

    focusPrevious(key, index) {  // The previous Focus works only after Entered 6th digit code
        if (key === 'Backspace' && index !== 0)
            this.otpTextInput[index - 1]._root.focus();
    }

    focusNext(index, value) {
        if (index < this.otpTextInput.length - 1 && value) {
            this.otpTextInput[index + 1]._root.focus();
        }
        if (index === this.otpTextInput.length - 1) {
            this.otpTextInput[index]._root.blur();
        }
        const otp = this.state.otp;
        otp[index] = value;
        this.setState({ otp });
        this.props.getOtp(otp.join(''));
    }


    render() {
        return (
            <Grid style={styles.gridPad}>
                    {this.renderInputs()}
                </Grid>
        );
    }
}

const styles = StyleSheet.create({
    gridPad: { padding: 0 },
    txtMargin: { margin: 1, },
    inputRadius: { textAlign: 'center', fontSize: 25, fontWeight: 'bold' }
});

export default OtpInput;
