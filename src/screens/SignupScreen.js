import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, KeyboardAvoidingView, TextInput,
        BackHandler, NetInfo, TouchableOpacity} from 'react-native';
import {Content, Container, CheckBox, Body} from 'native-base';
import  { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toast from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import * as SignupAction from '../actions/SignupAction';

class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state= {
      loading: true,
      passwordVisible: false,
      userID: '',
      password: '',
      confirmPassword: '',
      signupSuccess: ''
    }
  }

  componentDidMount () {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (!isConnected) {
        this.setState({
            loading: false,
        }, () => {
            this.refs.toast.show("Could not connect to server")
        })
      } else {
        this.setState({ loading: false })
        }
    });
    //NetInfo.isConnected.addEventListener('connectionChange', this.handleFirstConnectivityChange);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.props.navigation.navigate ('LoginScreen', {displayName: this.state.displayName, password: this.state.password});
    return true;
  }

  signUp = () => {
    if (this.state.userID === '' || this.state.password === '' || this.state.password === '') {
      this.refs.toast.show ('Please fill in all fields');
    }
    else if (this.state.password !== this.state.confirmPassword) {
      this.refs.toast.show ('Passwords do not match');
    }
    else {
      this.props.SignupAction.addUser ({name: this.state.userID, password: this.state.password});
    }
  }

  componentWillReceiveProps (next) {
    if (next.data) {
      this.setState ({
        signupSuccess: next.data
      }, () => {
        if (this.state.signupSuccess === 'SUCCESS') {
          this.refs.toast.show ('Sign-Up Successful');
        }
        else {
          this.refs.toast.show ('Failed to sign-up');
        }
      })
    }
  }

  render () {
    const {loading, passwordVisible, userID, password, confirmPassword} = this.state;
    return (
      <Container style={styles.container}>
        <Content>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Chat-App</Text>
          </View>
          <View renderToHardwareTextureAndroid={true} style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder='User ID'
              autoCapitalize='none'
              placeholderTextColor='rgba(255, 255, 255, 0.4)'
              returnKeyType={'next'}
              onChangeText={(text) => {this.setState({userID: text})}}
              onSubmitEditing={() => {this.passwordTextInput.focus()}}
            />
            <TextInput
              style={styles.input}
              placeholder='Password'
              autoCapitalize='none'
              placeholderTextColor='rgba(255, 255, 255, 0.4)'
              secureTextEntry={!passwordVisible}
              returnKeyType={'next'}
              onChangeText={(text) => {this.setState({password: text})}}
              ref={(input) => {this.passwordTextInput = input}}
              onSubmitEditing={() => {this.confirmPasswordTextInput.focus()}}
            />
            <TextInput
              style={styles.input}
              placeholder='Confirm Password'
              autoCapitalize='none'
              placeholderTextColor='rgba(255, 255, 255, 0.4)'
              secureTextEntry={!passwordVisible}
              onChangeText={(text) => {this.setState({confirmPassword: text})}}
              ref={(input) => {this.confirmPasswordTextInput = input}}
              onSubmitEditing={() => {this.signUp()}}
            />
            <TouchableOpacity style={styles.signUpButton} onPress={() => {this.signUp()}}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUpButton} onPress={() => {this.props.navigation.navigate ('LoginScreen')}}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </Content>
        <Spinner visible={loading} cancelable={false} />
        <Toast ref="toast" position='top' />
      </Container>
    );
  }
}

function mapStateToProps(state) {
    return {
      data: state.SignupReducer.signupSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
      SignupAction: bindActionCreators (SignupAction, dispatch)
    };
}

export default connect (mapStateToProps, mapDispatchToProps)(SignupScreen);

const styles = StyleSheet.create ({
  container: {
    backgroundColor: '#57606f',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  titleText: {
    fontSize: 40,
    color: '#fff'
  },
  form: {
    width: '90%',
    marginLeft: '5%',
    marginTop: 50
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
    borderRadius: 15,
    paddingLeft: 10,
    color: '#fff'
  },
  signUpButton: {
    backgroundColor: '#ced6e0',
    width: '90%',
    marginLeft: '5%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginBottom: 40
  },
  buttonText: {
    fontSize: 18,
    color: '#2f3542'
  },
  questionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 10
  },
  checkBox: {
    marginTop: -18,
    marginBottom: 20,
    marginLeft: '25%'
  },
  checkBoxText: {
    color: 'rgba(255, 255, 255, 0.7)'
  }
});
