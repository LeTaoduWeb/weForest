// Variables
// Menu
const resetGame = document.querySelector('#newGame');

// Zone du dé
const collect = document.querySelector('#collect');
const diceNumber = document.querySelector('#diceResult');

// Zone de jeu Marc
const marcPlant = document.querySelector('#marcPlantAction');
const marcTreesScore = document.querySelector('#marcTreesPlanted');
const marcCollect = document.querySelector('#marcCollectedPlants');
const marcAppleTrees = document.querySelector('#marcTreesShow');

// Zone de jeu Dany
const danyPlant = document.querySelector('#danyPlantAction');
const danyTreesScore = document.querySelector('#danyTreesPlanted');
const danyCollect = document.querySelector('#danyCollectedPlants');
const danyAppleTrees = document.querySelector('#danyTreesShow');

// Messages par fenêtre modale
const looseMessage = document.querySelector('#modal-js-perdu');
const winMessageMarc = document.querySelector('#modal-js-marc');
const winMessageDany = document.querySelector('#modal-js-dany');

// LES JOUEURS

class Player {
  constructor (roundScore, globalScore, plantCollected,treesPlanted, winMessage){
    this.roundScore = roundScore;
    this.globalScore = globalScore;
    this.plantCollected = plantCollected;
    this.treesPlanted = treesPlanted;
    this.winMessage = winMessage;
  }
}

let marcPlayer = new Player (0, 0, marcCollect, marcTreesScore, winMessageMarc);

let danyPlayer = new Player (0, 0, danyCollect, danyTreesScore, winMessageDany);


// Initialisation des compteurs
let dice = 0; 

newGame();


// Joueur débutant la partie
let currentPlayer = marcPlayer;
danyPlant.setAttribute('disabled', '');


// Les fonctions du jeu

// Le dé à 0

function diceReset() {

  dice = 0
  diceNumber.innerText = dice;

}

// Les messages à 0

function messagePlantReset(player){

  player.plantCollected.innerText = `${player.roundScore} plant collecté`;

}

function messageTreesReset(player){

  player.treesPlanted.innerText = `${player.globalScore} arbre planté`;

}

// Nouvelle partie ou victoire

function newGame () {

  //Joueur Marc
  marcPlayer.roundScore = 0;
  marcPlayer.globalScore = 0;
  messagePlantReset(marcPlayer);
  messageTreesReset(marcPlayer);

  //Joueur Dany
  danyPlayer.roundScore = 0;
  danyPlayer.globalScore = 0;
  messagePlantReset(danyPlayer);
  messageTreesReset(danyPlayer);
  
  //Dé est à 0
  diceReset();

  //Retour au joueur Marc
  if(marcPlant.hasAttribute('disabled')){
    marcPlant.removeAttribute('disabled');
    danyPlant.setAttribute('disabled', '');
  }
} 


// Changer de joueur

function nextPlayer() {
  if (currentPlayer === marcPlayer) {
      currentPlayer = danyPlayer;
      marcPlant.setAttribute('disabled', '');
      danyPlant.removeAttribute('disabled');

  } else {
      currentPlayer = marcPlayer;
      danyPlant.setAttribute('disabled', '');
      marcPlant.removeAttribute('disabled');
  }
  return currentPlayer;
}

// Affichage de message du jeu et initialisation du dé

function playMessage(message, delay){

    // Déclencher la modale des plants perdus
    message.classList.add('is-active');

    setTimeout( () => {
      message.classList.remove('is-active');
      // Le dé est à 0
      diceReset();
    }, delay);

}

// Tour de jeu d'un joueur

function play (player){

  dice = Math.floor(Math.random() * 10 + 1);
  // On récupère le chiffre du dé dans la zone d'affichage
  diceNumber.innerText = dice;

    // Cas Particulier
    if (dice === 1){

      //Réinitialisation du score de plants collectés à 0
      player.roundScore = 0;
      
      // Déclencher la modale des plants perdus
      playMessage(looseMessage, 3000);
  
      // Affichage des plants collectés à 0
      messagePlantReset(player);
  
      // Prochain joueur
  
      nextPlayer();

    
    } else {
      // on ajoute le score du dé à la zone .. plants collectés
    
      player.roundScore +=  dice;
    
      // On affiche le score total de plants collectés sur le tour
      if (player.roundScore > 1){
        player.plantCollected.innerText = `${player.roundScore} plants collectés`;
      } else {
        messagePlantReset(player);
      }
    }
}

// Planter la collecte de plants

function holdPlants (player){

    // On ajoute les plants collectés aux arbres plantés
    player.globalScore += currentPlayer.roundScore;

    // Affichage du nombre total d'arbres
  
    if(player.globalScore > 2){
      player.treesPlanted.innerText = `${player.globalScore} arbres plantés`;
    } else {
      messageTreesReset(player);
    };
  
    if(player.globalScore > 100){
  
      //Afficher le message pour le gagnant
      
      playMessage(player.winMessage, 4500);
    
      //Nouvelle partie : remise à zéro des compteurs
      newGame();
  
    } else {
      // Réinitialisation des plants collectés à 0
    
      player.roundScore = 0;
      messagePlantReset(player);
      
      // Le dé est à 0
      diceReset();
    
      // Prochain joueur
      nextPlayer();
    }

}


// LE JEU

// Lancer le dé
collect.addEventListener ('click',() => {

  play(currentPlayer);

})

// Retirer les plants gagnés

marcPlant.addEventListener ('click', () => {
 
  holdPlants(marcPlayer);

});

danyPlant.addEventListener ('click', () => {
  
  holdPlants(danyPlayer);

});


// Nouvelle partie

resetGame.addEventListener ('click', (e) => {
  e.preventDefault();
  newGame();

});



// MESSAGES
// Modal Concours et Règles
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
      console.log($target);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;
  
      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });
  });


// Notification pour mobile
  document.addEventListener('DOMContentLoaded', () => {
    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
      const $notification = $delete.parentNode;
  
      $delete.addEventListener('click', () => {
        $notification.parentNode.removeChild($notification);
      });
    });
  });
