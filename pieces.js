class Square {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.color = "noColor";
    this.character = null;
   }
   set row(x){
     this.x = x;
   }
   get row(){
     return this.x;
   }
   set col(y){
     this.y = y;
   }
   get col(){
     return this.y;
   }
   set colore(c){
     this.color = c;
   }
   get colore(){
     return this.color;
   }
   set carattere(char){
     this.character = char;
   }
   get carattere(){
     return this.character;
   }
   possibleMoves(chessboard){
      //Una casella vuota non può muoversi
   }
   canAttack(chessboard){
      //Una casella vuota non minaccia nessuna casella
   }
}
class King extends Square {
    constructor(x, y, color){
      super(x, y)
      this.color = color;
      if(color === "white") this.character = "♔";
      if(color === "black") this.character = "♚";
     }

    possibleMoves(chessboard){
      var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
      var count = 0;  //Contatore delle mosse possibili trovate
      for(var dx=-1; dx<=1; dx++){   //Possibili movimenti sulle righe del re
        for(var dy=-1; dy<=1; dy++){ //Possibili movimenti sulle colonne del re
            if(dx!=0||dy!=0){
                var riga = this.x+dx;
                var colonna = this.y+dy;
                if(corretto(riga, colonna)){ //controlla di non uscire dalla scacchiera
                    if(chessboard[riga][colonna].color !== this.color){      //La casella è libera o c'è un pezzo avversario, mossa possibile
                       pMoves[count] = [riga, colonna];
                       count++;
                    }
                }
            }
        }
      }
      //Controllo che le mosse non causino uno scacco sul mio re
      for(var count=0; count<pMoves.length; count++){
        if(checkMove(chessboard, this, pMoves[count][0], pMoves[count][1])){
          pMoves.splice(count,1);   //Rimuovo la mossa tra quelle possibili
          count--;
        }
      }
      return pMoves;
    }

    canAttack(chessboard){  //Funzione che restituisce le caselle minacciate dal re
      var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
      var count = 0;  //Contatore delle mosse possibili trovate
      for(var dx=-1; dx<=1; dx++){   //Possibili movimenti sulle righe del re
        for(var dy=-1; dy<=1; dy++){ //Possibili movimenti sulle colonne del re
            if(dx!=0||dy!=0){
                var riga = this.x+dx;
                var colonna = this.y+dy;
                if(corretto(riga, colonna)){ //controlla di non uscire dalla scacchiera
                    if(chessboard[riga][colonna].color !== this.color){      //La casella è libera o c'è un pezzo avversario, mossa possibile
                       pMoves[count] = [riga, colonna];
                       count++;
                    }
                }
            }
        }
      }
      return pMoves;
    }

}

class Queen extends Square {
    constructor(x, y, color){
      super(x, y)
      this.color = color;
      if(color === "white") this.character = "♕";
      if(color === "black") this.character = "♛";
     }

    possibleMoves(chessboard){
      var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
      for(var dx=-1; dx<=1; dx++){   //La regina può muovere in ogni direzione
        for(var dy=-1; dy<=1; dy++){
            if(dx!=0||dy!=0){
                var temp = check_line(chessboard, this.x, this.y, dx, dy);
                pMoves = pMoves.concat(temp);
            }
        }
      }
      //Controllo che le mosse non causino uno scacco sul mio re
      for(var count=0; count<pMoves.length; count++){
        if(checkMove(chessboard, this, pMoves[count][0], pMoves[count][1])){
          pMoves.splice(count,1);   //Rimuovo la mossa tra quelle possibili
          count--;
        }
      }
      return pMoves;
    }

    canAttack(chessboard){
      var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
      for(var dx=-1; dx<=1; dx++){   //La regina può muovere in ogni direzione
        for(var dy=-1; dy<=1; dy++){
            if(dx!=0||dy!=0){
                var temp = check_line(chessboard, this.x, this.y, dx, dy);
                pMoves = pMoves.concat(temp);
            }
        }
      }
      return pMoves;
    }
}

