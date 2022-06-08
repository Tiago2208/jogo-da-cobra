var tamanhoBloco = 18;
var linhas = 32;
var colunas = 32;
var tela;
var ctx;
//cabeça
var xCobra = 5 * tamanhoBloco; 
var yCobra = 5 * tamanhoBloco;
var xVelocidade;
var yVelocidade;
let direcaoInicial = 0;
//corpo
var corpoCobra = [];
//comida
var xMaca;
var yMaca;
// Obstaculos
var xHidrante = [];
var yHidrante = [];
//Marca pontos
var qtdVidas= 5;
var xVidas;
var comidasComidas = 0;
var comidasComidasTotal = 0;
var xComidasComidas;
var coracao;
//fim de jogo
var gameOver = false;
var duracao = 60 * 1.49; //convertido para segundos
var mostra = document.querySelector('.timer');

window.onload = function (){

    iniciaMovimento();
    iniciaContador(duracao, mostra);
    canvas();
    colocarComida();
    
    document.addEventListener('keyup',mudaDirecao);
    setInterval(update, 1000/15);
    colocarHidrante();
}
function update(){

    if (gameOver){
        return;
    }
    xVidas = 0;
    xComidasComidas = 0;
    geraCanvas();
    geraLinha();
    geraHidrante();
    geraCabeca();
    aumentaCorpo();
    mostraCoracao();    
    geraMaca();
    mostraComidas();
    mostraPontos();
    colisaoHidrante();
    colisaoCabeca();
    colisaoComida();
    movimentaCobra()
    rolagemInfinita();
    condiçõesFimJogo();
    
}

function canvas(){
    tela = document.getElementById("fundo-jogo");
    tela.width = linhas * tamanhoBloco;
    tela.height = colunas * tamanhoBloco;
    ctx = tela.getContext('2d');
    
}
function geraCanvas(){
    ctx.fillStyle = 'rgb(20, 33, 44)'; // fundo - azul-escuro
    ctx.fillRect(0, 0, tela.width,tela.height); // tela
}
function geraLinha(){
    ctx.strokeStyle = 'aliceblue';
    ctx.lineWidth = 4;
    ctx.beginPath();    
    ctx.moveTo(0, (tamanhoBloco * 2) - 2 );
    ctx.lineTo(tela.width, (tamanhoBloco * 2) - 2);
    ctx.stroke();
}

function geraCabeca(){
    let cabeca =document.getElementById('cobra-cima');
    ctx.drawImage(cabeca, xCobra,yCobra,tamanhoBloco,tamanhoBloco);
}   

function aumentaComidasComidas(){
    if(comidasComidas < 3){
        comidasComidas += 1
    }else if(comidasComidas == 3 && qtdVidas < 5){
        qtdVidas += 1;
        comidasComidas = 0;
    }
    
}

function perdeVida(){
    qtdVidas -= 1
}
function colocarComida(){
    xMaca = Math.floor(Math.random() * colunas) * tamanhoBloco;
    yMaca = Math.floor(Math.random() * (linhas - 2) + 2) * tamanhoBloco;
}

function colocarHidrante(){
    for (let i = 0 ; i < 10 ; i++){
    xHidrante.push(Math.floor(Math.random() * colunas) * tamanhoBloco);
    yHidrante.push(Math.floor(Math.random() * (linhas - 2) + 2) * tamanhoBloco);
    }
}

function mudaDirecao(event){
    if (event.code == "ArrowUp" && yVelocidade != 1){
        xVelocidade = 0 ;
        yVelocidade = -1;
        
    }else if (event.code == "ArrowDown" && yVelocidade != -1){
        xVelocidade = 0;
        yVelocidade = 1;
        
    }else if (event.code == "ArrowLeft" && xVelocidade != 1){
        xVelocidade = -1 ;
        yVelocidade = 0;
        
    }else if (event.code == "ArrowRight" && xVelocidade != -1){
        xVelocidade = 1;
        yVelocidade = 0;
        
    }
    
}

function iniciaContador(duracao, mostra){
    var timer = duracao, minutos, segundos;
    
    setInterval(function(){
        minutos = parseInt(timer / 60, 10);
        segundos = parseInt(timer % 60, 10);
        
        minutos = minutos < 10 ? "0" + minutos : minutos;
        segundos = segundos < 10 ? "0" + segundos : segundos;
           
        mostra.textContent = minutos + ":" + segundos;
        
        if(--timer < 0){
            perdeuJogo()
            timer = duracao;
        }
        
    }, 1000);
}

