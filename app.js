// déclaration de 2 tableau premier pour stocker les valeurs
// second pour afficher les données trié

let allPokemon = [];
let tableauFin = [];
const searchInput = document.querySelector('.recherche-poke input');
const listePoke = document.querySelector('.liste-poke');


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
};

// premier appel à l'API qui récupère toutes les infos 

function fetchPokemonbase(){
  
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
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

            if(allPokemon.length === 151) {
                
                tableauFin = allPokemon.sort((a,b) => {
                    return a.id - b.id;
                
                }).slice(0,21);

                createCard(tableauFin);
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

// Si le text input n'est pas vide alors la transition reste activé 
searchInput.addEventListener('input', function(e) {

    if(e.target.value !== "") {
        e.target.parentNode.classList.add('active-input');
    } else if (e.target.value === "") {
        e.target.parentNode.classList.remove('active-input');
    }
});
