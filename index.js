//Variable Declaration
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
let score = 0;
let firttTime=false;
let myInterval = null
let myInterval2 = null
let diffNum = 1.3
let tempdiffNum = 1.3
let colorTheme = 'white'
const titletext = document.getElementById('powerTitle')
let powerNum = 0
let isMusic = false,highScoreDisplayed=false;
let music = new Audio('music.mp3');
music.loop = true
canvas.width = innerWidth
canvas.height = innerHeight

//Class Design for game objects

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
        this.velocity.x *=0.98  //*Friction
        this.velocity.y *=0.98
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.02
    }
}

class Power {
    constructor(x,y,length,velocity){
        this.x = x
        this.y = y
        this.length = length
        this.color = colorTheme
        this.velocity = velocity
    }

    draw () {
        c.beginPath()
        c.rect(this.x,this.y,this.length,this.length)
        c.fillStyle = this.color
        c.fill()
    }

    update () {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}


//Player Position and Multi object array declaration

const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player (x,y,10,colorTheme)
let projectiles = []
let enemies = []
let particles = []
let powers = []


//Reset Function

function enit(){
    player = new Player (x,y,10,colorTheme)
    projectiles.length=0
    enemies.length=0
    powers.length=0
    particles.length=0
    powerNum = 0
    score=0;
    highScoreDisplayed=false
    tempdiffNum = diffNum
    document.getElementById('score').innerText = score;
    animate()
    spawnEnemy()
    spawnPower()
}

//High Score function


function checkHighScore(score){
    if(score>localStorage.getItem('highScore')){
        localStorage.setItem('highScore',score)

        if(!highScoreDisplayed){
            highScoreDisplayed=true
            document.getElementById('highScore').style.opacity=1
            setTimeout(() => {
                document.getElementById('highScore').style.opacity=0
            }, 2000);
        }
    }
}


//Enemy Spawn Function

function spawnEnemy(){
    myInterval = setInterval(()=>{
        const radius = Math.random() * (30 - 5) + 5
        tempdiffNum = tempdiffNum + 0.01
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
        x : Math.cos(angle)*tempdiffNum,
        y : Math.sin(angle)*tempdiffNum
        }
        enemies.push(new Enemy(x,y,radius,color,velocity))
    },1000)
}

//Power spawn function

function spawnPower(){
    myInterval2 = setInterval(()=>{
    tempdiffNum = tempdiffNum + 0.01
    if(powerNum==0){
        const length = 20
        let x,y
        if(Math.random()>0.5){
            x = Math.random()<0.5 ? 0-length : canvas.width+length
            y = Math.random() * canvas.height
        }
        else{
            x = Math.random() * canvas.width
            y = Math.random()<0.5 ? 0-length : canvas.height+length
        }

        const angle = Math.atan2(canvas.height/2-y,canvas.width/2-x)
        const velocity = {
        x : Math.cos(angle)*tempdiffNum,
        y : Math.sin(angle)*tempdiffNum
        }
        powers.push(new Power(x,y,length,velocity))
    }
    },5000)
}

//Power abilities and use

