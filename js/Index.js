import React, { Component } from 'react';
import { Alert, Button, FlatList, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View, WebView } from 'react-native';
import HTMLView from 'react-native-htmlview';

import { AppStyles, AppTextStyles } from './Styles';
import { BoxAlert, Announcement } from './UI';
import Drawer from 'react-native-drawer-menu';
import {Easing} from 'react-native';


export class IndexScreen extends Component {


  static navigationOptions = {
    title: 'Spartan Connect',
    headerRight: <Text>Weather: Impossible 72&deg;  </Text>
  };

  constructor(props) {
    super(props);
    this.state = {
      announcements: [],
      refreshing: true
    };
    new Promise(this.retrieveCurrentAnnouncements.bind(this)).then(() => {
      this.setState({refreshing: false});
    });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    new Promise(this.retrieveCurrentAnnouncements.bind(this)).then(() => {
      this.setState({refreshing: false});
      this.forceUpdate();
    });
  }

  _onRedirect(announcementId) {
    const { navigate } = this.props.navigation;
    navigate('Announcement', {id: announcementId});
  }

  retrieveCurrentAnnouncements(resolve, reject) {
    //http://sctest.x10.mx/api/get_current_announcements.php?returnType=ids
    try {
      fetch('http://sctest.x10.mx/api/get_current_announcements.php?returnType=ids', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then((response) => {
        return response.json();
      }).then((responseJson) => {
        var index = 0;
        var keyArray = responseJson.map((result) => {
          index = index + 1;
          return {key: index, value: result};
        });
        this.setState((state) => {
          return {
            announcements: keyArray
          };
        });
      }).then(() => {
        resolve(true);
      });
    } catch (error) {
      resolve(false);
      console.error(error);
    }
  }

  render() {

    // Drawer Setup
    var drawerContent = (<View style={styles.drawerContent}>
    <View style={styles.leftTop}/>
    <View style={styles.leftBottom}>
      <View><Text>Drawer Content</Text></View>
    </View>
    </View>);
    // customize drawer's style (Optional)
    var customStyles = {
      drawer: {
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 10
      },
    mask: {}, // style of mask if it is enabled
    main: {} // style of main board
    };

    const { navigate } = this.props.navigation;
    return (
      <View>
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)}/>} style={AppStyles.announcementsView}>
          <StatusBar hidden />
          <Button onPress={() => navigate('Announcement', {id: 1})} title="Open Sample Announcement" />
          <BoxAlert title="DEVELOPER'S NOTICE" description="This is not meant to be used as the final app or even the development app during bootcamp. This simply serves as a prototype for developers to learn from."/>
          <FlatList data={this.state.announcements} renderItem={({item}) => <Announcement id={item.value} returnFunction={this._onRedirect.bind(this)} />}/>
        </ScrollView>

        // Drawer Implementation
        <Drawer
          style={styles.container}
          drawerWidth={300}
          drawerContent={drawerContent}
          type={Drawer.types.Overlay}
          customStyles={{drawer: styles.drawer}}
          drawerPosition={Drawer.positions.Right}
          onDrawerOpen={() => {console.log('Drawer is opened');}}
          onDrawerClose={() => {console.log('Drawer is closed')}}
          easingFunc={Easing.ease}
         >
          <View style={styles.content}>
            <Text>{Object.values(Drawer.positions).join(' ')}</Text>
            <Text>{Object.values(Drawer.types).join(' ')}</Text>
          </View>
        </Drawer>
      </View>

    );
  }
}
