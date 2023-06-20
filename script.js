const bird = document.getElementById('bird');
var pipes = document.querySelectorAll('.pipe');
const score = document.getElementById('score');
const startButton = document.getElementById('start');
var visitedPipes = []

const gameOverDisplay = document.getElementById('gameover'); 

const middleSpace = 250;

var ongoinggame = false; 

const gravity = 9.82;
var dy = 0; 

const upperLimit = 0.15;
const lowerLimit = 0.85;

const startOverButton = document.getElementById('startover');

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

// document.addEventListener('keydown', e => {
//     if(e.code == "Space")
//         jump();
// });

// function jump() {
//     dy = -30;
// }

setInterval(run, 100); 
function run() {
    if(ongoinggame) {
        // const rect = bird.getBoundingClientRect();
        // const y = parseFloat(rect.top) || 0;

        // dy += gravity; 

        // const newY = y + dy; 

        // if(dy > 0)
        //     dy-= 2;
        // if(dy < 0)
        //     dy = 0; 

        bird.style.top = dy + "px"; 

        if (isColliding() || dy >= window.innerHeight - bird.offsetHeight ) {
            gameOver();
        } else moveBackground();
        
    }
}

function gameOver() {
    // ongoinggame = false; 
    // gameOverDisplay.style.visibility = "visible";
}

function moveBackground() {
    pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => {
        const rect = pipe.getBoundingClientRect();
        const left = parseInt(pipe.style.left, 10);

        const newLeft = left - 10; 

        pipe.style.left = newLeft + "px"; 

        const pipeRightSide = rect.x + pipe.offsetWidth;
        const birdLeftSide = bird.getBoundingClientRect().x; 

        // increment score if bird just passed pipe
        const margin = 10; 
        if(!visitedPipes.includes(pipe) && pipeRightSide < birdLeftSide 
                && (pipeRightSide - birdLeftSide) < margin) {
            const points = parseInt(score.innerHTML);
            const newPoints = points + 1; 
            score.innerHTML = newPoints; 
            visitedPipes.push(pipe)
        }
    });

    if(pipes.length > 0) {
        const firstX = pipes[0].getBoundingClientRect().left;
        if(firstX < -100) {
            document.getElementById('pipes').removeChild(pipes[0]);
            visitedPipes.shift();
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

startOverButton.addEventListener('click', restart)

function restart() {
    ongoinggame = true; 

    document.getElementById('gameover').style.visibility = 'hidden';
    
    pipes = document.querySelectorAll('.pipe');
    pipes.forEach(pipe => {
        document.getElementById('pipes').removeChild(pipe);
    });

    bird.style.top = "443px";
    dy = 443; 

    createPipe();
}


// -------------------------------------------------------

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 32; 

const amountOfSamples = analyser.frequencyBinCount;
const dataArray = new Uint8Array(amountOfSamples);

navigator.mediaDevices.getUserMedia({ audio: true })
.then((stream) => {
    const mic = audioContext.createMediaStreamSource(stream);
    mic.connect(analyser);

    jump();
})
.catch((error) => {
    console.error('Error when trying to connect to microphone:', error);
});

function jump() {
    if(ongoinggame) {
        requestAnimationFrame(jump);

        analyser.getByteFrequencyData(dataArray);

        const docHeight = document.body.scrollHeight;

        const value = dataArray[0] / 255; // value between 0 and 1 
        dy = docHeight - (value * docHeight);
        console.log(dy);
    }
}

function start() {
    audioContext.resume();

    ongoinggame = true; 
    startButton.style.visibility = 'hidden';

    jump();
}

startButton.addEventListener('click', start);
