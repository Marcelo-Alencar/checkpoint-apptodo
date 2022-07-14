
const API_URL = "https://ctd-fe2-todo-v2.herokuapp.com/v1";

const formRegistro = document.getElementById("formularioRegistro");

const inputNombre = document.getElementById("inputNome");
const erroNome = document.getElementById("erroNome");

const inputSobrenome = document.getElementById("inputSobrenome");
const erroSobrenome = document.getElementById("erroSobrenome");

const inputEmailElement = document.getElementById("inputEmail");
const erroEmail = document.getElementById("erroEmail");
const errorEmailVazio = document.getElementById("erroEmailVazio");

const inputSenha = document.getElementById("criaSenha");
const erroCriarSenha = document.getElementById("errocriarSenha");
const validarSenha = document.getElementById("validarSenha");

const confirmarSenha = document.getElementById("confirmarSenha");
const erroconfirmarSenha = document.getElementById("erroConfirmaSenha");
 


formRegistro.addEventListener("submit", event => {
    event.preventDefault();

    let erros = [];


    validarNome(erros);

    validarSobrenome(erros);

    validarEmail(erros);

    let pass = validarPass(erros);

    validarRepetirPass(erros, pass);


    if (erros.length !== 0) {

        switcherros(erros);

    } else {

        let infos = {
            firstName: inputNombre.value,
            lastName: inputSobrenome.value,
            email: inputEmailElement.value,
            password: inputSenha.value
        };

        fetch(`${API_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": sessionStorage.getItem("token"),
            },
            body: JSON.stringify(infos),
        })
            .then(response => {
                if (response.ok) {  
                    switcherros(erros);
                    alert("Usuário criado com sucesso");
                    window.location.href = "./index.html";
                } else {
                    throw new Error("Erro ao criar usuário");
                }
            }
            )
            
            .then(function (response) {

                if (response.status === 200 || response.status === 201) {
                    return response.json();
                } else {
                    if(response.status === 400) {
                        throw new Error("Usuário já está cadastrado / Alguns dos dados estão incompletos")
                    }
                    
                    if(response.status === 500){
                        throw new Error("Erro de servidor")
                    } 
                }
            })
            .then(function (userCriado) {
                console.log("Usuário criado: ");
                console.log(userCriado);
                formRegistro.reset(); 

                window.location.href = "./index.html";
                
            })
    
            console.log("JSON STRINGIFY: " + JSON.stringify(infos));
   
    } 
});


function validarNome(erros) {
    let inputNombreValue = inputNombre.value.trim();

    if (inputNombreValue === "" || inputNombreValue.isNull) {
        erros.push({
            input: "nome",
            mjeError: "Adicione um nome",
        });
    }
}

function validarSobrenome(erros) {
    let inputSobrenomeValue = inputSobrenome.value.trim();

    if (inputSobrenomeValue === "" || inputSobrenomeValue.isNull) {
        erros.push({
            input: "sobrenome",
            mjeError: "Adicione um sobrenome",
        });
    }
}

function validarEmail(erros) {
    let inputEmailValue = inputEmailElement.value.trim();

    if (inputEmailValue === "") {
        erros.push({
            input: "emailVazio",
            mjeError: "Email obrigatório\n"
        });
    }


    if (!inputEmailValue.match(/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/)) {
        erros.push({
            input: "emailInvalido",
            mjeError: "Adicione um email válido",
        });
    }
}

function validarPass(erros) {
    let inputSenhaValue = inputSenha.value.trim();

    if (inputSenhaValue === "") {
        erros.push({
            input: "pass",
            mjeError: "Adicione uma senha\n",
        });
    }

    if (!inputSenhaValue.match(/^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/)) {
        erros.push({
            input: "validarPass",
            mjeError: "A senha deve ter entre 8 e 16 caracteres, pelo menos um dígito, pelo menos uma minúscula, pelo menos uma maiúscula e pelo menos um caractere não alfanumérico."
        });
    }

    return inputSenhaValue;
}


function validarRepetirPass(erros, pass) {
    let repetirPassValue = confirmarSenha.value;

    if (pass !== repetirPassValue) {
        erros.push({
            input: "confirmarPass",
            mjeError: "As senhas devem ser iguais"
        });
    }

}


function switcherros(erros) {
    erros.forEach((error) => {
        switch (error.input) {
            case "nome":

                erroNome.innerText = error.mjeError;
                break;

            case "sobrenome":
                erroSobrenome.innerText = error.mjeError;
                break;

            case "emailVazio":

                errorEmailVazio.innerText = error.mjeError;
                break;

            case "emailInvalido":
                erroEmail.innerText = error.mjeError;
                break;

            case "pass":
                erroCriarSenha.innerText = error.mjeError;
                break;

            case "validarPass":
                validarSenha.innerText = error.mjeError;
                break;

            case "confirmarPass":
                erroconfirmarSenha.innerText = error.mjeError;
                break;

            default:
                break;
        }
    });
}