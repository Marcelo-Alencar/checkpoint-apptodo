let token = localStorage.getItem('token')
const apiUrl = 'https://ctd-todo-api.herokuapp.com/v1'
const createTaskButtonElement = document.querySelector('#createTaskButton')
const skeletonElement = document.querySelector('#skeleton')
const listTasks = document.querySelector('.tarefas-pendentes')
const headersAuthRequest = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': token
}

function getUserInfo() {

    fetch('https://ctd-todo-api.herokuapp.com/v1/users/getMe', { headers: headersAuthRequest }).then(

        response => {

            if(response.ok) {

                response.json().then(

                    user => {

                        console.log(user)
                        console.log(`${user.firstName} ${user.lastName}`)

                        // !Insira a lógica aqui para mostrar o Nome Completo do usuário no HTML da Aplicação

                    }

                )

            } else {

                localStorage.clear()
                window.location.href = './../index.html'

            }

        }

    )

}



// Função que Obtem as Tarefas
function getTasks() {

    fetch(`${apiUrl}/tasks`, { headers: headersAuthRequest }).then(

        response => {

            response.json().then(

                tasks => {

                    // Remoção dos itens que estavam antes dentro da Lista inicial
                    listTasks.innerHTML = ''

                    for(let task of tasks) {

                        console.log(task)

                        // !Construir a lógica de exibir as tarefas no html

                    }

                }

            )

        }

    )

}



// Função que Cria uma Task
function createTask() {

    // Objeto que será enviado para a API
    let data = {
        description: 'Tarefa Teste',
        completed: false
    }

    // Objeto que servira como Configuração da Requisição de POST
    let postRequestConfiguration = {
        method: 'POST',
        headers: headersAuthRequest,
        body: JSON.stringify(data)
    }

    fetch(`${apiUrl}/tasks`, postRequestConfiguration).then(

        response => {

            if(response.ok) {

                // !Inserir Lógica para obter as Tarefas Novamente

            }

        }

    )

}


// Event Listener do Botão para criar Task
createTaskButtonElement.addEventListener('click', event => {

    event.preventDefault()

    // Chama a função que Cria uma Tarefa
    createTask()

})



// Verificação se o Token Existe
if(token === null) {

    // Caso o Token não Exista ele redireciona para o Index
    window.location.href = './../index.html'

} else {

    // Chama a função que obtem os Dados do Usuários
    getUserInfo()


    // Chama a função que obtem as Tarefas
    getTasks()

}