window.onload = function(){ //Eseguito quando la pagina html è stata caricata
  //Dichiaro oggetti per la connessione P2P
  var peer = null; // own peer object
  var conn = null;

  //Collegamento agli elementi html
  var myIdLabel = document.getElementById("myIdlB");
  var otherIDLabel = document.getElementById("otherIdLb");
  var otherIdTextBox = document.getElementById("otherIdTB");
  var confirmBtn = document.getElementById("confirmBtn");
  var elementiIniziali = document.getElementById("initialElements");
  var posizionescacchi = document.getElementById("posizionescacchiera");
  var board = document.getElementById("chessboard");
  var myBox = document.getElementById("myBox");
  var oppBox = document.getElementById("oppBox");
  var myTimer = document.getElementById("myTimer");
  var oppTimer = document.getElementById("oppTimer");
  var infoBox = document.getElementById("infoBox");
  var turnCounterLB = document.getElementById("turnCounter");
  var resignBtn = document.getElementById("resign");
  var endGameBox = document.getElementById("endGameBox");
  var reasonLB = document.getElementById("reason");
  var winnerLB = document.getElementById("winner");
  var rematchBtn = document.getElementById("rematchBtn");
  var homeBtn = document.getElementById("homeBtn");
  var requestElements = document.getElementById("requestElements");
  var otherIdLbRequest = document.getElementById("otherIdLbRequest");
  var acceptGameBtn = document.getElementById("acceptGameBtn");
  var refuseGameBtn = document.getElementById("refuseGameBtn");
  var requestSent = document.getElementById("requestSent");
  var otherIdRequestSent = document.getElementById("otherIdRequestSent");


  //Variabili per il gioco
  var playing = false;
  var scacchiera = [];
  var myColor;
  var opponentColor;
  var myTurn = false; //Indica se il mio turno è in corso
  var turnCounter = 0;
  var timer;
  var highlightedSquares;
  var clickedPiece;

  //Impostazioni grafiche del canvas
  if(screen.availWidth > screen.availHeight){
    board.width = screen.availHeight/1.5;
    board.height = screen.availHeight/1.5;
  }else{
    board.width = screen.availWidth/1.5;
    board.height = screen.availWidth/1.5;
  }
  board.style = "solid #c3c3c3;";
  var cellDim = board.width/8; //Dimensione delle caselle della scacchiera
  var ctx = board.getContext("2d");

  //Inizializzo l'effetto sonoro dello spostamento di un pezzo
  var movePieceAudio = document.createElement("AUDIO");
  movePieceAudio.setAttribute("src","./soundEffects/movePieceSound.mp3");
  //Inizializzo l'effetto sonoro del fine partita
  var gameOverAudio = document.createElement("AUDIO");
  gameOverAudio.setAttribute("src","./soundEffects/gameOverSound.mp3");

  //Imposto gli eventi
  confirmBtn.addEventListener("click", sendGameRequest);
  board.addEventListener("click", boardClicked);
  resignBtn.addEventListener("click", resign);
  rematchBtn.addEventListener("click",rematch);
  homeBtn.addEventListener("click",homepage);
  acceptGameBtn.addEventListener("click",acceptRequest);
  refuseGameBtn.addEventListener("click",refuseRequest);


  initPeer();

  function initPeer(){
    //Creo questo peer
    peer = new Peer({key: 'lwjd5qra8257b9'});
    //Eseguito quando si crea questo peer
    peer.on('open', function (id) {
      console.log('My ID: ' + peer.id);
      myIdLabel.innerHTML = "My ID: " + peer.id;
    });

    //Eseguito quando l'altro giocatore si connette con me
    peer.on('connection', function (c) {
      conn = c;
      myColor = "black";
      opponentColor = "white";
      connected();
    requestElements.style.display = "block";
    otherIdLbRequest.innerHTML = "The peer " + conn.peer + " wants to play";
    });
  }

  //Eseguito quando clicco sul confirm Button (io mi connetto con l'altro giocatore) oppure clicco su rematch
  function sendGameRequest(){
  if(conn === null){
      conn = peer.connect(otherIdTextBox.value, {
      reliable: true
    });
  }else{
    conn = peer.connect(conn.peer, {
      reliable: true
    });
  }
    myColor = "white";
    opponentColor = "black";
    connected();
  requestSent.style.display = "block";
  otherIdRequestSent.innerHTML = "Game request sent to " + conn.peer;
  }

  function acceptRequest(){
  conn.send("start");
  startGame();
  }


  function refuseRequest(){
  conn.send("refuse");
  requestElements.style.display = "none";
  }


  function connected(){
    //Eseguito quando si apre la connessione con l'avversario
    conn.on('open', function () {
       console.log("Connected to: " + conn.peer);
    });
    //Eseguito quando ricevo dei dati dall'avversario
    conn.on('data', function (data) {
       console.log("Data received:" + data);
     if(data === "refuse"){
         requestSent.style.display = "none";
       }
       else if(data === "start"){
         startGame();
       }
     else if(data === "resign"){
         endGame("opponent_resign");
       }
     else {
         movePieceAudio.play();
         readMove(data);
       }
    });
    //Eseguito quando l'avversario si disconnette, volontariamente o no
    conn.on('close', function () {
      conn = null;
      if(playing){
        endGame("opponent_disconnected");
      }
    });
  }

  //Mi arrendo nell'eventuale partita in corso e mostro gli elementi iniziali
  function homepage(){
    if(playing) resign();
    //Nascondo la scacchiera e gli elementi laterali
    posizionescacchi.style.display = "none";
    //Nascondo gli elementi che non servono
    elementiIniziali.style.display = "block";
  }

  //Inizia la partita di scacchi
  function startGame(){
    //Nascondo gli elementi che non servono
    elementiIniziali.style.display = "none";
  requestSent.style.display = "none";
  requestElements.style.display = "none";
    endGameBox.style.display = "none";

    //Reimposto l'opacità degli elementi
    board.style.opacity = 1;
    oppBox.style.opacity = 1;
    infoBox.style.opacity = 1;

    //Mostro la scacchiera e gli elementi laterali
    posizionescacchi.style.display = "block";

    playing = true;
    turnCounter=0;
    if(myColor === "black"){
    turnCounter = 1;
    turnCounterLB.innerHTML = "Turn "+turnCounter;
  }


    //Timer della partita, aggiornato ogni secondo
    var mySeconds=0;
    var oppSeconds=0;
    timer = setInterval(function() {
      if(myTurn){
        mySeconds++;
      }if(!myTurn){
        oppSeconds++;
      }
      myTimer.innerHTML = ("0" + (Math.floor(mySeconds / 60))).slice(-2) + ":" + ("0" + (mySeconds%60)).slice(-2);
      oppTimer.innerHTML = ("0" + (Math.floor(oppSeconds / 60))).slice(-2) + ":" + ("0" + (oppSeconds%60)).slice(-2);
    }, 1000);

    scacchiera = [];
    //Imposto i pezzi nella posizione iniziale standard
    initChessboard();
    //Disegno nel canvas la scacchiera
    drawChessBoard();
  }


  function boardClicked(evt){
    //Eseguito quando clicco sulla scacchiera
    if(myTurn){
      var position = getMousePos(board, evt); //Prendo la posizione del mouse
      for(var row=0; row<8; row++){
        for(var col=0; col<8; col++){
          if(isPointInsideRect( position.x, position.y, col*cellDim,row*cellDim,cellDim,cellDim)){ //Cerco la casella cliccata
            drawChessBoard(); //Ridisegno la scacchiera
            //Se ho cliccato su una casella evidenziata di rosso, muovo il pezzo cliccato prima in quella casella
            if(highlightedSquares != undefined && highlightedSquares.length != 0){
              for(var count =0; count< highlightedSquares.length; count++){
                 if(highlightedSquares[count][0]===row && highlightedSquares[count][1]===col){
                   movePieceAudio.play();
                   movePieceAndSendMove(clickedPiece, row, col);
                 }
              }
              highlightedSquares = undefined;
            }
            else{  //Questo è il primo click, evidenzio di rosso le caselle in cui il pezzo cliccato si può muovere
              clickedPiece = scacchiera[row][col];
              if(clickedPiece.colore === myColor){
                highlightedSquares = showPossibleMoves(row, col);
              }
            }
          }
        }
      }
    }
    console.log(scacchiera);
  }

  function initChessboard(){
    //Inizializzo la matrice scacchiera inserendo i pezzi nella posizione iniziale degli scacchi
    for(var row=0; row<8; row++) {
        scacchiera[row] = [];
        for(var col=0; col<8; col++) {
            scacchiera[row][col] = new Square(row,col);
        }
    }
    scacchiera[0][0] = new Rook(0,0,opponentColor);
    scacchiera[0][1] = new Knight(0,1,opponentColor);
    scacchiera[0][2] = new Bishop(0,2,opponentColor);
    if(myColor === "white"){
      scacchiera[0][3] = new Queen(0,3,opponentColor);
      scacchiera[0][4] = new King(0,4,opponentColor);
    }if(myColor === "black"){
      scacchiera[0][3] = new King(0,3,opponentColor);
      scacchiera[0][4] = new Queen(0,4,opponentColor);
    }
    scacchiera[0][5] = new Bishop(0,5,opponentColor);
    scacchiera[0][6] = new Knight(0,6,opponentColor);
    scacchiera[0][7] = new Rook(0,7,opponentColor);
    ///////////////////////////////////////////
    scacchiera[7][0] = new Rook(7,0,myColor);
    scacchiera[7][1] = new Knight(7,1,myColor);
    scacchiera[7][2] = new Bishop(7,2,myColor);
    if(myColor === "white"){
      scacchiera[7][3] = new Queen(7,3,myColor);
      scacchiera[7][4] = new King(7,4,myColor);
    }if(myColor === "black"){
      scacchiera[7][3] = new King(7,3,myColor);
      scacchiera[7][4] = new Queen(7,4,myColor);
    }
    scacchiera[7][5] = new Bishop(7,5,myColor);
    scacchiera[7][6] = new Knight(7,6,myColor);
    scacchiera[7][7] = new Rook(7,7,myColor);
    ///////////////////////////////////////////
    for(col=0; col<8;col++){
      scacchiera[1][col] = new Pawn(1,col,opponentColor);
      scacchiera[6][col] = new Pawn(6,col,myColor);
    }
    myTurn=false;
    if(myColor === "white") startTurn();  //Il bianco inizia
  }

  function drawChessBoard(){
    //Disegno le caselle
    for(var row=0; row<8; row++){
      for(var col=0; col<8; col++){
        if(row % 2 === 0 && col % 2 === 0)
        {
          ctx.fillStyle = "#FFFFFF";
        }
        else if(row % 2 !== 0 && col % 2 !== 0)
        {
          ctx.fillStyle = "#FFFFFF";
        }
        else
        {
          ctx.fillStyle = "#736F6E";
        }
        //Ricordo che la x del canvas è riferita alla colonna e la y alla riga
        canvasX = col*cellDim;
        canvasY = row*cellDim;
        ctx.fillRect(canvasX,canvasY,cellDim,cellDim);
        //Disegno le pedine
        canvasY += cellDim-(cellDim/10);  //Cambio la posizione per scrivere il testo
        ctx.fillStyle = "#000000";
        ctx.font = cellDim+"px Verdana";// dimensione e tipo di font
        character = scacchiera[row][col].carattere; //Carattere del pezzo
        if(character !== null)   ctx.fillText(character, canvasX, canvasY);  // testo sul canvas e posizione x,y
      }
    }
  }

  function showPossibleMoves(row, col){
    //Mostra sulla scacchiera le caselle in cui il pezzo in posizione [row][col] si può muovere
    var pMoves = scacchiera[row][col].possibleMoves(scacchiera);
    if(pMoves != undefined){
      for(var count =0; count< pMoves.length; count++){ //Scorro tutte le caselle in cui è possibile muoversi
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "red";
        canvasX = (pMoves[count][1]*cellDim) + (cellDim/20);
        canvasY = (pMoves[count][0]*cellDim) + (cellDim/20);
        squareDim = cellDim - cellDim/10; //Rendo il quadrato rosso più piccolo delle caselle
        ctx.rect(canvasX,canvasY,squareDim,squareDim);
        ctx.stroke();
      }
      //Evidenzio la casella cliccata
      if((row % 2 === 0 && col % 2 === 0) || (row % 2 !== 0 && col % 2 !== 0))
      {
        ctx.fillStyle = "#FFFF66";  //Giallo chiaro
      }else{
        ctx.fillStyle = "#FFFF55";  //Giallo scuro
      }
      ctx.fillRect(col*cellDim,row*cellDim,cellDim,cellDim);
      //Ridisegno la pedina
      ctx.fillStyle = "#000000";
      ctx.font = cellDim+"px Verdana";// dimensione e tipo di font
      ctx.fillText(scacchiera[row][col].character, col*cellDim, (row*cellDim)+(cellDim-(cellDim/10)));  // testo sul canvas e posizione x,y

    }
    return pMoves;
  }

  function movePieceAndSendMove(piece, newX, newY){
    //Muove il pezzo piece nella casella [newX][newY] e manda la mossa all'altro peer
    var oldX = piece.x;
    var oldY = piece.y;

    scacchiera[oldX][oldY] = new Square(oldX,oldY); //La casella lasciata diventa vuota
    piece.x = newX;
    piece.y = newY;
    scacchiera[newX][newY] = piece;

    drawChessBoard();

    //Evidenzio l'ultima mossa eseguita (casella di partenza e di arrivo)
    drawMove(piece, oldX, oldY, newX, newY);

    //Invio all'altro peer la mossa eseguita, sotto forma di oggetto
    sendableMove = {oldX: oldX, oldY: oldY, newX: newX, newY: newY};
    conn.send(sendableMove);
    console.log(sendableMove);
    endTurn();
  }

  function readMove(data){
    //Eseguita quando ricevo un la mossa dell'avversario
    //L'avversario ha la scacchiera "sottosopra", devo convertire le posizioni nella scacchiera
    var oldX = 7-data.oldX;
    var oldY = 7-data.oldY;
    var newX = 7-data.newX;
    var newY = 7-data.newY;
    scacchiera[oldX][oldY].row = newX;
    scacchiera[oldX][oldY].col = newY;
    scacchiera[newX][newY] = scacchiera[oldX][oldY];
    scacchiera[oldX][oldY] = new Square(oldX,oldY);
    console.log(data);

    drawChessBoard();
    //Evidenzio l'ultima mossa eseguita (casella di partenza e di arrivo)
    drawMove(scacchiera[newX][newY], oldX, oldY, newX, newY);

    startTurn();
  }

  function drawMove(piece, oldX, oldY, newX, newY){
    //Colora di verde le caselle dell'ultima mossa effettuata

    //Se la casella è nera, la faccio più scura e viceversa
    if((oldX % 2 === 0 && oldY % 2 === 0) || (oldX % 2 !== 0 && oldY % 2 !== 0))
    {
      ctx.fillStyle = "#98FB98";  //Verde chiaro
    }else{
      ctx.fillStyle = "#90EE90";  //Verde scuro
    }
    ctx.fillRect(oldY*cellDim,oldX*cellDim,cellDim,cellDim);
    if((newX % 2 === 0 && newY % 2 === 0) || (newX % 2 !== 0 && newY % 2 !== 0))
    {
      ctx.fillStyle = "#98FB98";  //Verde chiaro
    }else{
      ctx.fillStyle = "#90EE90";  //Verde scuro
    }
    ctx.fillRect(newY*cellDim,newX*cellDim,cellDim,cellDim);
    //Ridisegno la pedina
    ctx.fillStyle = "#000000";
    ctx.font = cellDim+"px Verdana";// dimensione e tipo di font
    ctx.fillText(piece.character, newY*cellDim, (newX*cellDim)+(cellDim-(cellDim/10)));  // testo sul canvas e posizione x,y

  }

  function startTurn(){
    myTurn = true; //Ora è il mio turno
    turnCounter++;
    turnCounterLB.innerHTML = "Turn "+turnCounter;
    myBox.style.opacity = 1;
    oppBox.style.opacity = 0.6;
    checkmateStalemate(myColor); //Controllo eventale scacco matto o stallo fatto dall'avversario
  }

  function endTurn(){
    myTurn = false; //Ora è il turno dell'avversario
    turnCounter++;
    turnCounterLB.innerHTML = "Turn "+turnCounter;
    myBox.style.opacity = 0.6;
    oppBox.style.opacity = 1;
    checkmateStalemate(opponentColor); //Controllo eventale scacco matto o stallo fatto da me
  }

  function checkmateStalemate(kingColor){
    //Controllo un eventuale scacco matto o uno stallo sul re di colore kingColor
    var totalPMoves = []
    for(var row=0; row<8; row++){
      for(var col=0; col<8; col++){
        if(scacchiera[row][col].colore === kingColor){
          totalPMoves = totalPMoves.concat(scacchiera[row][col].possibleMoves(scacchiera));
        }
      }
    }
    if(totalPMoves.length===0){
      if(check(scacchiera, kingColor)){
        //SCACCO MATTO
        if(kingColor===myColor) endGame("lose");
        if(kingColor===opponentColor) endGame("win");
      }else{
        //STALLO
        endGame("stale");       //Non ci sono mosse possibili ma il re non è in scacco
      }
    }
  }

  function resign(){
    //Eseguito quando clicco sul resignButton (resa)
    if(conn!=null && playing){
      conn.send("resign");
      endGame("resign");
    }
  }

  function endGame(reason){
    //Fine della partita
    board.style.opacity = 0.6;
    myBox.style.opacity = 0.6;
    oppBox.style.opacity = 0.6;
    infoBox.style.opacity = 0.6;
    clearInterval(timer);
    endGameBox.style.display = "block";
    gameOverAudio.play();

  if(reason === "win"){
    reasonLB.innerHTML = "Checkmate";
    winnerLB.innerHTML = "You win";
  }if(reason === "lose"){
    reasonLB.innerHTML = "Checkmate";
    winnerLB.innerHTML = "You lose";
  }if(reason === "stale"){
    reasonLB.innerHTML = "Stalemate";
    winnerLB.innerHTML = "Nobody wins";
  }if(reason === "resign"){
    reasonLB.innerHTML = "You resigned";
    winnerLB.innerHTML = "You lose";
  }if(reason === "opponent_resign"){
    reasonLB.innerHTML = "The opponent resigned";
    winnerLB.innerHTML = "You win";
  }if(reason === "opponent_disconnected"){
    reasonLB.innerHTML = "The opponent disconnected";
    winnerLB.innerHTML = "You win";
    rematchBtn.style.display = "none";
  }
  playing = false;
  }

  function rematch(){
    //Eseguito quando clicco sul rematchButton, una volta finita una partita
    sendGameRequest();

  }

  function getMousePos(canvas, evt) {
    //Restituisce le coorinate x e y del punto del canvas in cui ho cliccato
    var rect = canvas.getBoundingClientRect();
      return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  }

  function isPointInsideRect(pointX,pointY,rectX,rectY,rectWidth,rectHeight){
    //Restituisce true se il punto è dentro al rettangolo
    return  (rectX <= pointX) && (rectX + rectWidth >= pointX) &&
               (rectY <= pointY) && (rectY + rectHeight >= pointY);
  }
}