function powerget(choice){
    titletext.style.opacity = 1
    powers.length = 0

    //INVISIBLE
    if(choice==1){
        titletext.innerText = "INVISIBLE"
        powerNum = 1
        player.radius=0
        setTimeout(function() {
            titletext.style.opacity = 0
            player.radius=10
            powerNum = 0
        }, 10000);
    }

    //MULTI BULLETS
    else if(choice === 2){
        titletext.innerText = "MULTI BULLETS"
        powerNum=2
        
        setTimeout(function() {
            titletext.style.opacity = 0
            powerNum = 0
        }, 5000);
    }


    //EXTRA SCORE
    else if(choice === 3){
        titletext.innerText = "EXTRA SCORE"
        powerNum = 3
        score = score + 100
        document.getElementById('score').innerText = score;
        checkHighScore(score)
        setTimeout(function() {
            titletext.style.opacity = 0
            powerNum = 0
        }, 1000);
    }


    //BULLET RUSH
    else if(choice === 4){
        titletext.innerText = "BULLET RUSH"
        powerNum = 4
        setTimeout(function() {
            titletext.style.opacity = 0
            powerNum = 0
        }, 1000);
    }

    //EXPLOSION
    else if(choice === 5){
        titletext.innerText = "EXPLOSION"
        powerNum = 5
        enemies.forEach((enemy) =>{
            for(let i=0; i<enemy.radius*2; i++){
                particles.push(new Particle(enemy.x,enemy.y,Math.random()*2,enemy.color,{
                    x : (Math.random() - 0.5) * (Math.random()*8),
                    y : (Math.random() - 0.5) * (Math.random()*8)
                }))

            }

            score = score + Math.floor(tempdiffNum*30/enemy.radius)*5
            document.getElementById('score').innerText = score;
            checkHighScore(score)

            setTimeout(() => {
                enemies.length = 0
            }, 0);
        }
        )

        setTimeout(function() {
            titletext.style.opacity = 0
            powerNum = 0
        }, 1000);
    }


    //SCORE RUSH
    else if(choice === 6){
        titletext.innerText = "SCORE RUSH"
        powerNum = 6
        setTimeout(function() {
            titletext.style.opacity = 0
            powerNum = 0
        }, 10000);
    }

    
}



// Animating Canvas 

let animateId;


