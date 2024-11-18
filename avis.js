// API pour gerer les avis utilsation de fecth pour reccuperer les donnes via db.json
export function ajoutListenersAvis() {
  const piecesElements = document.querySelectorAll(".fiches article button");

  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener("click", async function (event) {
      const id = event.target.dataset.id;
      //sauvegarder la reponse ds const reponse
      const reponse = await fetch(
        "http://localhost:8081/pieces/" + id + "/avis"
      );
      // afficher les avis apres reponse du serveur
      const avis = await reponse.json();
      //sauvegarde des avis
      window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis));

      // ajouter l'element au Parent du DOM
      const pieceElement = event.target.parentElement;
      afficherAvis(pieceElement, avis);
    });
  }
}
// rattacher au DOM
export function afficherAvis(pieceElement, avis) {
  // creation de l'element (paragraphe p dans le DOM)
  const avisElement = document.createElement("p");
  for (let i = 0; i < avis.length; i++) {
    avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire}`;
  }
  // rattacher avis à l'element
  pieceElement.appendChild(avisElement);
}

//ajout de la fonction qui envoie des avis des utilisateurs
export function ajoutListenerEnvoyerAvis() {
  const formulaireAvis = document.querySelector(".formulaire-avis");
  formulaireAvis.addEventListener("submit", function (event) {
    event.preventDefault(); //bloquer le navigateur de se mettre jour par defaut
    // Creation du nouvel Avis
    const avis = {
      pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
      utilisateur: event.target.querySelector("[name=utilisateur]").value,
      commentaire: event.target.querySelector("[name=commentaire]").value,
      nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value),
    };
    // Creation de la charge utile pour convertir au format json avec la function stringify
    const chargeUtile = JSON.stringify(avis);
    // appel de la fonction fetch avec ts les infos necessaire
    fetch("http://localhost:8081/avis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    });
  });
}
//function afficher le graphique des avis
export async function afficheGraphiqueAvis() {
  // Calcul totale du nombres de commentaire par quantites d'etoiles
  const avis = await fetch("http://localhost:8081/avis").then((avis) =>
    avis.json()
  );
  const nb_commentaires = [0, 0, 0, 0, 0];
  for (let commentaire of avis) {
    nb_commentaires[nb_commentaires - 1]++;
  }
  // la legende a afficher sur la gauche a coté de la barre horizontale
  const labels = ["5", "4", "3", "2", "1"];
  const data = {
    labels: labels,
    dataset: [
      {
        label: "Etoiles attribues",
        data: nb_commentaires.reverse(),
        backgroundColor: "rgba(255,230,0,1)", // couleur jaune
      },
    ],
  };
  // objet de configuration finale
  const config = {
    type: "bar",
    data: data,
    options: {
      indexAxis: "y",
    },
  };
  // rendu de l'elemnt dans le canvas
  const graphiqueAvis = new Chart(
    document.querySelector("#graphique-avis"),
    graphiqueAvis
  );
}
// Recuperation des pieces depuis le localStorage
const piecesJSON = window.localStorage.getItem("pieces");
const pieces = JSON.parse(piecesJSON);
// calcul du nombre de commentaire
let nbCommentairesDispo = 0;
let nbCommentairesNonDispo = 0;
for (let i = 0; i < avis.length; i++) {
  const piece = pieces.find((p) => p.id === avis[i].pieceId);
  if (piece) {
    if (piece.disponibilte) {
      nbCommentairesDispo++;
    } else {
      nbCommentairesNonDispo++;
    }
  }
  // la legende a afficher sur la gauche a coté de la barre horizontale
  const labelsDispo = ["Disponibles", "Non dispo."];
  // donnee et personisation du graphique
  const dataDispo = {
    labels: labelsDispo,
    datasets: [
      {
        label: "nombre de commentaoire",
        data: [nbCommentairesDispo, nbCommentairesNonDispo],
        backgroundColor: "rgba(0,230,255,1)", // couleur jaune
      },
    ],
  };
  // objet de configuration finale
  const configDispo = {
    type: "bar",
    data: dataDispo,
  };
  // rendu de l'elemnt dans le canvas
  new Chart(document.querySelector("#graphique-dispo"), configDispo);
}
