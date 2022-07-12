const formControlsElements = document.querySelectorAll('.form-control')
const buttonLoginUserElement = document.querySelector('#buttonLoginUser')
var userEmailValue

var formValidation =  {
    userEmail: false,
    userPassword: false
}

buttonLoginUserElement.addEventListener('click', event => {

    event.preventDefault()

    let formValid = Object.values(formValidation).every(Boolean)

    if(formValid) {

        console.log(userEmailValue)

        localStorage.setItem('userEmail', userEmailValue)

        window.location = './tarefas.html'

    }

})

for(let control of formControlsElements) {

    const controlInputElement = control.children[1]
 
    controlInputElement.addEventListener('keyup', event => {
 
         let inputValid = event.target.checkValidity()
 
         formValidation[event.target.id] = inputValid
 
         if(event.target.id === 'userEmail') {
 
            userEmailValue = event.target.value

         } 

         if (inputValid){

            control.classList.remove('error')

         } else {
            
             control.classList.add('error')
         }
        
 
    })
 
 }