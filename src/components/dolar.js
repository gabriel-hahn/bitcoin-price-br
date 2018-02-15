import React, { Component } from 'react';
import { Text, View, TouchableOpacity, NetInfo, Alert } from 'react-native';
import axios from 'axios';
import { MaterialIndicator } from 'react-native-indicators';
import Display from 'react-native-display';

//Site no qual informa o valor atual do Dólar
const siteDolar = 'http://api.promasters.net.br/cotacao/v1/valores?moedas=USD&alt=json';

const Estilos = {
    estiloTextoDolar: {
        fontSize: 40,
        color: 'black',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    estiloButtonTouchDolar: {
        marginTop: 75,
        paddingTop: 15,
        paddingBottom: 25,
        marginRight: 10,
        marginLeft: 10
    },
    estiloIndicador: {
        marginTop: 40,
        alignSelf: 'center'
    }
}

const { estiloTextoDolar, estiloButtonTouchDolar, estiloIndicador } = Estilos;

export default class DolarValue extends Component {

    constructor(props) {
        super(props);
        this.state = { valorDolar: '-', carregandoDolar: true }
        this.carregarDolar = this.carregarDolar.bind(this);
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

    carregarDolar() {
        this.progressOn();
        var currencyFormatter = require('currency-formatter');
        axios.get(siteDolar).then(response => {
            if (response.data) {
                this.setState({ valorDolar: currencyFormatter.format(response.data.valores.USD.valor, { locale: 'pt-BR' }) });
                this.progressOff();
            }
        }).catch(() => {
            this.progressOff();
            this.setState({ valorDolar: '-' });
        });
    }

    componentWillMount() {
        this.carregarDolar();
    }

    progressOff() {
        this.setState({ carregandoDolar: false });
    }

    progressOn() {
        this.setState({ carregandoDolar: true });
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
            this.carregarDolar();
        }
    }

    render() {
        return (
            <TouchableOpacity style={estiloButtonTouchDolar} onPress={this.verificarConnection}>
                <Display enable={this.state.carregandoDolar}>
                    <MaterialIndicator style={estiloIndicador} size={53} />
                </Display>
                <Display enable={!this.state.carregandoDolar}>
                    <Text style={estiloTextoDolar}>{this.state.valorDolar}</Text>
                </Display>
            </TouchableOpacity>
        );
    }
}
