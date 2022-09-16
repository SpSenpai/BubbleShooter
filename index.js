
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
let score = 0;
let firttTime=true;
let myInterval = null
let diffNum = 1.3

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor (x,y,radius,color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    draw () {
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw () {
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
    }

    update () {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y

    }
}

class Enemy {
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw () {
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
    }

    update () {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y

    }
}

const friction  = 0.98

class Particle {
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw () {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update () {
        this.draw()
        this.velocity.x *=friction
        this.velocity.y *=friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.02
    }
}


const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player (x,y,10,'white')
let projectiles = []
let enemies = []
let particles = []

function enit(){
    player = new Player (x,y,10,'white')
    projectiles.length=0
    enemies.length=0
    particles.length=0
    score=0;
    document.getElementById('score').innerText = score;
}
    
let spawnTime=1000;

function spawnEnemyTime(spawnTime){
    return spawnTime/diffNum;
}

function spawnEnemy(){
    myInterval = setInterval(()=>{
        const radius = Math.random() * (30 - 5) + 5
        let x,y
        if(Math.random()>0.5){
            x = Math.random()<0.5 ? 0-radius : canvas.width+radius
            y = Math.random() * canvas.height
        }
        else{
            x = Math.random() * canvas.width
            y = Math.random()<0.5 ? 0-radius : canvas.height+radius
        }

        const color = `hsl(${Math.random()*360},50%,50%)`

        const angle = Math.atan2(canvas.height/2-y,canvas.width/2-x)
        const velocity = {
        x : Math.cos(angle)*diffNum,
        y : Math.sin(angle)*diffNum
        }
        enemies.push(new Enemy(x,y,radius,color,velocity))
    },spawnEnemyTime(spawnTime))
}

let animateId;

function animate(){    
    animateId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.2)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()

    particles.forEach((particle,index) => {
        if(particle.alpha<=0){
            particles.slice(index,1)
        }
        else{
            particle.update()
        }
    })

    projectiles.forEach((projectile,indx) => {
        projectile.update()

        //Remove projectile after they get outside
        if(projectile.x - projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y - projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height ){
            projectiles.splice(indx,1)
        }
    })

    

    enemies.forEach((enemy, index) =>{
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if(dist-enemy.radius-player.radius<0.1){
            cancelAnimationFrame(animateId)
            clearInterval(myInterval)
            document.getElementById('scoreEnd').innerText=score;
            document.getElementById('startUi').style.display='flex'
        }

        projectiles.forEach((projectile, pindex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if(dist-enemy.radius-projectile.radius<0.1){

                //Create Explosion
                for(let i=0;i<enemy.radius*2;i++){
                    particles.push(new Particle(projectile.x,projectile.y,Math.random()*2,enemy.color,{
                        x : (Math.random() - 0.5) * (Math.random()*8),
                        y : (Math.random() - 0.5) * (Math.random()*8)
                    }))

                }

                score = score + Math.floor(diffNum*30/enemy.radius)*5
                document.getElementById('score').innerText = score;
                
                if((enemy.radius-10)>10){
                    gsap.to(enemy,{
                        radius : enemy.radius - 10
                    })

                    setTimeout(() => {
                        projectiles.splice(pindex, 1)
                    }, 0);
                }
                else{
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(pindex, 1)
                    }, 0);
                }
            }
        })
    } )
}


window.addEventListener('click',(event) => {

    if(!firttTime){
    const angle = Math.atan2(event.clientY-canvas.height/2, event.clientX-canvas.width/2)

    const velocity = {
        x : Math.cos(angle) * 6,
        y : Math.sin(angle) * 6
    }

    projectiles.push(
        new Projectile(
            canvas.width/2, canvas.height/2,5,'white',velocity)
    )
    }
    else{
        firttTime=false
    }
    
})


document.getElementById('startBtn').addEventListener('click',()=>{
    document.getElementById('startUi').style.display='none'
    enit()
    firttTime=true
    animate()
    spawnEnemy()
})

let diffBtn = document.getElementById('difficulty')
diffBtn.addEventListener('click',()=>{
    if(diffNum===1.3){
        diffBtn.innerText='Difficulty : Hard'
        diffNum=2
    }
    else if(diffNum===2){
        diffBtn.innerText='Difficulty : God'
        diffNum=8;
    }
    else if(diffNum===8){
        diffBtn.innerText='Difficulty : Easy'
        diffNum=1;
    }
    else if(diffNum===1){
        diffBtn.innerText='Difficulty : Medium'
        diffNum=1.3
    }
})

