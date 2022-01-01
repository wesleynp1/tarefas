import {StyleSheet} from 'react-native';

const container = StyleSheet.create(
    {
        bordasCabeçalho :{
            borderWidth: 5,
            borderRadius: 16,     
            marginBottom: 32,
            marginHorizontal: 32,
        },

        tarefaConcluida : {
            backgroundColor: "green",
            borderWidth: 5,
            marginBottom: 32,
            marginHorizontal: 32,
        },

        tarefaIncompleta : {
            backgroundColor: "grey",
            borderWidth: 5,
            marginBottom: 32,
            marginHorizontal: 32,
        }
    }
);

export default container;