class Rook extends Square {
    constructor(x, y, color){
      super(x, y)
      this.color = color;
      if(color === "white") this.character = "♖";
      if(color === "black") this.character = "♜";
     }
     possibleMoves(chessboard){
       var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
       //Controllo i possibili movimenti (direzioni orizzontali e verticali)
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, 0, -1));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, 0, 1));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, -1, 0));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, 1, 0));

       //Controllo che le mosse non causino uno scacco sul mio re
       for(var count=0; count<pMoves.length; count++){
         if(checkMove(chessboard, this, pMoves[count][0], pMoves[count][1])){
           pMoves.splice(count,1);   //Rimuovo la mossa tra quelle possibili
           count--;
         }
       }

       return pMoves;
     }

     canAttack(chessboard){
       var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
       //Controllo i possibili movimenti (direzioni orizzontali e verticali)
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, 0, -1));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, 0, 1));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, -1, 0));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, 1, 0));
       return pMoves;
     }
}

class Bishop extends Square {
    constructor(x, y, color){
      super(x, y)
      this.color = color;
      if(color === "white") this.character = "♗";
      if(color === "black") this.character = "♝";
     }
     possibleMoves(chessboard){
       var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
       //Controllo i possibili movimenti (direzioni orizzontali e verticali)
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, -1, -1));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, 1, 1));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, -1, 1));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, 1, -1));

       //Controllo che le mosse non causino uno scacco sul mio re
       for(var count=0; count<pMoves.length; count++){
         if(checkMove(chessboard, this, pMoves[count][0], pMoves[count][1])){
           pMoves.splice(count,1);   //Rimuovo la mossa tra quelle possibili
           count--;
         }
       }

       return pMoves;
     }

     canAttack(chessboard){
       var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
       //Controllo i possibili movimenti (direzioni orizzontali e verticali)
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, -1, -1));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, 1, 1));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, -1, 1));
       pMoves = pMoves.concat(check_line(chessboard, this.x, this.y, 1, -1));
       return pMoves;
     }
}

class Knight extends Square {
    constructor(x, y, color){
      super(x, y)
      this.color = color;
      if(color === "white") this.character = "♘";
      if(color === "black") this.character = "♞";
     }
     possibleMoves(chessboard){
       var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
       var count = 0;  //Contatore delle mosse possibili trovate
       for(var dx=-2; dx<=2; dx++){
         for(var dy=-2; dy<=2; dy++){
             if((Math.abs(dx)!=Math.abs(dy))&& dx!=0 && dy!=0){    //Controlla che il movimento sia ad L
                 var riga = this.x;
                 var colonna = this.y;
                 riga+=dx;
                 colonna+=dy;
                 if(corretto(riga, colonna)){        //Le coordinate non devono uscire dalla scacchiera
                     if(chessboard[riga][colonna].colore !== this.colore){ //se c'è un pezzo di colore diverso si può mangiare
                       pMoves[count] = [riga, colonna];
                       count++;
                     }
                 }
             }
         }
       }
       //Controllo che le mosse non causino uno scacco sul mio re
       for(var count=0; count<pMoves.length; count++){
         if(checkMove(chessboard, this, pMoves[count][0], pMoves[count][1])){
           pMoves.splice(count,1);   //Rimuovo la mossa tra quelle possibili
           count--;
         }
       }
       return pMoves;
     }

     canAttack(chessboard){
       var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
       var count = 0;  //Contatore delle mosse possibili trovate
       for(var dx=-2; dx<=2; dx++){
         for(var dy=-2; dy<=2; dy++){
             if((Math.abs(dx)!=Math.abs(dy))&& dx!=0 && dy!=0){    //Controlla che il movimento sia ad L
                 var riga = this.x;
                 var colonna = this.y;
                 riga+=dx;
                 colonna+=dy;
                 if(corretto(riga, colonna)){        //Le coordinate non devono uscire dalla scacchiera
                     if(chessboard[riga][colonna].colore !== this.colore){ //se c'è un pezzo di colore diverso si può mangiare
                       pMoves[count] = [riga, colonna];
                       count++;
                     }
                 }
             }
         }
       }
       return pMoves;
     }
}

