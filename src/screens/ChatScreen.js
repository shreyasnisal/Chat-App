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

class ChatScreen extends Component {
  constructor (props) {
    super (props);
    this.state = {
      loading: true,
      messages: [],
      newMessage: '',
    }
  }

  componentWillMount() {
    const user = this.props.navigation.getParam ('user');
    const target = this.props.navigation.getParam ('target');
    this.setState ({
      user: user,
      target: target,
    }, () => {
      this.props.UserActions.getChat (user, target);
    });
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
    BackHandler.addEventListener ('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener ('hardwareBackPress', this.handleBackPress);
  }

  componentWillReceiveProps (next) {
    if (next.chatData) {
      this.setState ({
        loading: false,
        messages: next.chatData
      })
    }
    if (next.addMessageData) {
      if (next.addMessageData === 'SUCCESS') {
        this.setState ({
          loading: false
        }, () => {
          this.props.UserActions.getChat (this.state.user, this.state.target);
        })
      }
      else {
        this.refs.toast.show ('Failed to add message');
      }
    }
  }

  handleBackPress = () => {
    this.setState ({loading: false});
    this.props.navigation.navigate ('HomeScreen', {user: this.state.user});
    return true;
  }

  sendButton = () => {
    const {newMessage, user, target} = this.state;
    if (newMessage === '') {
      this.refs.toast.show ('No message to send');
    }
    else {
      this.setState ({
        loading: true,
      }, () => {
        this.props.UserActions.addMessage ({message: newMessage, sender: user, recipient: target});
      })
      this.refs.messageBox.clear();
      this.setState ({newMessage: ''});
    }
  }

  renderChat = (messages) => {
    let {loading, user} = this.state;
    return (
      <ScrollView style={{marginTop: '3%'}}>
        { loading || messages.length === 0 ? null : <View style={ { width: '90%', borderBottomWidth: 1, marginLeft: '5%', borderColor: '#ebebeb' } } /> }
        {
          messages.map((data, index) => {
            if (data.sender === user) {
              return (
                <View key= {index} style={styles.sentMessage}>
                  <Text style={styles.messageText}>{data.message}</Text>
                </View>
              );
            }
            else {
              return (
                <View key= {index} style={styles.receivedMessage}>
                  <Text style={styles.messageText}>{data.message}</Text>
                </View>
              );
            }
          })
        }
      </ScrollView>
    );
  }

  render () {
    const {loading, user, target, messages} = this.state;
    return (
      <Container style={styles.container}>
      <View style={styles.headerStyle}>
        <StatusBar barStyle="light-content" />
        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 20}}>
          <TouchableOpacity onPress={() => this.handleBackPress()}>
            <Icon name="arrow-left" size={25} color="#fff" />
          </TouchableOpacity>
          <Title style={styles.headerText}>{target}</Title>
        </View>
      </View>
        <Content>
          {this.renderChat(messages)}
        </Content>
        <Toast ref="toast" position='top' />
        <View style={styles.inputView}>
          <TextInput
            ref='messageBox'
            placeholder='Type here'
            style={styles.messageBox}
            autoFocus={true}
            multiline={true}
            onChangeText={(text) => {this.setState({newMessage: text})}}
          />
            <TouchableOpacity style={styles.sendButton} onPress={() => {this.sendButton()}}>
              <Icon name='send' color='#fff' size={40} />
            </TouchableOpacity>
        </View>
        <Spinner visible={loading} cancelable={false} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
    return {
      chatData: state.UserReducer.getChatSuccess,
      addMessageData: state.UserReducer.addMessageSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
      UserActions: bindActionCreators (UserActions, dispatch)
    };
}

export default connect (mapStateToProps, mapDispatchToProps)(ChatScreen);

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
  receivedMessage: {
    marginLeft: '5%',
    marginRight: '50%',
    justifyContent: 'center',
    backgroundColor: '#009432',
    paddingHorizontal: 5,
    borderColor: '#1B1464',
    borderWidth: 1,
    borderRadius: 10,
  },
  messageText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '200'
  },
  sentMessage: {
    marginLeft: '50%',
    marginRight: '5%',
    justifyContent: 'center',
    backgroundColor: '#1289A7',
    paddingHorizontal: 5,
    borderColor: '#1B1464',
    borderWidth: 1,
    borderRadius: 10,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 10,
    width: '85%',
    marginLeft: 5,
    borderRadius: 10,
  },
  sendButton: {
    marginLeft: 5,
  }
});
