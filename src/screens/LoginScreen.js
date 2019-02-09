import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, KeyboardAvoidingView, TextInput,
        BackHandler, NetInfo, TouchableOpacity} from 'react-native';
import  { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Content, Container} from 'native-base';
import CheckBox from 'react-native-check-box';
import Toast from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import * as LoginActions from '../actions/LoginActions';

class LoginScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      loginID: '',
      password: '',
      passwordVisible: false,
      userData: '',
      validLogin: '',
    }
  }

  componentDidMount() {
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

  componentWillUnmount() {
    BackHandler.removeEventListener('harwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.setState ({loading: false});
    BackHandler.exitApp ();
    return true;
  }

  loginButton = () => {
    if (this.state.loginID === '') {
      this.refs.toast.show ('Enter Login ID');
    }
    else if (this.state.password === '') {
      this.refs.toast.show ('Enter password');
    }
    else {
      this.setState ({
        loading: true
      }, () => {
        this.props.LoginActions.validate ({name: this.state.loginID, password: this.state.password});
      })
    }
  }

  componentWillReceiveProps (next) {
    if (next.loginData) {
      this.setState ({
        loading: false,
        validLogin: next.loginData
      }, () => {
        if (this.state.validLogin === 'SUCCESS') {
          this.props.navigation.navigate ('HomeScreen', {user: this.state.loginID});
        }
        else {
          this.refs.toast.show ('Login Failed');
        }
      })
    }
  }

  render() {
    const {loading, loginID, password, passwordVisible} = this.state;
    return (
      <Container style={styles.container}>
        <Content>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Chat-App</Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              autoCapitalize='none'
              placeholder='User ID'
              placeholderTextColor='rgba(255, 255, 255, 0.4)'
              returnKeyType={'next'}
              value={loginID}
              onChangeText={(text) => {this.setState({loginID: text})}}
              onSubmitEditing={() => {this.passwordTextInput.focus()}}
            />
            <TextInput
              style={styles.input}
              autoCapitalize='none'
              placeholder='Password'
              placeholderTextColor='rgba(255, 255, 255, 0.4)'
              secureTextEntry={!passwordVisible}
              value={password}
              ref={(input) => {this.passwordTextInput = input}}
              onChangeText={(text) => {this.setState({password: text})}}
              onSubmitEditing={() => {this.loginButton()}}
            />
            <View style={styles.checkBox}>
              <CheckBox
                style={{flex: 1, padding: 10}}
                onClick={()=>{
                  this.setState({
                      passwordVisible:!passwordVisible
                  })
                }}
                isChecked={this.state.passwordVisible}
                rightText={'Show Password'}
                rightTextStyle={styles.checkBoxText}
                checkBoxColor='#fff'
              />
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={() => {this.loginButton()}}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.questionText}>Don't have an account?</Text>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={() => {this.props.navigation.navigate('SignupScreen')}}>
              <Text style={styles.buttonText}>Sign Up</Text>
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
      loginData: state.LoginReducer.loginSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
      LoginActions: bindActionCreators (LoginActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

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
  loginButton: {
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
    color: '#fff',
    marginBottom: 10
  },
  checkBox: {
    marginTop: -18,
    marginLeft: '27%'
  },
  checkBoxText: {
    color: 'rgba(255, 255, 255, 0.7)'
  }
});
