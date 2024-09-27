let themeButton = document.querySelector('.cambiarFondo');
themeButton.addEventListener('click', cambiarColorFondo);

function cambiarColorFondo() {
    
    let body = document.querySelector('body');

    if (body.style.backgroundColor == 'white') {
        body.style.backgroundColor = 'lightgray';
    } else if (body.style.backgroundColor == 'lightgray') {
        body.style.backgroundColor = '#333';
    } else {
        body.style.backgroundColor = 'white';
    }
}
