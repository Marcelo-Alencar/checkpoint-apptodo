if (sessionStorage.getItem("token") === null) {
  window.location.href = "./index.html";
}

window.addEventListener("load", function () {

  
  const API_URL = "https://ctd-fe2-todo-v2.herokuapp.com/v1";
  const username = document.getElementById("user-name");
  const skeleton = document.getElementById("skeleton");
  const closeApp = document.getElementById("closeApp");
  const formNovatarefa = document.getElementById("formNovatarefa");
  const novaTarefa = document.querySelector("input#novaTarefa");

  const listaTarefasPendentes = document.querySelector(".tarefas-pendentes");
  const listaTarefasTerminadas = document.querySelector(".tarefas-terminadas");

  const arrayNotas = [];

  const newTask = {
    description: "Nova tarefa",
    completed: false,
  };


  function obterNomeUsuario() {
    fetch(`${API_URL}/users/getMe`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: sessionStorage.getItem("token"),
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          return response.json();
        } else {
          if (response.status === 404) {
            return new Error("Esse usuário não existe");
          }
          if (response.status === 500) {
            return new Error("Erro de servidor");
          }
        }
      })
      .then(function (userCriado) {
        username.innerText = `Olá, ${userCriado.firstName}`;
      });
  }

  function fecharSessao() {
    closeApp.addEventListener("click", event => {
      event.preventDefault();
      sessionStorage.clear();
      window.location.href = "./index.html";
    });
  }

  function buscarTarefas() {
    fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: sessionStorage.getItem("token"),
      },
    })
      .then(function (response) {
        if (response.status === 200 || response.status === 201) {
          return response.json();
        } else {
          if (response.status === 400) {
            throw new Error("Alguns dados estão incorretos");
          }
          if (response.status === 401) {
            throw new Error("É necessário autorização");
          }
          if (response.status === 500) {
            throw new Error("Erro de servidor");
          }
        }
      })
      .then(function (minhasTarefas) {
        if (minhasTarefas.length === 0) {
          skeleton.classList.remove("skeleton");
          listaTarefasPendentes.innerHTML =
            "<h4>Você ainda não criou nenhuma nota</h4>";
        } else {
          listaTarefasPendentes.innerHTML = "";
          listaTarefasTerminadas.innerHTML = "";

          //colocar tarefa na tela
          listarTarefas(minhasTarefas);

          //mudar estado das tarefas pendente/concluída - concluída pendente
          toggleEstadoTarefas(minhasTarefas);

          //editar tarefas
          atualizarTarefa(minhasTarefas);

          //deletar Tarefa
          deletarTarefa(minhasTarefas);
        }
      })
      .catch(function (error) {
        console.log("Falha ao buscar tarefas");
        console.warn(error);
      });
  }




  /* Criar tarefa:*/
  function criarTarefa() {
    formNovatarefa.addEventListener("submit", event => {
      event.preventDefault();

      newTask.description = novaTarefa.value;
      newTask.completed = false;

      if (newTask.description !== "") {
        fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify(newTask),
        })
          .then(function (response) {
            console.log(response);

            if (response.status === 200 || response.status === 201) {
              return response.json();
            } else {
              if (response.status === 400) {
                throw new Error(
                  "Alguns dos dados requeridos estão incompletos"
                );
              }
              if (response.status === 401) {
                throw new Error("É necessário autorização");
              }
              if (response.status === 500) {
                throw new Error("Erro de servidor");
              }
            }
          })
          .then(function (minhaTarefa) {
        
            arrayNotas.push(minhaTarefa);
          
            listarTarefas([minhaTarefa]);

            novaTarefa.value = "";
            buscarTarefas();
          })
          .catch(function (error) {
            console.warn(error);
          });
      } else {
      }
    });

  }

  
  function deletarTarefa(minhasTarefas) {
    let botaoDeletar = document.querySelectorAll("i.eliminar");

    botaoDeletar.forEach(function (botaoDeletar) {
      botaoDeletar.addEventListener("click", function () {
        console.log("clique para deletar uma tarefa");

        let tarefaId =
          botaoDeletar.parentElement.parentElement.parentElement.dataset.tarefaid;

        fetch(`${API_URL}/tasks/${tarefaId}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          }
        });
        console.log("Deletamos a tarefa " + tarefaId);
        buscarTarefas();  
      });
    });
  }

  function atualizarTarefa(minhasTarefas) {
    let element = document.querySelectorAll("i.editar");

    element.forEach(function (element) {
      element.addEventListener("click", function () {
        console.log("clique para editar uma tarefa");

        let tarefaId =
          element.parentElement.parentElement.parentElement.dataset.tarefaid;
        let descricao =
          element.parentElement.parentElement.parentElement.dataset.description;
        const novaDescricao = prompt("descricao atual: " + descricao);

        descricao = novaDescricao;


        fetch(`${API_URL}/tasks/${tarefaId}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            description: descricao,
            completed: false,
            createdAt: new Date(),
          }),
        })
          .then(function (res) {
            console.log(res);
            return res.json();
          })
          .then(function (minhaTarefa) {
            console.log(minhaTarefa);

            buscarTarefas();  
          })
          .catch(function (error) {
            console.warn(error);
          });
        });
      });

    }
    

    
  function toggleEstadoTarefas(minhasTarefas) {
    let botoesMudaEstado = document.querySelectorAll(".tarefas");


    botoesMudaEstado.forEach(function (element) {
      element.addEventListener("click", function () {
        let tarefaId = element.parentElement.dataset.tarefaid;
        let tarefaCompleteda = element.parentElement.dataset.completed;
        let estadoTarefa = element.classList;

        if (tarefaCompleteda === "false") {
          estadoTarefa.remove(".not-done");
          estadoTarefa.add(".tarefas-terminadas");

          //mudar o estado da tarefa para completado
          fetch(`${API_URL}/tasks/${tarefaId}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Authorization: sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              completed: true,
              createdAt: new Date(),
            }),
          })
            .then((res) => res.json())
            .then(function (minhaTarefa){
              buscarTarefas();
            })
            .catch(function (error) {
              console.warn(error);
            });
        } else {
          estadoTarefa.remove(".tarefas-terminadas");
          estadoTarefa.add(".not-done");

          //mudar o estado novamente da tarefa para pendente
          fetch(`${API_URL}/tasks/${tarefaId}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Authorization: sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              completed: false,
              createdAt: new Date(),
            }),
          })
            .then((res) => res.json())
            .then(function (minhaTarefa) {
              buscarTarefas();  
            })
            .catch(function (error) {
              console.warn(error);
            });
        }
      });
    });
  }

  function listarTarefas(arrayNotas) {
    arrayNotas.forEach((tarefa) => {
      let hora = new Date(tarefa.createdAt);

      let template = `<li data-tarefaId=${tarefa.id} data-completed=${
        tarefa.completed
      } data-description=${tarefa.description} class="tarefa">
    <div id="estado" class="not-done tarefas"></div>
    <div id="descricaoID" class="descricaoclass">
    <p id="nomeTarefa" class="nome">${tarefa.description}</p>
    <p id="timestamp" class="timestamp">${hora.toLocaleDateString()} ${hora.getHours()}:${hora.getMinutes()}</p>
      <div class="botoes">
        <i class="fas fa-pen-fancy editar"></i>
        <i class="far fa-trash-alt eliminar"></i>
      </div>
    </div>
    `;

      if (tarefa.completed == false) {
        listaTarefasPendentes.innerHTML += template;
      } else {
        listaTarefasTerminadas.innerHTML += template;
      }
    });
    
    skeleton.classList.remove("skeleton");

  }

//

  obterNomeUsuario();

  fecharSessao();

  buscarTarefas();

  criarTarefa();

});
