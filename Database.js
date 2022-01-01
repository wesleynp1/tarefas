import SQLite from "react-native-sqlite-storage";
import tarefa from './Tarefa'
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Tarefas.db";
const database_version = "1.0";
const database_displayname = "Banco de Dados de Tarefas";
const database_size = 200000;

export default class Database {

  iniciaBD() {
    let bd;
    return new Promise((resolve) => {
      SQLite.echoTest()
        .then(() => {
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size
          ).then(BD => {
              bd = BD;
              bd.executeSql('SELECT 1 FROM Tarefas LIMIT 1').then(() => {
              }).catch((error) =>{
                  bd.transaction((tx) => {
                      tx.executeSql('CREATE TABLE IF NOT EXISTS Tarefas (tarefaId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, descricao VARCHAR(200), data VARCHAR(10), prioridade INT(1),concluido BOOL)');
                  }).then(() => {
                    console.log("Tabela 'Tarefas' criada com sucesso");
                  }).catch(error => {
                    console.log("Erro ao criar a tabela 'Tarefas': "+error);
                  });
              });
              resolve(bd);
            })
            .catch(error => {
            });
        })
        .catch(error => {
        });
      });
  };

  fechaBD(bd) {
    if (bd) {
      bd.close()
        .then(status => {
        })
        .catch(error => {
          console.log('Erro ao fechar o banco de dados: '+error);
        });
    } else {
    }
  };

  listaDeTarefas() {
    return new Promise((resolve) => {
      const Tarefas = [];
      this.iniciaBD().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Tarefas', []).then(([tx,results]) => {
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let Tdescricao = results.rows.item(i).descricao;
              let Tdata = results.rows.item(i).data;
              let Tprioridade = results.rows.item(i).prioridade;

              var novaTarefa = new tarefa(Tdescricao,Tdata,Tprioridade);

              novaTarefa.id = results.rows.item(i).tarefaId;
              novaTarefa.concluido = results.rows.item(i).concluido;

              Tarefas.push(novaTarefa);
            }
            
            resolve(Tarefas);
          });
        }).then((result) => {
          this.fechaBD(db);
        }).catch((err) => {
          console.log('ERRROOOOOO '+err);;
        });
      }).catch((err) => {
        console.log('ERRROOOOOO '+err);;
      });
    });  
  }
  
  addTarefa(tarefa) {
    return new Promise((resolve) => {
      this.iniciaBD().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO Tarefas(descricao, data, prioridade) VALUES (?, ?, ?)', [tarefa.descricao, tarefa.DataTermino, tarefa.priori]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          console.log('Tarefa adicionada com sucesso!');
          this.fechaBD(db);
        }).catch((err) => {
          console.log('Erro ao adicionar a Tarefa: '+err);
        });
      }).catch((err) => {
        console.log('Erro ao iniciar o Banco de Dados: '+err);
      });
    });  
  }

  ApagaTarefa(id) {
    return new Promise((resolve) => {
      this.iniciaBD().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM Tarefas WHERE tarefaId='+id).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          console.log('Tarefa foi apagada! :' +result);
          this.fechaBD(db);
        }).catch((err) => {
          console.log('Erro ao apagar a Tarefa: '+err);
        });
      }).catch((err) => {
        console.log('Erro ao iniciar o Banco de Dados: '+err);
      });
    });  
  }

  concluirTarefa(id) {
    return new Promise((resolve) => {
      this.iniciaBD().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE Tarefas SET concluido=1 WHERE tarefaId='+id).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          console.log('Tarefa foi atualizada! :' +result);
          this.fechaBD(db);
        }).catch((err) => {
          console.log('Erro ao atualizar a Tarefa: '+err);
        });
      }).catch((err) => {
        console.log('Erro ao iniciar o Banco de Dados: '+err);
      });
    });  
  }

  ApagaTodasTarefas() {
    return new Promise((resolve) => {
      this.iniciaBD().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM Tarefas').then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          console.log('Todas as tarefas foram apagadas! ' +result);
          this.fechaBD(db);
        }).catch((err) => {
          console.log('Erro ao adicionar a Tarefa: '+err);
        });
      }).catch((err) => {
        console.log('Erro ao iniciar o Banco de Dados: '+err);
      });
    });  
  }

  apagaTabela()
  {
    return new Promise((resolve) => {
      this.iniciaBD().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DROP TABLE Tarefas').then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          console.log('A tabela foi apagada! ' +result);
          this.fechaBD(db);
        }).catch((err) => {
          console.log('Erro ao apagar a tabela: '+err);
        });
      }).catch((err) => {
        console.log('Erro ao iniciar o Banco de Dados: '+err);
      });
    });  
  }
}
