export default class tarefa
{
  constructor(textoUsuario, DataUsuario, prioridadeUsuario)
  {
    this.id = null;
    this.descricao = textoUsuario;
    this.DataTermino = DataUsuario;
    this.priori = parseInt(prioridadeUsuario);
    this.atrasado = false;
    this.concluido = false;
  }

  txtPrioridade()
  {
    const nivelDeprioridade = ['trivial',' de baixa prioridade', 'de média prioridade',' de alta prioridade',' urgente'];  
    
    if(this.priori>5){this.priori=5;}
    if(this.priori<1){this.priori=1;}

    return nivelDeprioridade[this.priori-1];
  }

  txtDataTermino()
  {
    if(this.DataTermino.length==10)
    {
    var dia = parseInt(this.DataTermino.substring(0,2));
    var mes = parseInt(this.DataTermino.substring(3,5));
    var ano = parseInt(this.DataTermino.substring(6,11));

    this.estaAtrasada(dia,mes,ano);

    //DEFINE O TEXTO APRESENTADO AO USUARIO
    var mesesDoAno = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto','setembro','outubro','novembro','dezembro']
    var t = dia + " de " + mesesDoAno[mes-1] + ' de ' + ano;

    return t;
    }
  }

  estaAtrasada()
  {

    var dia = parseInt(this.DataTermino.substring(0,2));
    var mes = parseInt(this.DataTermino.substring(3,5));
    var ano = parseInt(this.DataTermino.substring(6,11));

    //VERIFICA SE A TAREFA ESTA ATRASADA
    var dataAtual = new Date();

    if(dataAtual.getFullYear()>ano){this.atrasado = true;}
    if(dataAtual.getFullYear()<ano){this.atrasado = false;}
    if(dataAtual.getFullYear()==ano)
    {
      if(dataAtual.getMonth()>mes-1){this.atrasado = true;}
      if(dataAtual.getMonth()<mes-1){this.atrasado = false;}
      
      if(dataAtual.getMonth()==mes-1)
      {
        if(dataAtual.getDate()>dia){this.atrasado = true;}
        if(dataAtual.getDate()<=dia){this.atrasado = false;}
      }
    }
  }

  falar()
  { 
    this.estaAtrasada();
    var atraso = (this.atrasado ? 'esta atrasada' : 'ainda está dentro do prazo');
    var concluido = (this.concluido ? 'TAREFA CONCLUÍDA' : 'TAREFA INCOMPLETA');

    return (
      concluido +'\n'+
      '\nVocê deve ' + this.descricao+' até '+ this.txtDataTermino() + 
      '.\nEsta tarefa é ' + this.txtPrioridade() + ' e ' + atraso + '\n'
    );
  }
}