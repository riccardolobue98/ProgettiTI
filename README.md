# ProgettoTI
Progetto per l'esame di Tecnologie Internet. Luca Bonelli e Gaspare Riccardo Lo Bue

Scacchi P2P

L'obiettivo del progetto è di creare un'applicazione web scritta in JS che permette a due giocatori di svolgere una partita a scacchi con comunicazione P2P, grazie a PeerJS.

Demo: http://p2pchess.altervista.org/

Funzionamento:

Aprendo index.html viene creato un Peer, identificato da un ID.
Per inviare una richiesta di partita, un utente deve inserire l'ID di un altro Peer.
L'utente che riceve una richiesta può decidere se accettarla o no.
Viene quindi inizializzata la scacchiera: l'utente che ha inserito l'ID giocherà con i bianchi, l'utente che ha aspettato la connessione giocherà con i neri.

Quando l'utente clicca su un pezzo del proprio colore, vengono evidenziate di rosso le caselle in cui esso può muovere.
Con un ulteriore click su una di queste caselle, il pezzo viene mosso.
Un click su una casella non evidenziata di rosso annulla l'azione.

Ogni volta che un utente effettua una mossa, essa viene inviata all'altro Peer, modificandone la scacchiera.
La mossa appena eseguita viene evidenziata in verde.

All'inizio e alla fine di ogni turno viene valutata la scacchiera per trovare una eventuale posizione di scacco matto o stallo.

A destra della scacchiera sono presenti timer dei due giocatori (solamente informativi, non ci sono limiti di tempo nelle mosse), il contatore dei turni e un button per la resa.

Una volta terminata la partita, è possibile il rematch.
