import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, KeyboardAvoidingView, TextInput,
        BackHandler, NetInfo, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import {Content, Container, Header, CheckBox, Body, Col, Title} from 'native-base';
import  { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toast from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import * as UserActions from '../actions/UserActions';
import IconFa from 'react-native-vector-icons/dist/FontAwesome';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

class NewMessageScreen extends Component {
  constructor (props) {
    super (props);
    this.state = {
      loading: false,
      user: '',
      target: '',
      message: '',
    }
  }

  componentWillMount () {
    const user = this.props.navigation.getParam ('user');
    this.setState ({
      user: user
    });
  }

  componentDidMount() {
    BackHandler.addEventListener ('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount () {
    BackHandler.removeEventListener ('harwareBackPress', this.handleBackPress);
  }

  componentWillReceiveProps (next) {
    if (next.addMessageData) {
      if (next.addMessageData === 'SUCCESS') {
        this.refs.toast.show ('Message Sent');
        this.refs.recipientInput.clear ();
        this.refs.messageInput.clear ();
        this.setState ({target: '', message: ''});
      }
      else {
        this.refs.toast.show ('Failed to send');
      }
    }
  }

  handleBackPress = () => {
    this.setState ({loading: false});
    this.props.navigation.navigate ('HomeScreen', {user: this.state.user});
    return true;
  }

  sendButton = () => {
    const {message, user, target} = this.state;
    if (message === '') {
      this.refs.toast.show ('No message to send');
    }
    else if (target === '') {
      this.refs.toast.show ('Please enter a recipient');
    }
    else {
      this.setState ({
        loading: false,
      }, () => {
        this.props.UserActions.addMessage ({message: message, sender: user, recipient: target});
      })
    }
  }

  render () {
    const {loading} = this.state;
    return (
      <Container style={styles.container}>
      <View style={styles.headerStyle}>
        <StatusBar barStyle="light-content" />
        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
          <TouchableOpacity onPress={() => this.handleBackPress()}>
            <Icon name="arrow-left" size={25} color="#fff" />
          </TouchableOpacity>
          <Title style={styles.headerText}>New Message</Title>
        </View>
      </View>
      <Content>
        <TextInput
          ref='recipientInput'
          placeholder='To'
          returnKeyType={'next'}
          autoFocus={true}
          style={styles.recipientInput}
          onChangeText={(text) => {this.setState({target: text})}}
          onSubmitEditing={() => {this.refs.messageInput.focus()}}
        />
        <TextInput
          ref='messageInput'
          placeholder='Message'
          style={styles.messageInput}
          onChangeText={(text) => {this.setState({message: text})}}
          multiline={true}
        />
        <TouchableOpacity onPress={() => {this.sendButton()}} style={styles.sendButton}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </Content>
      <Toast ref="toast" position='top' />
      <Spinner visible={loading} cancelable={false} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
    return {
      addMessageData: state.UserReducer.addMessageSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
      UserActions: bindActionCreators (UserActions, dispatch)
    };
}

export default connect (mapStateToProps, mapDispatchToProps)(NewMessageScreen);

const styles = StyleSheet.create ({
  container: {
    backgroundColor: '#57606f'
  },
  headerStyle: {
    backgroundColor: '#30336b',
    flexDirection: 'row',
    height: 50
  },
  headerTextContainer: {
    //paddingTop: 10
  },
  headerText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  recipientInput : {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: '2%',
    width: '90%',
    marginLeft: '5%',
    borderRadius: 10,
    fontSize: 20
  },
  messageInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '90%',
    marginLeft: '5%',
    height: 150,
    borderRadius: 10,
    fontSize: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  sendButton: {
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
  }
});
