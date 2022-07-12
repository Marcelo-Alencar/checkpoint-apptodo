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


buttonCreateUserElement.addEventListener('click', event => {

    event.preventDefault()

    let formValid = Object.values(formValidation).every(Boolean)

   
    if(formValid) {

        window.location = './index.html'
    } else {
        alert('o formulario nao esta preenchido corretamente.')
    }



})

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

