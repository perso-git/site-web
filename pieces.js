import {
  ajoutListenersAvis,
  ajoutListenerEnvoyerAvis,
  afficherAvis,
  afficheGraphiqueAvis,
} from "./avis.js";
// recuperation des information sauvegardés ds le localstorage
let pieces = window.localStorage.getItem("pieces");
if (pieces === null) {
  // Récupération des pièces depuis le fichier JSON
  const reponse = await fetch("http://localhost:8080/pieces/");
  const pieces = await reponse.json();
  // transformation des pieces en format JSON
  const valeurPieces = JSON.stringify(pieces);
  // sauvegarder les informations dans le localstorage
  valeurPieces = localStorage.setItem("pieces", valeurPieces);
} else {
  pieces = JSON.parse(pieces);
}
// on appelle la fonction pour ajouter le listner du formulaire
ajoutListenerEnvoyerAvis();

function genererPieces(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const article = pieces[i];
    // Récupération de l'élément du DOM qui accueillera les fiches
    const sectionFiches = document.querySelector(".fiches");
    // Création d’une balise dédiée à une pièce automobile
    const pieceElement = document.createElement("article");
    // Création des balises
    const imageElement = document.createElement("img");
    imageElement.src = article.image;
    const nomElement = document.createElement("h2");
    nomElement.innerText = article.nom;
    const prixElement = document.createElement("p");
    prixElement.innerText = `Prix: ${article.prix} € (${
      article.prix < 35 ? "€" : "€€€"
    })`;
    const categorieElement = document.createElement("p");
    categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
    const descriptionElement = document.createElement("p");
    descriptionElement.innerText =
      article.description ?? "Pas de description pour le moment.";
    const stockElement = document.createElement("p");
    stockElement.innerText = article.disponibilite
      ? "En stock"
      : "Rupture de stock";
    // code avis a rajouter
    const avisBouton = document.createElement("button");
    avisBouton.dataset.id = article.id;
    avisBouton.textContent = "Afficher les avis";

    // On rattache la balise article a la section Fiches
    sectionFiches.appendChild(pieceElement);
    // On rattache l’image à pieceElement (la balise article)
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    //Ajout des éléments au DOM pour l'exercice
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(stockElement);
    // code  avis ajoute
    pieceElement.appendChild(avisBouton);
  }
  //ajoutListenerAvis();
  ajoutListenersAvis();
}

// affichage de la page :
genererPieces(pieces);

for (let i = 0; i < pieces.length; i++) {
  const id = pieces[i].id;
  const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
  const avis = JSON.parse(avisJSON);
  if (avis !== null) {
    const pieceElement = document.querySelector(`article[data-id="${id}"]`);
    afficherAvis(pieceElement, avis);
  }
}

//gestion des bouttons
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
  const piecesOrdonnees = Array.from(pieces);
  piecesOrdonnees.sort(function (a, b) {
    return a.prix - b.prix;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesOrdonnees);
});

const boutonFiltrer = document.querySelector(".btn-filtrer");

boutonFiltrer.addEventListener("click", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix <= 35;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesFiltrees);
});

//Correction Exercice
const boutonDecroissant = document.querySelector(".btn-decroissant");

boutonDecroissant.addEventListener("click", function () {
  const piecesOrdonnees = Array.from(pieces);
  piecesOrdonnees.sort(function (a, b) {
    return b.prix - a.prix;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesOrdonnees);
});

const boutonNoDescription = document.querySelector(".btn-nodesc");

boutonNoDescription.addEventListener("click", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.description;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesFiltrees);
});

const noms = pieces.map((piece) => piece.nom);
for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].prix > 35) {
    noms.splice(i, 1);
  }
}
console.log(noms);
//Création de l'en-tête

const pElement = document.createElement("p");
pElement.innerText = "Pièces abordables";
//Création de la liste
const abordablesElements = document.createElement("ul");
//Ajout de chaque nom à la liste
for (let i = 0; i < noms.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.innerText = noms[i];
  abordablesElements.appendChild(nomElement);
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document
  .querySelector(".abordables")
  .appendChild(pElement)
  .appendChild(abordablesElements);

//Code Exercice
const nomsDisponibles = pieces.map((piece) => piece.nom);
const prixDisponibles = pieces.map((piece) => piece.prix);

for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].disponibilite === false) {
    nomsDisponibles.splice(i, 1);
    prixDisponibles.splice(i, 1);
  }
}

const disponiblesElement = document.createElement("ul");

for (let i = 0; i < nomsDisponibles.length; i++) {
  const nomElement = document.createElement("li");
  nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
  disponiblesElement.appendChild(nomElement);
}

const pElementDisponible = document.createElement("p");
pElementDisponible.innerText = "Pièces disponibles:";
document
  .querySelector(".disponibles")
  .appendChild(pElementDisponible)
  .appendChild(disponiblesElement);

const inputPrixMax = document.querySelector("#prix-max");
inputPrixMax.addEventListener("input", function () {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix <= inputPrixMax.value;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesFiltrees);
});
// Ajout du Listener  pour mettre a jour les données du LocalStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function (event) {
  window.localStorage.removeItem("pieces");
});
//appel de la function a fficher graphique
afficheGraphiqueAvis();
