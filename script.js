// Variables
// Menu
const resetGame = document.querySelector('#newGame');

// Zone du dé
const collect = document.querySelector('#collect');
const diceNumber = document.querySelector('#diceResult');
const namePlayer = document.querySelector('#namePlayer');

// Zone de jeu Marc
const marcPlant = document.querySelector('#marcPlantAction');
const marcTreesScore = document.querySelector('#marcTreesPlanted');
const marcTreesZone = document.querySelector('#marcTreesZone');

// Zone de jeu Dany
const danyPlant = document.querySelector('#danyPlantAction');
const danyTreesScore = document.querySelector('#danyTreesPlanted');
const danyTreesZone = document.querySelector('#danyTreesZone');


// Messages par fenêtre modale
const looseMessage = document.querySelector('#modal-js-perdu');
const winMessageMarc = document.querySelector('#modal-js-marc');
const winMessageDany = document.querySelector('#modal-js-dany');


// LES JOUEURS

class Player {
  constructor (name, roundScore, globalScore, treesPlanted, treesZone, treeType, winMessage){
    this.name = name;
    this.roundScore = roundScore;
    this.globalScore = globalScore;
    this.treesPlanted = treesPlanted;
    this.treesZone = treesZone;
    this.treeType = treeType;
    this.winMessage = winMessage;
  }
}

let marcPlayer = new Player ('Marc', 0, 0, marcTreesScore, marcTreesZone, 'Pommier.png', winMessageMarc);

let danyPlayer = new Player ('Dany', 0, 0, danyTreesScore, danyTreesZone, 'Arbre.png', winMessageDany);


// Initialisation des compteurs
let dice = 0; 

// Joueur débutant la partie
let currentPlayer = marcPlayer;
danyPlant.setAttribute('disabled', '');
namePlayer.innerText= currentPlayer.name;

newGame();


// Les fonctions du jeu

// Le dé à 0

function diceReset() {
  dice = 0
  diceNumber.innerText = dice;

}

// Les messages à 0

function messagePlantReset(){

  collectedPlants.innerText = `0 plant collecté`;

}

function messageTreesReset(player){

  player.treesPlanted.innerText = `${player.globalScore} arbre planté`;

}

// Suppression des arbres plantés affichés

function removeTrees(player){
  while(player.treesZone.firstChild){
    player.treesZone.removeChild(player.treesZone.firstChild);
  }
}

// Nouvelle partie ou victoire

function newGame () {

  //Joueur Marc
  marcPlayer.roundScore = 0;
  marcPlayer.globalScore = 0;
  messageTreesReset(marcPlayer);

  // Joueur Dany
  danyPlayer.roundScore = 0;
  danyPlayer.globalScore = 0;
  messageTreesReset(danyPlayer);
  
  messagePlantReset();

  // Dé est à 0
  diceReset();

  // Suppression des rangées d'arbres plantés

  removeTrees(marcPlayer);
  removeTrees(danyPlayer);

  // Retour au joueur Marc
  if(marcPlant.hasAttribute('disabled')){
    marcPlant.removeAttribute('disabled');
    danyPlant.setAttribute('disabled', '');
  }

  return currentPlayer = marcPlayer;
  
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

    // Déclencher le message
    message.classList.add('is-active');

    setTimeout( () => {
      message.classList.remove('is-active');
      // Le dé est à 0
      diceReset();
    }, delay);

}

// Afficher les rangées d'arbres plantés

function showTreesRow(player, number){
  if(player.treesZone.children.length !== number){
    for(let i = player.treesZone.children.length ; i < number ; i++){
      let image = document.createElement('img');
      image.src = `/images/${player.treeType}`;
      image.className = 'treesShow';
      image.alt = '1 arbre affiché pour 5 arbres plantés';
      player.treesZone.appendChild(image);
    }
  }
}

// Tour de jeu d'un joueur

function play (player){
  
  dice = Math.floor(Math.random() * 10 + 1);
  // On récupère le chiffre du dé dans la zone d'affichage
  diceNumber.innerText = dice;

    // Cas Particulier
    if (dice === 1){
      
      collect.setAttribute('disabled', '');

      //Réinitialisation du score de plants collectés à 0
      player.roundScore = 0;
      
      // Ajouter l'animation de perte 
      diceNumber.classList.add('has-text-danger');
      diceNumber.classList.add('loose-image');
      
      setTimeout(() => {
        
        // Retrait des classes d'animation
        diceNumber.classList.remove('has-text-danger');
        diceNumber.classList.remove('loose-image');
        
        // Déclencher la modale des plants perdus
        playMessage(looseMessage, 2500);
        
        diceNumber.innerText = 0;
      }, 1500);
      
      
      // Affichage des plants collectés à 0
      messagePlantReset();
      
      // Prochain joueur
      setTimeout(() => {
        nextPlayer();
        namePlayer.innerText = currentPlayer.name;
        collect.removeAttribute('disabled');
      }, 2000);
    
    } else {
      // on ajoute le score du dé à la zone .. plants collectés
    
      player.roundScore +=  dice;
    
      // On affiche le score total de plants collectés sur le tour
      if (player.roundScore > 1){
        collectedPlants.innerText = `${player.roundScore} plants collectés`;
      } else {
        messagePlantReset();
      }
    }
}

// Planter la collecte de plants

function holdPlants (player){

    // On ajoute les plants collectés aux arbres plantés
    player.globalScore += currentPlayer.roundScore;

    // Calcul du nombre de rangées d'arbres plantés à afficher

    let numberTreesRow = Math.round(player.globalScore / 5);

    showTreesRow(player, numberTreesRow);
    
    // Affichage du nombre total d'arbres
  
    if(player.globalScore > 2){
      player.treesPlanted.innerText = `${player.globalScore} arbres plantés`;
    } else {
      messageTreesReset(player);
    };
    
    // En cas de victoire
    if(player.globalScore >= 100){
  
      //Afficher le message pour le gagnant
      
      playMessage(player.winMessage, 4500);
    
      //Nouvelle partie : remise à zéro des compteurs
      newGame();

      namePlayer.innerText= currentPlayer.name;
  
    } else {
      // Réinitialisation des plants collectés à 0
    
      player.roundScore = 0;
      messagePlantReset();
      
      // Le dé est à 0
      diceReset();
    
      // Prochain joueur
      nextPlayer();

      // Affichage du nom du prochain joueur
      namePlayer.innerText = currentPlayer.name;
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

  namePlayer.innerText = currentPlayer.name;

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
  })