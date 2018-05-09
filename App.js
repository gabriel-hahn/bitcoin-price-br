import React, { Component } from 'react';
import { Text, Image, View, ImageBackground, StatusBar, Dimensions } from 'react-native';
import BitcoinValue from './src/components/bitcoin';
import DolarValue from './src/components/dolar';
import { AdMobBanner } from 'react-native-admob';
import PropTypes from 'prop-types';

const Estilos = {
  estiloTextoReal: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
    paddingLeft: 110,
    paddingTop: 50
  }
};

const { estiloTextoReal, estiloButtonTouchBitcoin } = Estilos;

export default class BitcoinPrice extends Component {

  render() {

    var width = Dimensions.get('window').width;
    var height = Dimensions.get('window').height;

    return (
      <View>
        <StatusBar hidden />
        <ImageBackground style={{ height: height / 2, width: width }} source={require('./img/bitcoin.jpg')}>
          <BitcoinValue />
        </ImageBackground>
        <ImageBackground style={{ height: height / 2.40, width: width }} source={require('./img/dolar.jpg')}>
          <DolarValue />
        </ImageBackground>
        <AdMobBanner
          adSize="largeBanner"
          adUnitID="Your Admob ID here"
        />
      </View>
    );
  }
};
