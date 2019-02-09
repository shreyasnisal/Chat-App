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

class HomeScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      conversationUsers: [],
      user: ''
    }
  }

  componentWillMount () {
    const user = this.props.navigation.getParam ('user');
    this.setState ({
      user: user,
    }, () => {
      this.props.UserActions.getConversations (user);
    });
  }

  componentDidMount () {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (!isConnected) {
        this.setState({
            loading: false,
        }, () => {
            this.refs.toast.show("Could not connect to sever");
        })
      } else {
        this.setState({ loading: false })
        }
    });
    //NetInfo.isConnected.addEventListener('connectionChange', this.handleFirstConnectivityChange);
    BackHandler.addEventListener ('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount () {
    BackHandler.removeEventListener ('hardwareBackPress', this.handleBackPress);
  }

  componentWillReceiveProps (next) {
    if (next.conversationsData) {
      this.setState ({
        loading: false,
        conversationUsers: next.conversationsData
      })
    }
  }

  handleBackPress = () => {
    this.setState ({loading: false});
    BackHandler.exitApp ();
    return true;
  }

  refresh = () => {
    this.setState ({
      loading: true,
    }, () => {
      this.props.UserActions.getConversations (this.state.user);
    })
  }

  renderList = (userList) => {
    let {loading, user} = this.state;
    return (
      <ScrollView>
        { loading || userList.length === 0 ? null : <View renderToHardwareTextureAndroid={ true } style={ { width: '90%', borderBottomWidth: 1, marginLeft: '5%', borderColor: '#ebebeb' } } /> }
        {
          userList.map((data, index) => {
            return (
                <TouchableOpacity key= {index} style={styles.conversationContainer} onPress={() => {this.props.navigation.navigate ('ChatScreen', {user: user, target: data})}}>
                  <Text style={styles.userName}>{data}</Text>
                </TouchableOpacity>
            );
          })
        }
      </ScrollView>
    );
  }

  render () {
    const {loading, user, conversationUsers} = this.state;
    return (
      <Container style={styles.container}>
      <View style={styles.headerStyle}>
        <StatusBar barStyle="light-content" />
        <View renderToHardwareTextureAndroid={true} style={styles.headerTextContainer} >
            <Title style={styles.headerText}>{user}</Title>
        </View>
        <View style={styles.headerIconContainer}>
        <TouchableOpacity onPress = {() => {this.refresh()}}>
          <IconFa name='refresh' style={{marginRight: 30}} size={30} color='#fff' />
        </TouchableOpacity>
          <TouchableOpacity onPress = {() => {this.props.navigation.navigate ('NewMessageScreen', {user: user})}}>
            <IconFa name='plus-circle' size={30} color='#fff' />
          </TouchableOpacity>
        </View>
      </View>
        <Content>
          {this.renderList(conversationUsers)}
        </Content>
        <Spinner visible={loading} cancelable={false} />
        <Toast ref="toast" position='top' />
      </Container>
    );
  }
}

function mapStateToProps(state) {
    return {
      conversationsData: state.UserReducer.getConversationsSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
      UserActions: bindActionCreators (UserActions, dispatch)
    };
}

export default connect (mapStateToProps, mapDispatchToProps)(HomeScreen);

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
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 20,
    //paddingTop: 10
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
  },
  headerIconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 20,
    //marginTop: 10
  },
  conversationContainer: {
    backgroundColor: '#a4b0be',
    width: '100%',
    borderColor: '#57606f',
    borderWidth: 1,
    paddingLeft: '5%',
    height: 80,
    justifyContent: 'center',
  },
  userName: {
    color: '#2f3542',
    fontSize: 20,
    fontWeight: '200'
  },
});
