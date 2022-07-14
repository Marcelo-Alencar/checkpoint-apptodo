const formLogin = document.querySelector("form#formLogin");

const inputEmail = document.getElementById('inputEmail');
const errorEmail = document.getElementById('errorEmail');

const inputPass = document.getElementById('inputPassword');
const errorPass = document.getElementById('errorPass');

const API_URL = "https://ctd-fe2-todo-v2.herokuapp.com/v1";


//validação login
formLogin.addEventListener("submit", event =>{
    event.preventDefault();

    let erros = [];

    //validação email
    validarEmail(erros);

    //validação pass
    const pass = validarPass(erros);


    //recorrer erros y mostrarlo
    if(erros.length !== 0){
        //mostrar erros
        switchErrores(erros);
    } else {

        console.log(pass);
        let datos = {
            "email": inputEmail.value,
            "password": pass
        }

        fetch(`${API_URL}/users/login`, {
            method : "POST", 
            headers : {
                "content-type": "application/json"
            }, 
            body: JSON.stringify(datos),
        })
        .then(function(response){
            console.log("Respossta");
            console.log(response);
            
            if(response.status === 200 || response.status === 201){
                return response.json();
            } else {
                if(response.status === 400){
                    throw new Error ("Senha incorreta")
                }
                if(response.status === 404){
                    throw new Error("usuário inexistente")
                }
                if(response.status === 500){
                    throw new Error("Erro de servidor")
                }
            }
        })
        .then(function(userCriado){

            sessionStorage.setItem("token", userCriado.jwt);
            window.location.href = "./tarefas.html"
        })
        .catch(function (error) {
            console.log(error)
        })

        console.log(JSON.stringify(datos));

    }
});




//validação email
function validarEmail(erros) {
    let inputEmailValue = inputEmail.value.trim();

    if(inputEmailValue === ""){
        erros.push({
            input: "email", 
            error: "Email obrigatório"
        })
    }

    //validação com REgex
    if(!inputEmailValue.match(/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/ )
    ){
        erros.push({
            input: "email", 
            error: "Forneça um email válido"
        })
    }
}

//validação senha
function validarPass(erros) {
    let inputPassValue = inputPass.value;



    if (inputPassValue === "") {
        erros.push({
            input: "pass",
            error: "Coloque uma senha válida",
        });
    }

    return inputPassValue;
}



function switchErrores(erros) {
    erros.forEach(error => {
        switch (error.input) {
            case "email":

                errorEmail.innerText = error.error; 
                break;
        
            case "pass":
                errorPass.innerText = error.error;
                break;
            default:
                break;
        }
    });
}