const bird = document.getElementById('bird');
var pipes = document.querySelectorAll('.pipe');

const gameOverDisplay = document.getElementById('gameover'); 

const middleSpace = 200;

var ongoinggame = true; 

const gravity = 9.82;
var dy = 0; 

function reloadPipes() {
    pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => {
        const value = parseFloat(pipe.getAttribute('height-percentage'));
    
        const topHeight = parseInt(value * pipe.clientHeight) - parseInt(middleSpace/2); 
        const bottomHeight = parseInt((1 - value) * pipe.clientHeight) - parseInt(middleSpace/2);
    
        const top = document.createElement('div');
        const bottom = document.createElement('div');
    
        top.classList.add('pipePart');
        bottom.classList.add('pipePart');
    
        top.style.height = topHeight + "px";
        bottom.style.height = bottomHeight + "px";
    
        top.style.marginBottom = middleSpace + "px";
    
        pipe.appendChild(top);
        pipe.appendChild(bottom);
    
    
    });
}

function createPipe(value) {
    const pipe = document.createElement('div');
    pipe.classList.add('pipe');
    pipe.setAttribute('height-percentage', value);

    document.getElementById('pipes').appendChild(pipe);
}

createPipe(0.5);
createPipe(0.85);
createPipe(0.35);
reloadPipes();

document.addEventListener('keydown', e => {
    if(e.code == "Space")
        jump();
});

function jump() {

}

setInterval(run, 100); 
function run() {
    if(ongoinggame) {
        const rect = bird.getBoundingClientRect();
        const y = parseFloat(rect.top) || 0;

        dy += gravity; 

        const newY = y + dy; 

        bird.style.top = `${newY}px`; 

        if (newY >= window.innerHeight - bird.clientHeight) {
        gameOver();
        }
    }
}

function gameOver() {
    ongoinggame = false; 
    gameOverDisplay.style.visibility = "visible";
}