class Pawn extends Square {
    constructor(x, y, color, position){
      super(x, y)
      this.color = color;
      if(color === "white") this.character = "♙";
      if(color === "black") this.character = "♟";
      //Devo sapere se il pedone ha posizione iniziale in alto o in basso,
      //per determinare la direzione in cui può muovere
      if(x === 6){
        this.initialPosition = "bottom";
      }else if (x === 1) {
        this.initialPosition = "top";
      }
     }
     possibleMoves(chessboard){
       var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
       var count = 0;  //Contatore delle mosse possibili trovate
       var dx;
       if(this.initialPosition=== "bottom")dx=-1;    //I pedoni bianchi possono solo salire, quelli neri possono solo scendere (si possono muovere solo nella riga di fronte ad essi)
       if(this.initialPosition=== "top")dx=1;
       var riga = this.x;
       var colonna = this.y;
       riga+=dx;
       if(corretto(riga, colonna)){
           if(chessboard[riga][colonna].colore === "noColor"){  //Se la casella di fronte al pedone è libera posso muovercelo
             pMoves[count] = [riga, colonna];
             count++;
             //Se il pedone è nella posizione iniziale, può muversi di due caselle in avanti
             if(this.initialPosition==="bottom"&&this.x === 6){
               if(chessboard[4][this.y].colore === "noColor"){
                 pMoves[count] = [4, this.y];
                 count++;
               }
             }
             if(this.initialPosition==="top"&&this.x === 1){
               if(chessboard[3][this.y].colore === "noColor"){
                 pMoves[count] = [3, this.y];
                 count++;
               }
             }
           }
       }
       //Controllo le caselle in diagonale ma davanti al pedone, ci può andare solo se c'è un pezzo avversario
       colonna= (this.y)-1;
       if(corretto(riga,colonna)){
           if((chessboard[riga][colonna].colore !== this.colore)&&(chessboard[riga][colonna].colore !== "noColor")){ //se c'è un pezzo di colore diverso si può mangiare
             pMoves[count] = [riga, colonna];
             count++;
           }
       }
       colonna= (this.y)+1;
       if(corretto(riga,colonna)){
         if((chessboard[riga][colonna].colore !== this.colore)&&(chessboard[riga][colonna].colore !== "noColor")){ //se c'è un pezzo di colore diverso si può mangiare
           pMoves[count] = [riga, colonna];
           count++;
         }
       }
       //Controllo che le mosse non causino uno scacco sul mio re
       for(var count=0; count<pMoves.length; count++){
         if(checkMove(chessboard, this, pMoves[count][0], pMoves[count][1])){
           pMoves.splice(count,1);   //Rimuovo la mossa tra quelle possibili
           count--;
         }
       }
       return pMoves;
     }

     canAttack(chessboard){  //Funzione che sertituisce le caselle minacciate dal pedone
       var pMoves = [] //Vettore che contiene le coordinate x e y delle mosse possibili trovate
       var count = 0;  //Contatore delle mosse possibili trovate
       var dx;
       if(this.initialPosition=== "bottom")dx=-1;    //I pedoni bianchi possono solo salire, quelli neri possono solo scendere (si possono muovere solo nella riga di fronte ad essi)
       if(this.initialPosition=== "top")dx=1;
       var riga = this.x;
       var colonna = this.y;
       riga+=dx;
       //Controllo le caselle in diagonale ma davanti al pedone, ci può andare solo se c'è un pezzo avversario
       colonna= (this.y)-1;
       if(corretto(riga,colonna)){
           if((chessboard[riga][colonna].colore !== this.colore)&&(chessboard[riga][colonna].colore !== "noColor")){ //se c'è un pezzo di colore diverso si può mangiare
             pMoves[count] = [riga, colonna];
             count++;
           }
       }
       colonna= (this.y)+1;
       if(corretto(riga,colonna)){
         if((chessboard[riga][colonna].colore !== this.colore)&&(chessboard[riga][colonna].colore !== "noColor")){ //se c'è un pezzo di colore diverso si può mangiare
           pMoves[count] = [riga, colonna];
           count++;
         }
       }
       return pMoves;
     }
}

