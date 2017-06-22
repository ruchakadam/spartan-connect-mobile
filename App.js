import React, { Component } from 'react';
import { Alert, Button, FlatList, ScrollView, StatusBar, StyleSheet, Text, View, WebView } from 'react-native';
import HTMLView from 'react-native-htmlview';

import { StackNavigator } from 'react-navigation';

import { IndexScreen } from './js/Index';
import { AnnouncementViewScreen, AnnouncementWebScreen } from './js/Announcement';


export default App = StackNavigator({
  Home: { screen: IndexScreen },
  Announcement: { screen: AnnouncementViewScreen },
  AnnouncementWeb: { screen: AnnouncementWebScreen }
})
