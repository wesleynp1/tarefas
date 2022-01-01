import React, { Component } from 'react';
import {ScrollView, View,Text, TextInput, Button} from 'react-native';
import textGeral from './src/estilos/textoGeral';
import container from './src/estilos/container';
import Database from './Database';
import tarefa from './Tarefa';

const db = new Database();

class App extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {tarefas : []}
    this.carregaTarefasDoBancoDeDados();

    this.NovaTarefa = new tarefa('texto padrão','01/01/2020',0);

    this.BotaoConcluirPressionado = this.BotaoConcluirPressionado.bind(this);
    this.excluiTarefa = this.excluiTarefa.bind(this);
  }

  carregaTarefasDoBancoDeDados()
  {
    db.listaDeTarefas().then((Tarefas)=>{
      this.setState({tarefas: Tarefas});
    });
  }

  render(){
    return(
      <ScrollView>
        <Text style={textGeral.titulo}>Hello World</Text> 
        <Text style={textGeral.titulo}>Tarefas</Text> 

          <View style={container.bordasCabeçalho}>
            <TextInput onChangeText={(u) => this.NovaTarefa.descricao=u} placeholder="Descrição da tarefa no infinitivo" />
            <TextInput onChangeText={(u) => this.NovaTarefa.DataTermino=u} placeholder="Data término da tarefa(formato DD/MM/AAAA)" />
            <TextInput onChangeText={(u) => this.NovaTarefa.priori=u} keyboardType="numeric" placeholder="Nível de prioridade de 1(trivial) a 5(urgente)"/>

            <Button onPress={this.BotaoConcluirPressionado} title="Adicionar!"></Button>
          </View>
          
          <View>
          <Text style={textGeral.subtitulo}>tarefas a serem feitas:</Text>
            {this.renderArrayDeTarefas()}
          </View>
      </ScrollView>
    );
  }

  renderArrayDeTarefas()
  {
    let TextoGeral = []

    for(let i=0;i<this.state.tarefas.length;i++)
    {
      var tarefa = this.state.tarefas[i];

      tarefa.estaAtrasada();
      var estiloAtraso = ((tarefa.atrasado && !tarefa.concluido)? textGeral.atrasado : textGeral.semAtraso);

      var estiloConcluido = (tarefa.concluido==true ? container.tarefaConcluida : container.tarefaIncompleta);

      TextoGeral.push(
      <View style={container.bordasTarefas , estiloConcluido}>
        <Text style={estiloAtraso}>{tarefa.falar()}</Text>
        <Button onPress={() => {this.excluiTarefa(this.state.tarefas[i].id);}}  title="Excluir"/>
        <Button onPress={() => {this.concluiTarefa(this.state.tarefas[i].id);}}  title="Concluir tarefa!"/>
      </View>);
    }

    return (TextoGeral);
  }
  
  excluiTarefa(i)
  {
    db.ApagaTarefa(i).then((resolve)=>{
      console.log('excluirTarefa: '+resolve)
    }).catch((erro)=>{
      console.log('erro em excluirTarefa: '+erro);
    });
      this.carregaTarefasDoBancoDeDados();
  }

  concluiTarefa(i)
  {
    db.concluirTarefa(i).then((resolve)=>{
      console.log('concluiTarefa: '+resolve)
    }).catch((erro)=>{
      console.log('erro em concluiTarefa: '+erro);
    });
      this.carregaTarefasDoBancoDeDados();
  }

  BotaoConcluirPressionado()
  {
    this.AdicionaTarefasAoBD(this.NovaTarefa);
    this.carregaTarefasDoBancoDeDados();
    
    console.log(this.x);
  }

  AdicionaTarefasAoBD(addTarefa) 
  {
    db.addTarefa(addTarefa).then((result)=>{
      console.log('Tarefa adicionada');
    }).catch((erro)=>{
      console.log('Erro ao adicionar uma nova tarefa: '+erro);
    });
  }

  ApagaTodasTarefas()
  {
    db.ApagaTodasTarefas();
  }

  ApagaTabelaTarefas()
  {
    db.apagaTabela();
  }
}
  
export default App;