function iniciaMovimento(){
    
    direcaoInicial = Math.floor(Math.random() * 4 + 1)

    if(direcaoInicial == 1){
        xVelocidade = 0 ;
        yVelocidade = -1;
    }if(direcaoInicial == 2){
        xVelocidade = 0 ;
        yVelocidade = 1;
    }if(direcaoInicial == 3){
        xVelocidade = -1 ;
        yVelocidade = 0;  
    }if(direcaoInicial == 4){
        xVelocidade = 1 ;
        yVelocidade = 0;
    }
} 

function mostraComidas(){
    for (let i = 1; i <= comidasComidas; i++) {  
        xComidasComidas += 15;
        ctx.fillStyle = 'aliceblue';
        ctx.fillRect(((tela.width /10) * 6) + xComidasComidas, 5, 10, 10);
    }
}
function mostraCoracao(){
    let imagemCoracao = document.getElementById('coracao');
    for (let i = 1; i <= qtdVidas; i++) {
        xVidas += 30; 
        ctx.drawImage(imagemCoracao, ((tela.width / 10) * 7) + xVidas, 5, 20, 20);
    }
}
function mostraPontos(){
    ctx.font = '32px personalizada';
    ctx.fillStyle = 'aliceblue';
    ctx.fillText(comidasComidasTotal, 5, 26);
}

function rolagemInfinita(){
    if (xCobra < -1){
        xCobra = tela.width - tamanhoBloco;
    }
    if (xCobra  > tela.width - 1 ){
        xCobra = 0 ;
    } 
    if (yCobra < tamanhoBloco * 2){
        yCobra = tela.height - tamanhoBloco;
    } 
    if (yCobra > tela.height - 1){
        yCobra = tamanhoBloco * 2;
    } 
}

function geraMaca(){
    let imgMaca = document.getElementById("maca");
    ctx.drawImage(imgMaca, xMaca, yMaca, tamanhoBloco , tamanhoBloco); //comida
}
function geraHidrante(){
    let imgHidrante = document.getElementById('hidrante');
    for (let i = 0; i <= xHidrante.length; i++) {
    ctx.drawImage(imgHidrante, xHidrante[i], yHidrante[i] , tamanhoBloco, tamanhoBloco);    
    }
}
function colisaoComida(){
    if (xCobra == xMaca && yCobra == yMaca){ //Quando comer, add corpo,  muda posição da comida, aumenta contador vida 
            corpoCobra.push([xMaca,yMaca]);
            colocarComida();
            aumentaComidasComidas();
            comidasComidasTotal += 1
    }
}

function aumentaComidasComidas(){
    if(comidasComidas < 3){
        comidasComidas += 1
    }
    if(comidasComidas == 3 && qtdVidas < 5){
        qtdVidas += 1;
        comidasComidas = 0;
    }
}

function colisaoHidrante(){
    for (let i = 0; i < yHidrante.length; i++) {    
        if (xCobra == xHidrante[i]  && yCobra  == yHidrante[i]){ 
            perdeVida();    
            yHidrante.splice(i, 1);
            xHidrante.splice(i, 1);
        
        }
        if(comidasComidas == 3 && qtdVidas == 4 ){
            aumentaComidasComidas();
        }
    } 
    console.log(xHidrante)
    console.log(yHidrante)
}

function colisaoCabeca(){
    for (let i = corpoCobra.length - 1 ; i > 0; i --) { //colisao com o corpo
        corpoCobra [i] = corpoCobra[i-1];
    }
    if (corpoCobra.length){
        corpoCobra[0] = [xCobra,yCobra]
    }
}

function movimentaCobra(){
    xCobra += xVelocidade * tamanhoBloco;
    yCobra += yVelocidade  * tamanhoBloco;
}

function aumentaCorpo(){
    corpo = document.getElementById("corpo");
    for (let i = 0; i < corpoCobra.length; i++) { // aumentando corpo da cobra
        ctx.drawImage(corpo, corpoCobra[i][0] , corpoCobra[i][1]  , tamanhoBloco  , tamanhoBloco);    
    }
}
function condiçõesFimJogo(){
    //Condições para fim do jogo
    for (let i = 0; i < corpoCobra.length; i++) { // auto-colisao
        if(xCobra == corpoCobra[i][0] && yCobra == corpoCobra[i][1]){ 
            perdeuJogo();
        }
    } 
    if(qtdVidas == 0 || comidasComidasTotal == 15){ //Comidas igual a 15
        ganhouJogo();
    }
}

function perdeuJogo(){
        gameOver = true;
        alert("Parabéns! Você ganhou! ");
        
} 
function ganhouJogo(){
    gameOver = true;
    alert("Você perdeu.");
}