function animate(){    
    animateId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.2)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()

    //Particle animate

    particles.forEach((particle,index) => {
        if(particle.alpha<=0){
            particles.slice(index,1)
        }
        else{
            particle.update()
        }
    })


    //Bullets(Projectile) Animate

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

    

    //Enemy Animate
    enemies.forEach((enemy, index) =>{
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if((dist-enemy.radius-player.radius<0.1)&&(powerNum!=1)){
            cancelAnimationFrame(animateId)
            clearInterval(myInterval)
            clearInterval(myInterval2)
            enemies=[]
            powers=[]
            titletext.style.opacity = 0
            document.getElementById('scoreEnd').innerText=score;
            document.getElementById('bgui').style.display='block'
            document.getElementsByClassName('score')[0].style.display='none'
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
                if(powerNum != 6){
                    score = score + Math.floor(tempdiffNum*30/enemy.radius)*5
                }
                else{
                    score = score + Math.floor(tempdiffNum*30/enemy.radius)*25
                }
                
                document.getElementById('score').innerText = score;
                checkHighScore(score)
                
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

    //Power animate
    powers.forEach((power, index) =>{
        power.update()

        const dist = Math.hypot(player.x - power.x, player.y - power.y)

        //Power touches us
        
        if((dist-power.length-player.radius<0.1)&&(powerNum!=1)){

            //Create Explosion
            for(let i=0;i<40;i++){
                particles.push(new Particle(player.x,player.y,Math.random()*2,power.color,{
                    x : (Math.random() - 0.5) * (Math.random()*8),
                    y : (Math.random() - 0.5) * (Math.random()*8)
                }))

            }

            setTimeout(() => {
                powers.splice(index, 1)
            }, 0)

            powerget(Math.floor(Math.random()*6) + 1)

        }

        projectiles.forEach((projectile, pindex) => {
            const dist = Math.hypot(projectile.x - power.x, projectile.y - power.y)
            if(dist-20-projectile.radius<0.1){

                //Create Explosion

                for(let i=0;i<40;i++){
                    particles.push(new Particle(projectile.x,projectile.y,Math.random()*2,power.color,{
                        x : (Math.random() - 0.5) * (Math.random()*8),
                        y : (Math.random() - 0.5) * (Math.random()*8)
                    }))

                }

                
                setTimeout(() => {
                    powers.splice(index, 1)
                    projectiles.splice(pindex, 1)
                }, 0)
            }
        })
    } )
}


//Attack event listener

window.addEventListener('click',(event) => {
    if(!firttTime){
        const angle = Math.atan2(event.clientY-canvas.height/2, event.clientX-canvas.width/2)
        let velocity = {
            x : Math.cos(angle) * 6,
            y : Math.sin(angle) * 6
        }
        projectiles.push(
            new Projectile(
                canvas.width/2, canvas.height/2,5,colorTheme,velocity)
        )

        if(powerNum===2){
            for(i=0;i<10;i++){
                velocity = {
                    x : Math.cos(angle+(i*0.628)) * 6,
                    y : Math.sin(angle+(i*0.628)) * 6
                }
                projectiles.push(
                    new Projectile(canvas.width/2, canvas.height/2,5,colorTheme,velocity)
                )
            } 
        }
        if(powerNum===4){
            for(i=0;i<100;i++){
                velocity = {
                    x : Math.cos(angle+(i*0.0628)) * 6,
                    y : Math.sin(angle+(i*0.0628)) * 6
                }
                projectiles.push(
                    new Projectile(canvas.width/2, canvas.height/2,5,colorTheme,velocity)
                )
            } 
        }
    }
    else{
        firttTime=false
    }
    
})

//Start End UI Event Listenors

document.getElementById('startBtn').addEventListener('click',()=>{
    document.getElementsByClassName('scoreboard')[0].style.display='block'
    enit()
    firttTime=true
    document.getElementById('homepage').style.display='none'
    document.getElementById('gamepage').style.display='block'
    document.getElementById('bgui').style.display='none'
})

document.getElementById('playAgain').addEventListener('click',()=>{
    document.getElementById('bgui').style.display='none'
    document.getElementsByClassName('scoreboard')[0].style.display='block'
    enit()
    firttTime=true
})

document.getElementById('back').addEventListener('click',()=>{
    document.getElementById('gamepage').style.display='none'
    document.getElementById('homepage').style.display='block'
})

document.getElementById('setting').addEventListener('click',()=>{
    document.getElementById('homepage').style.display='none'
    document.getElementById('settingpage').style.display='block'
})

document.getElementById('musicSet').addEventListener('click',()=>{
    if(isMusic){
        isMusic = false;
        document.getElementById('musicSet').innerText = 'MUSIC : OFF'
        music.pause()
    }
    else{
        isMusic = true;
        document.getElementById('musicSet').innerText = 'MUSIC : ON'
        music.play()
    }
})

document.getElementById('colorSet').addEventListener('click',()=>{
    if(colorTheme === 'white'){
        colorTheme = 'red'
    }
    else if(colorTheme === 'red'){
        colorTheme = 'yellow'
    }
    else if(colorTheme === 'yellow'){
        colorTheme = 'blue'
    }
    else if(colorTheme === 'blue'){
        colorTheme = 'orchid'
    }
    else if(colorTheme === 'orchid'){
        colorTheme = 'aqua'
    }
    else if(colorTheme === 'aqua'){
        colorTheme = 'orange'
    }
    else if(colorTheme === 'orange'){
        colorTheme = 'pink'
    }
    else if(colorTheme === 'pink'){
        colorTheme = 'skyblue'
    }
    else if(colorTheme === 'skyblue'){
        colorTheme = 'azure'
    }
    else if(colorTheme === 'azure'){
        colorTheme = 'gold'
    }
    else{
        colorTheme = 'white'
    }
    document.getElementById('colorSet').style.backgroundColor = colorTheme
    document.getElementById('colorSet').innerText = 'COLOR : '+ colorTheme.toLocaleUpperCase()

})

document.getElementById('diffSet').addEventListener('click',()=>{
    if(diffNum === 1){
        document.getElementById('diffSet').innerText = 'DIFFICULTY : MEDIUM'
        diffNum = 1.3
    }
    else if(diffNum === 1.3){
        document.getElementById('diffSet').innerText = 'DIFFICULTY : HARD'
        diffNum = 2
    }
    else if(diffNum === 2){
        document.getElementById('diffSet').innerText = 'DIFFICULTY : GOD'
        diffNum = 10
    }
    else if(diffNum === 10){
        document.getElementById('diffSet').innerText = 'DIFFICULTY : EASY'
        diffNum = 1
    }
})


document.getElementById('saveSet').addEventListener('click',()=>{
    document.getElementById('homepage').style.display='block'
    document.getElementById('settingpage').style.display='none'
})

document.getElementById('highScorebtn').addEventListener('click',()=>{
    document.getElementById('highScorebtn').innerText = localStorage.getItem('highScore')
    setTimeout(() => {
        document.getElementById('highScorebtn').innerText = 'HIGH SCORE'
    }, 1000);
})


