const middleSpace = 200;

function reloadPipes() {
    var pipes = document.querySelectorAll('.pipe');
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
reloadPipes();