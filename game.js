
//contect
const canvas = document.querySelector('#game');

const btnArriba = document.querySelector('#up');
const btnDer = document.querySelector('#left');
const btnIzq = document.querySelector('#right');
const btnAbajo = document.querySelector('#down');

const juego  = canvas.getContext('2d');

//signals: 
window.addEventListener('load', resizeEvent);
window.addEventListener('resize', resizeEvent);


let posJugador     = undefined; let mapa     = Array();  let nivel = 0;
let prePosJugador  = undefined; let celda_t  = 0;        let nivel_actual = undefined;
let puntoDePartida = Number(0); let canvas_t = 0;        var actualizado  = Boolean(false);
let explociones    = Array();   let vidas    = 3;        const re_iniciar = {'select': 'si', 
                                                                             'resetStart': 'indeciso',
                                                                             'exec' : false};

function resizeEvent(){
    actualizado = false;
    canvas_t = (window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight) *.75 ;
    canvas.setAttribute('width', canvas_t);
    canvas.setAttribute('height',canvas_t);
    celda_t = canvas_t / 10;
    juego.textAlign='end';
    juego.font = font_t() +'px arial';
    update();}

function font_t(){ return celda_t - celda_t / 10;}

function resetStarEvent(){
    posJugador = prePosJugador = undefined; 
    nivel = 0;
    nivel_actual = undefined;
    puntoDePartida = 0;
    vidas = 3;
    actualizado = false;
    explociones = Array();
    re_iniciar['select'] = 'si';
    re_iniciar['exec'] = false;
    re_iniciar['resetStart'] = 'indeciso';
    update();}


function update(){
    if(re_iniciar['exec']){paintScreenFinal(); return;}

    cargarMapa();
    clear();
    paintEvent();
    paintEventPlayer();
    paintEventExplosion();
    actualizado = true;}


function cargarMapa(){
    if(nivel_actual == nivel || Victoria()) return;
    nivel_actual = nivel;
    mapa = maps[nivel].match(/[IOX-]/g);}


function clear(){
    if(!actualizado) {
        juego.clearRect(0,0, canvas_t, canvas_t);
        return;}

    if(posJugador == prePosJugador) return;
    clearRect(posJugador);
    clearRect(prePosJugador);}


function clearRect(indice){
    const x  = posX(indice ) - celda_t / 10;
    const y  = posY(indice ) + celda_t / 5;
    juego.clearRect(x - 1 ,y , - celda_t, - (celda_t + 1));}


function posY(indice){ return (~~(indice/10) + 1) * celda_t - celda_t / 5; }
function posX(indice){ return (indice - (~~(indice/10) * 10) + 1) * celda_t + celda_t / 10;}


function paintEvent(){
    if(!actualizado)
        mapa.forEach((char, idx) => {
            if(char == 'O' && posJugador == undefined) puntoDePartida = posJugador = idx;       
            juego.fillText(emojis[char], posX(idx), posY(idx) );});}


function paintEventPlayer(){
    if(victoryEvent()) paintScreenEvent();
    else { 
        if(posJugador != undefined && prePosJugador != posJugador){
            juego.fillText(emojis[mapa[prePosJugador]],posX(prePosJugador),posY(prePosJugador));

            if(!gameOverEvent()) juego.fillText(emojis['PLAYER'], posX(posJugador),posY(posJugador));
            else paintScreenEvent();}}}


function gameOverEvent(){
    if(vidas && mapa[posJugador] == 'X'){ 
        explociones.push(posJugador);
        --vidas;
        juego.fillText(emojis['BOMB_COLLISION'],posX(posJugador),posY(posJugador));
        posJugador = puntoDePartida;}
    if(gameFinishEvent()) {
        explociones = Array();
        return true;} /*juego terminado*/
    return false; /*continuar con el juego*/}


function paintEventExplosion(){
    if(!explociones.length) return;
    explociones.forEach((pos) =>{
        clearRect(pos);
        juego.fillText(emojis['BOMB_COLLISION'],posX(pos),posY(pos));});}


function victoryEvent(){
    if(mapa[posJugador] != 'I') return false;
    else if(nivel < maps.length) ++nivel;
    explociones = Array();

    if(gameFinishEvent()) return true;/*juego terminado*/
    
    posJugador = prePosJugador = undefined;
    actualizado = false;
    update();
    return false;/*continuar con el juego*/}

function Victoria(){return nivel >= maps.length;}

function gameFinishEvent(){ 
    if(!(nivel >= maps.length) == (vidas <= 0) && !re_iniciar['exec']) 
        re_iniciar['exec'] = true;
    return !(nivel >= maps.length) == (vidas <= 0);}


function paintScreenEvent(){
    if(!re_iniciar['exec']) return;
    paintScreen(Victoria() ? 'WIN': 'GAME_OVER');
    paintScreenFinal();}


