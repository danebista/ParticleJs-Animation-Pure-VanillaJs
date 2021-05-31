const canvas = document.getElementById("canvas-window");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse={
    x:null,
    y:null,
    radius: (canvas.height / 100) * (canvas.width / 100) 
}


window.addEventListener('mousemove', 
function(event){
    mouse.x = event.x;
    mouse.y = event.y;
}
);

class Particle{
    constructor(x,y, directionX, directionY, size, color='#ffffff'){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#ffffff';
        ctx.closePath();
        ctx.fill();

    }

    update(){
        if (this.x > canvas.width || this.x < 0){
            this.directionX *= -1;
        }

        if (this.y > canvas.height || this.y < 10){
            this.directionY *= -1;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        let distance =Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.size){
            
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10){
                this.x += 10;
            }

            if (mouse.x > this.x && this.x > this.size * 10){
                this.x -= 10;
            }

            if (mouse.y < this.y && this.y < canvas.height - this.size * 10){
                this.y += 10;
            }

            if (mouse.y > this.y && this.y > this.size * 10){
                this.y -= 10;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

function init(){
    particleArray= [];
    let numberOfParticles = (canvas.height * canvas.width) / 9500;

    for (let i=0; i < numberOfParticles; i++){
        let size = (Math.random() * 1) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        
        particleArray.push(new Particle( x , y , directionX, directionY, size));
    }
}

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0, innerWidth, innerHeight);

    for (let i=0; i< particleArray.length; i++){
        particleArray[i].update();
    }
    connect();
}

function connect(){
    let opacity=1
    for (let a = 0; a < particleArray.length; a++){
        for (let b = a+1; b < particleArray.length; b++){
            let deferx = (particleArray[a].x - particleArray[b].x)
            let defery = (particleArray[a].y - particleArray[b].y)

            let distance = defery * defery + deferx * deferx;

            if (distance < (canvas.width / 10) * (canvas.height / 10)){
                opacity=  1- distance/20000
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', ()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = (canvas.height / 100) * (canvas.width / 100);
    init()
})
init();
animate();

window.addEventListener('mouseout', ()=>{
    mouse.x = undefined;
    mouse.y = undefined;
})