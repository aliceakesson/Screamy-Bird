const bird = document.getElementById('bird');
var pipes = document.querySelectorAll('.pipe');

const gameOverDisplay = document.getElementById('gameover'); 

const middleSpace = 250;

var ongoinggame = true; 

const gravity = 9.82;
var dy = 0; 

const upperLimit = 0.15;
const lowerLimit = 0.85;

function createPipe() {
    const value = Math.random() * (lowerLimit - upperLimit) + upperLimit;

    const pipe = document.createElement('div');
    pipe.classList.add('pipe');
    
    pipe.style.left = "600px";

    pipes = document.querySelectorAll('.pipe');
    if(pipes.length > 0) {
        const lastElem = pipes[pipes.length - 1];
        const rect = lastElem.getBoundingClientRect();
        const lastX = rect.left;

        const x = lastX + 300;

        pipe.style.left = x + "px";
    } 

    document.getElementById('pipes').appendChild(pipe);

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
}

createPipe();
createPipe();
createPipe();

document.addEventListener('keydown', e => {
    if(e.code == "Space")
        jump();
});

function jump() {
    dy = -30;
}

setInterval(run, 100); 
function run() {
    if(ongoinggame) {
        const rect = bird.getBoundingClientRect();
        const y = parseFloat(rect.top) || 0;

        dy += gravity; 

        const newY = y + dy; 

        if(dy > 0)
            dy-= 2;
        if(dy < 0)
            dy = 0; 

        bird.style.top = newY + "px"; 

        if (isColliding() || newY >= window.innerHeight - bird.offsetHeight ) {
            gameOver();
        } else moveBackground();
        
    }
}

function gameOver() {
    ongoinggame = false; 
    gameOverDisplay.style.visibility = "visible";
}

function moveBackground() {
    pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => {
        const rect = pipe.getBoundingClientRect();
        const left = parseInt(pipe.style.left, 10);

        const newLeft = left - 10; 

        pipe.style.left = newLeft + "px"; 
    });

    if(pipes.length > 0) {
        const firstX = pipes[0].getBoundingClientRect().left;
        if(firstX < -100) {
            document.getElementById('pipes').removeChild(pipes[0]);
        }
    }

    if(pipes.length > 0) {
        const lastX = pipes[pipes.length - 1].getBoundingClientRect().left;
        if(lastX < 800)
            createPipe();
    } else createPipe();
}

function isColliding() {
    pipes = document.querySelectorAll('.pipe');
    var collision = false; 
    pipes.forEach(pipe => {
        if(!collision) {
            const pipeRect = pipe.getBoundingClientRect();
            const birdRect = bird.getBoundingClientRect();

            // if bird passed pipe without going through it's two parts
            if((pipeRect.x <= (birdRect.x + bird.offsetWidth) 
                && (pipeRect.x + pipe.offsetWidth) >= birdRect.x)
                && (pipe.firstChild.offsetHeight >= birdRect.y
                    || pipe.lastChild.getBoundingClientRect().y <= (birdRect.y+bird.offsetHeight))) { 
                collision = true; 
            }
        }
    });
    return collision; 
}