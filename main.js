let btns = document.querySelectorAll("*[data-modal-btn]")

for(let i = 0; i < btns.length; i++){
    btns[i].addEventListener('click', function(){
        let name = btns[i].getAttribute('data-modal-btn');
        let modal = document.querySelector("*[data-modal-window='"+name+"']");
        modal.style.display = "block";
        let close = modal.querySelector(".close_modal_window");
        close.addEventListener('click', function(){
            modal.style.display = "none";
        })
    })
}

window.onclick = function (e){
    if(e.target.hasAttribute('data-modal-window')){
        let models = document.querySelectorAll('*[data-modal-window]');
        for(let i = 0; i < models.length; i++){
            models[i].style.display = "none";
        }
    }
}

// document.addEventListener('DOMContentLoaded', function() {
//     var openNewPageButton = document.getElementById('openNewPageButton');
//     openNewPageButton.addEventListener('click', function(event) {
//         event.preventDefault(); // Зупиняємо стандартну подію відправки форми
//         window.location.href = 'blocks/mainpage.html'; // Замініть 'нова_сторінка.html' на URL нової сторінки, яку ви хочете відкрити
//     });
// });    


function menuOnClick() {
    document.getElementById("menu-bar").classList.toggle("change");
    document.getElementById("nav").classList.toggle("change");
    document.getElementById("menu-bg").classList.toggle("change-bg");
  }

  