function corretto(x, y){  //Controlla che la casella con coordinate x e y sia contenuta nella scacchiera
	if (x<0 || x>7) return false;
	if (y <0 || y >7) return false;
	return true;
}

function check_line(chessboard, x, y, dx, dy){ //data una casella iniziale e coefficienti per la x e la y controlla le caselle in cui ci si può spostare
  var pMoves = [];
  var count = 0;
 var riga = x+dx;
 var colonna = y+dy;
 while(corretto(riga, colonna)){ //controlla di non uscire dalla scacchiera
     if(chessboard[riga][colonna].color === "noColor"){      //La casella è libera, mossa possibile
       pMoves[count] = [riga, colonna];
       count++;
     }else{
         if(chessboard[riga][colonna].color !== chessboard[x][y].color){ //se c'è un pezzo di colore diverso si può mangiare
           pMoves[count] = [riga, colonna];
           count++;
         }
         return pMoves; //La funzione finisce la sua esecuzione quando viene trovato un pezzo nella casella controllata perchè non si può passare attraverso ad essa
     }
     riga+=dx;
     colonna+=dy;
 }
 return pMoves;
}

function checkMove(chessboard, pieceToMove, newX, newY){  //True se la mossa porta ad uno scacco sul mio re (quindi mossa non possibile)
  //Devo modificare la scacchiera temporaneamente, il pezzo muove nella casella x,y e controllo se il re è minacciato
  var oldX = pieceToMove.x;
  var oldY = pieceToMove.y;
  var temp = chessboard[newX][newY];
  chessboard[pieceToMove.x][pieceToMove.y] = new Square(oldX,oldY); //La casella lasciata diventa vuota

  pieceToMove.x = newX;
  pieceToMove.y = newY;
  chessboard[newX][newY] = pieceToMove; //Muovo il pezzo

  //Cerco il mio re
  for(var row=0; row<8; row++){
    for(var col=0; col<8; col++){
      if(chessboard[row][col] instanceof King && chessboard[row][col].colore === pieceToMove.colore){
        myKing = chessboard[row][col];
      }
    }
  }
  //Controllo le mosse dei pezzi nemici
  for(var row=0; row<8; row++) {
      for(var col=0; col<8; col++) {
          if(chessboard[row][col].colore!==pieceToMove.colore){
            var pMoves = chessboard[row][col].canAttack(chessboard);

            if(pMoves != undefined){
              for(var count =0; count< pMoves.length; count++){
                if(pMoves[count][0]===myKing.x && pMoves[count][1]===myKing.y){ //Re minacciato
                  //Rimetto a posto la scacchiera
                  pieceToMove.x = oldX;
                  pieceToMove.y = oldY;
                  chessboard[oldX][oldY] = pieceToMove;
                  chessboard[newX][newY] = temp;
                  return true;  //Il re subirebbe uno scacco, mossa non possibile
                }
              }
            }
          }
      }
  }
  //Rimetto a posto la scacchiera
  pieceToMove.x = oldX;
  pieceToMove.y = oldY;
  chessboard[oldX][oldY] = pieceToMove;
  chessboard[newX][newY] = temp;
  return false; //Non ci sarebbe scacco, mossa possibile
}

function check(chessboard, myColor){ //True se la scacchiera attuale da uno scacco sul mio re
  //Cerco il mio re
  for(var row=0; row<8; row++){
    for(var col=0; col<8; col++){
      if(chessboard[row][col] instanceof King && chessboard[row][col].colore === myColor){
        myKing = chessboard[row][col];
      }
    }
  }
  //Controllo le mosse dei pezzi nemici
  for(var row=0; row<8; row++) {
      for(var col=0; col<8; col++) {
          if(chessboard[row][col].colore!==myColor){
            var pMoves = chessboard[row][col].canAttack(chessboard);

            if(pMoves != undefined){
              for(var count =0; count< pMoves.length; count++){
                if(pMoves[count][0]===myKing.x && pMoves[count][1]===myKing.y){ //Re minacciato
                  return true;  //C'è scacco
                }
              }
            }
          }
      }
  }
  return false; //Non c'è' scacco
}
