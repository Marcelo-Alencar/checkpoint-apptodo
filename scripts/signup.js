const formControlsElements = document.querySelectorAll('.form-control')
const buttonCreateUserElement = document.querySelector('#buttonCreateUser')
const userPasswordElement = document.querySelector('#userPassword')
const userPasswordConfirmElement = document.querySelector('#userPasswordConfirm')


var formValidation =  {
    userName: false,
    userSurName: false,
    userEmail: false,
    userPassword: false,
    userPasswordConfirm: false
}

var formData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: ""   
}

var requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

buttonCreateUserElement.addEventListener('click', event => {

    event.preventDefault()

    let formValid = Object.values(formValidation).every(Boolean)

   
    if(formValid) {

        window.location = './index.html'
    } else {
        alert('O formulário não está preenchido corretamente.')
    }



})

var requestPostConfiguration = {
    method: 'POST',
    headers: requestHeaders
}

function createUser() {
  
    requestPostConfiguration.body = JSON.stringify(formData)

// O Fetch é responsável por fazer uma requisição para um back-end
// O parametro do fetch serve justamente para especificarmos aonde ele irá fazer a requisição

fetch('https://ctd-fe2-todo-v2.herokuapp.com/v1/users', requestPostConfiguration).then(

    response => {

        response.json().then(

            success => {

                if(response.ok) {

                   location.href = './index.html'

                } else {

                    if(success === 'El usuario ya se encuentra registrado') {

                        alert('O e-mail digitado já está cadastrado')

                    }

                }

            }

        )


    }

)
}


for(let control of formControlsElements) {

   const controlInputElement = control.children[1]

   controlInputElement.addEventListener('keyup', event => {

        let inputValid = event.target.checkValidity()

        formValidation[event.target.id] = inputValid

        if(inputValid) {

            control.classList.remove('error')
        
        } else {

            control.classList.add('error')
            
        }

   })

}

userPasswordConfirmElement.addEventListener('keyup', event => {

    if (userPasswordElement.value === userPasswordConfirmElement.value) {
  
      formControlsElements[3].classList.remove('error')
  
    } else {

      formControlsElements[3].classList.add('error')

    }

  })

  
  
 
  
