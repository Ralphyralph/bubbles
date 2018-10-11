//----------------------------------------------- Canvas 
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

//----------------------------------------------- Mouse
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener("click", function () {
    Particles.push(new Particle(mouse.x, mouse.y, 
        Math.floor(Math.random() * size), particleLife));
});

//
const Particles = [];
const size = 7;
const particleLife = 140;
const likelihoodOfSpawn = 0.08;

//----------------------------------------------- Particle
function Particle(x, y, r, l) {
    this.pos_x = x;
    this.pos_y = y;
    this.radius = r;
    this.lifespan = l;
    this.opacity = 0;
    this.vel_x = 0;
    this.vel_y = 0;
    this.speed = 0.4;
    
    
    this.life = function(index, distance) {
        this.lifespan -= 0.1;

        if (l / 2 < this.lifespan) {
            this.opacity += 1 / (this.lifespan / 0.04);
            this.radius += r / (this.lifespan/0.03);
        } else {
            this.opacity -= 1 / (this.lifespan / 0.03);
            this.radius -= r / (this.lifespan/0.04);
        }
        if (this.radius < 0 || this.opacity < 0) {
            this.lifespan = 0;
        }
        if (this.lifespan <= 0) {
            Particles.splice(index, 1);
        }   
    }
    
    this.move = function(vX, vY) {
        this.vel_x = vX;
        this.vel_y = vY;
        this.pos_x += this.vel_x;
        this.pos_y += this.vel_y;
    }

    this.collision = function() {
        // Edges boundaries
        if (this.pos_x + this.radius >= canvas.width || this.pos_x - this.radius <= 0)
        this.vel_x = -this.vel_x;
        if (this.pos_y + this.radius >= canvas.height || this.pos_y - this.radius <= 0)
        this.vel_y = -this.vel_y;
        this.pos_x = Math.min(Math.max(this.pos_x, 0 + this.radius), canvas.width - this.radius)
        this.pos_y = Math.min(Math.max(this.pos_y, 0 + this.radius), canvas.height - this.radius)
    }

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.pos_x, this.pos_y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = 'rgba('+ this.radius * 9 +', '+ this.lifespan * 3 +', 255, '+ this.opacity +')';
        ctx.fill();
    }
  
}

//----------------------------------------------- Spawn
function spawnParticles() {
    if (Math.random() <= likelihoodOfSpawn) {
        let randomPicker = Math.floor((Math.random() * 5) + 1);
        switch(randomPicker) {
            case 1: // left random
                Particles.push(new Particle(
                    0, Math.floor(canvas.height * Math.random()),
                    Math.floor(Math.random() * size), particleLife));
                break;
            case 2: // right random
                Particles.push(new Particle(
                    canvas.width, Math.floor(canvas.height * Math.random()),
                    Math.floor(Math.random() * size), particleLife));
                break;
            case 3: // Top random
                Particles.push(new Particle(
                    Math.floor(canvas.width * Math.random()), 0,
                    Math.floor(Math.random() * size), particleLife));
                break;
            case 4: // Bottom random
                Particles.push(new Particle(
                    Math.floor(canvas.width * Math.random()), canvas.height,
                    Math.floor(Math.random() * size), particleLife));
                break;
            case 5: // Random
                Particles.push(new Particle(
                    Math.floor(canvas.width * Math.random()), Math.floor(canvas.height * Math.random()),
                    Math.floor(Math.random() * size), particleLife));
                break;
        }
    }
}

function distance(aX, aY, bX, bY) {
    const distanceX = bX - aX;
    const distanceY = bY - aY;
    return { x: distanceX, y: distanceY};
} 

function followMouse(particle, distance) {
    const angle = Math.atan2(distance.y, distance.x);
    const direction = {
        x: Math.cos(angle) * particle.speed,
        y: Math.sin(angle) * particle.speed
    }
    return direction;   
}

     
//----------------------------------------------- Main loop
function mainLoop() {
    window.requestAnimationFrame(mainLoop);

    // Repaint canvas
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Display FPS
    ctx.fillStyle = "#85d8f4";
    ctx.font = "11px Arial";
    ctx.fillText("FPS: " + fps.getFPS().toString(), canvas.width - 50, canvas.height - 50);

    spawnParticles();

    Particles.forEach((particle, index) => {

        const distanceToMouse = distance(particle.pos_x, particle.pos_y, mouse.x, mouse.y);
        const direction = followMouse(particle, distanceToMouse);

        particle.life(index, distanceToMouse);
        particle.move(direction.x, direction.y);
        particle.collision();
        particle.draw();
        ;
    });

}

//----------------------------------------------- FPS
const fps = {startTime : 0,	frameNumber : 0, 
    getFPS : function(){		
        this.frameNumber++;		
        let d = new Date().getTime(),			
        currentTime = ( d - this.startTime ) / 1000,			
        result = Math.floor( ( this.frameNumber / currentTime ) );		
        if (currentTime > 1) {			
            this.startTime = new Date().getTime();			
            this.frameNumber = 0;
        }		
        return result;	
    }	
};


//----------------------------------------------- Run
mainLoop();