// déclaration de 2 tableau premier pour stocker les valeurs
// second pour afficher les données trié

let allPokemon = [];
let tableauFin = [];
const searchInput = document.querySelector('.recherche-poke input');
const listePoke = document.querySelector('.liste-poke');
const chargement = document.querySelector('.loader');


// liste des couleurs par type 
const types = {
    grass: '#78C850',
    ground: '#E2BF65',
    dragon: '#6F35FC',
    fire: '#F58271',
    electric: '#F7D02C',
    fairy: '#D685AD',
    poison: '#966DA3',
    bug: '#B3F594',
    water: '#6390F0',
    normal: '#D9D5D8',
    psychic: '#F95587',
    flying: '#A98FF3',
    fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice : '#96D9D6',
    dark : '#5A5563',
    steel : '#ADADC6',
};

// premier appel à l'API qui récupère toutes les infos 

function fetchPokemonbase(){
  
    fetch("https://pokeapi.co/api/v2/pokemon?limit=385")
        .then(response => response.json() )
        .then((allPoke) => {
            allPoke.results.forEach((pokemon) => {
                fetchPokemonComplet(pokemon);
            })

            
    })
}

fetchPokemonbase();

// création de l'objet par Pokemon

function fetchPokemonComplet(pokemon){

    let objPokemonFull = {};
    let url = pokemon.url;
    let nameP = pokemon.name;

    fetch(url)
    .then(reponse => reponse.json())
    .then((pokeData) => {
        objPokemonFull.pic = pokeData.sprites.front_default;
        objPokemonFull.type = pokeData.types[0].type.name;
        objPokemonFull.id = pokeData.id;


    // appel au 2nd API pour traduire le nom anglais en français 
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
        .then (reponse => reponse.json())
        .then ((pokeData) => {
            
            objPokemonFull.name = pokeData.names[4].name;
            allPokemon.push(objPokemonFull);

            if(allPokemon.length === 385) {
                
                tableauFin = allPokemon.sort((a,b) => {
                    return a.id - b.id;
                
                }).slice(0,21);

                createCard(tableauFin);
                chargement.style.display = "none";
            }
        })
        


    })
}

// création de carte 

function createCard(arr){

    for (let i = 0; i < arr.length; i++) {
        const carte = document.createElement('li');
        let couleur = types[arr[i].type];
        carte.style.background = couleur;
        const txtCarte = document.createElement('h5');
        txtCarte.innerText = arr[i].name;
        const idCarte = document.createElement('p');
        idCarte.innerText = `ID#${arr[i].id}`
        const imgCarte = document.createElement('img');
        imgCarte.src = arr[i].pic;

        carte.appendChild(imgCarte);
        carte.appendChild(txtCarte);
        carte.appendChild(idCarte);

        listePoke.appendChild(carte);
        
    }
}

// scroll infini

window.addEventListener('scroll', () => {

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    // Scroll depuis le top / scroll total / hauteur de la fenêtre partie visible

    if(clientHeight + scrollTop >= scrollHeight - 20){
        addPoke(6)
    }
})

let index = 21;

function addPoke(nb) {
    if(index > 385){
        return;
    } 
    const arrToAdd = allPokemon.slice(index, index+nb);
    createCard(arrToAdd);
    index +=nb;
}

// Systeme de recherche 

searchInput.addEventListener('keyup', recherche);

function recherche(){
    if (index < 385){
        addPoke(364);
    }

    let filter,allLi,titleValue, allTitles;
    filter = searchInput.value.toUpperCase();
    allLi = document.querySelectorAll('li');
    allTitles= document.querySelectorAll('li > h5');

    for(i = 0; i < allLi.length; i++) {

        titleValue = allTitles[i].innerText;

        if(titleValue.toUpperCase().indexOf(filter)> -1 ){
            allLi[i].style.display = 'flex';
        } else {
            allLi[i].style.display = 'none';
        }
    }

}

// Si le text input n'est pas vide alors la transition reste activé 
searchInput.addEventListener('input', function(e) {

    if(e.target.value !== "") {
        e.target.parentNode.classList.add('active-input');
    } else if (e.target.value === "") {
        e.target.parentNode.classList.remove('active-input');
    }
});