function paintScreenFinal(){
    if(!re_iniciar['exec']) return;
    if(!actualizado) paintScreen(Victoria() ? 'WIN': 'GAME_OVER');
    const media = canvas_t / 2;
    const media_alta = media - font_t() + 1;
    const media_baja = media + font_t() - 1;

    let color, backgroundColor, text = 'continuar', y = media_alta;

    if(Victoria()){ color = '#ffd700';
                    backgroundColor = '#01433A';}

    else {          color = '#FF2F22';
                    backgroundColor = '#211A27';}


    
    if(re_iniciar['resetStart'] == 'no' || re_iniciar['select'] == 'exit'){
        if(actualizado)paintScreen(Victoria() ? 'WIN': 'GAME_OVER');
        text = Victoria() ? 'Has Ganado' : 'Game Over';
        y = media + (font_t() / 2);
        re_iniciar['select'] = 'exit';}

    else if(re_iniciar['resetStart'] == 'si') {
        resetStarEvent();
        return;}

    else{
        paintScreen(Victoria() ? 'WIN': 'GAME_OVER');
        paintRectText('', '' , backgroundColor,'center',media, media);
        paintRectText('', '' , backgroundColor,'center',media, media_baja);
        let siCa = color, siCb = backgroundColor;
        let noCa = color, noCb = backgroundColor;

        if(re_iniciar['select'] == 'no'){ noCa = backgroundColor;  noCb = color;}
        else                            { siCa = backgroundColor;  siCb = color;}

        paintRectText('no', noCa, noCb,'center',media + font_t(), media + (font_t() / 2));
        paintRectText('si', siCa, siCb,'center',media - font_t(), media + (font_t() / 2));}
    

    
    paintRectText('', '' , backgroundColor,'center',media, y);
    paintRectText(text, color , '','center',media, y);}



function paintScreen(emoji){
    juego.clearRect(0,0, canvas_t, canvas_t);
        mapa.forEach((char, idx) =>{
            if(char == 'X') char = emoji;
            juego.fillText(emojis[char],posX(idx),posY(idx));});}


function paintRectText(txt, color = '', backgroundColor = '', aling = 'center', x = 0,y = 0){
    if(aling) juego.textAlign = aling;
    if(backgroundColor){
        const rect = rectBgText(txt, x, y, aling);
        juego.fillStyle = backgroundColor;
        juego.fillRect(rect['x'], rect['y'], rect['width'], rect['height']);}
    if(color) juego.fillStyle = color;
    if(txt) juego.fillText(txt, x, y);
    juego.textAlign = 'end';}


function rectBgText(txt, x = 0, y = 0, align=''){
    const height = font_t();
    const width = txt == ''|| txt == ' ' ? canvas_t : (font_t()*.75)* txt.length;
    let px = x; let py = y - (height - (height / 6));
    if(align == 'center'){px = x - (width / 2);}
    else if(align != 'left')px = x - width;
    
    return {'width': width, 'height':height, 'x': px, 'y' : py};}

//signals:
window.addEventListener('keydown',keyMov);
btnArriba.addEventListener('click', movArriba);
btnAbajo.addEventListener('click', movAbajo);
btnDer.addEventListener('click', movDer);
btnIzq.addEventListener('click', movIzq);

//slots:
function keyMov(event){
    switch(event.keyCode){
        //enter     S        N        Y
        case 13: case 83: case 78: case 89:
        selectOptionEvent(event.keyCode); 
                              break;//selecionar opciones
        case 37: movIzq();    break;//izquierda
        case 38: movArriba(); break;//arriba
        case 39: movDer();    break; //derecha
        case 40: movAbajo();  break;//abajo
        default:              break;}}

function selectOptionEvent(key){
    if(key == 83 || key == 89) re_iniciar['resetStart'] = 'si';
    else if(key == 78) re_iniciar['resetStart'] = 'no';
    else re_iniciar['resetStart'] = re_iniciar['select'];
    update();}

function movArriba(){
    prePosJugador = posJugador;
    posJugador -= 10;
    if(posJugador < 0) posJugador = prePosJugador;
    update();}


function movAbajo(){
    prePosJugador = posJugador;
    posJugador += 10;
    if(posJugador >= 100) posJugador = prePosJugador;
    update();}


function movDer(){
    if(re_iniciar['exec'])  re_iniciar['select'] = 'no';
    else{
        prePosJugador = posJugador;
        const pered = (~~(posJugador / 10)) *10 + 10;
        ++posJugador;
        if(posJugador >= pered) posJugador = prePosJugador;}
    update();}


function movIzq(){
    if(re_iniciar['exec'])  re_iniciar['select'] = 'si';
    else{
        prePosJugador = posJugador;
        const pered  = ~~(posJugador /10) * 10; 
        --posJugador;
        if(posJugador < pered) posJugador = prePosJugador;}
    update();}
