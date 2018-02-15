import React, { Component } from 'react';
import { Text, View, TouchableOpacity, NetInfo, Alert } from 'react-native';
import axios from 'axios';
import { MaterialIndicator } from 'react-native-indicators';
import Display from 'react-native-display';

//Site no qual informa o valor atual do Bitcoin
const siteBitcoin = 'https://www.mercadobitcoin.net/api/BTC/ticker';

const Estilos = {
    estiloTextoBitcoin: {
        fontSize: 40,
        color: 'black',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    estiloButtonTouchBitcoin: {
        marginTop: 110,
        paddingTop: 20,
        paddingBottom: 30,
        marginRight: 10,
        marginLeft: 10
    },
    estiloIndicador: {
        marginTop: 30,
        alignSelf: 'center'
    }
}

const { estiloTextoBitcoin, estiloButtonTouchBitcoin, estiloIndicador } = Estilos;

export default class BitcoinValue extends Component {

    constructor(props) {
        super(props);
        this.state = { valorBitcoin: '-', carregandoBitCoin: true }
        this.carregarBitcoin = this.carregarBitcoin.bind(this);
        this.progressOff = this.progressOff.bind(this);
        this.progressOn = this.progressOn.bind(this);
        this.verificarConnection = this.verificarConnection.bind(this);
    }

    componentDidMount() {
        NetInfo.addEventListener('change',
            (networkType) => {
                this.setState({ networkType })
            }
        )
    }

    carregarBitcoin() {
        this.progressOn();
        var currencyFormatter = require('currency-formatter');
        axios.get(siteBitcoin).then(response => {
            if (response.data) {
                var aux = currencyFormatter.format(Math.round(response.data.ticker.last), { locale: 'pt-BR' });
                this.setState({ valorBitcoin: aux });
                this.progressOff();
            }
        }).catch(() => {
            this.progressOff();
            this.setState({ valorBitcoin: '-' });
        });
    }

    componentWillMount() {
        this.carregarBitcoin();
    }

    progressOff() {
        this.setState({ carregandoBitCoin: false });
    }

    progressOn() {
        this.setState({ carregandoBitCoin: true });
    }

    verificarConnection() {
        var isConnected = true;
        NetInfo.isConnected.fetch().then(isOnline => {
            if (isOnline == false) {
                isConnected = false;
                Alert.alert('Sem internet', 'Você precisa estar conectado à internet para obter os valores.', { cancelable: false });
            }
        });

        if (isConnected == true) {
            this.carregarBitcoin();
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity style={estiloButtonTouchBitcoin} onPress={this.verificarConnection}>
                    <Display enable={this.state.carregandoBitCoin}>
                        <MaterialIndicator style={estiloIndicador} size={53} />
                    </Display>
                    <Display enable={!this.state.carregandoBitCoin}>
                        <Text style={estiloTextoBitcoin}>{this.state.valorBitcoin}</Text>
                    </Display>
                </TouchableOpacity>
            </View>
        );
    }
}
