// Select all necessary elements taht you will use for this project
const $pokemonList = document.getElementById('pokemonList');
const $loadMore = document.getElementById('loadMore');
const $pokeCard = document.getElementById('pokeCard');
const $pokeDetails = document.getElementById('pokeDetails');
const $closeCard = document.getElementById('closeCard');

// Helper to get ID from URL.
// (was given in the instructions-this function just extracts the pokemon via its ID number in the URL)
function parseUrl(url) {
  return url.substring(url.substring(0, url.length - 2).lastIndexOf('/') + 1, url.length - 1);
}

// Deck of all loaded Pokémon
const pokedex = [];

// Display function that updates the list.
// (I used a similar type of function used in the monopoly demonstration video here:)
function displayPokemon(pokemonArray) {
  for (const pokemon of pokemonArray) {
    pokedex.push(pokemon);
  }

  let html = '';

  for (const pokemon of pokedex) {
    const id = parseUrl(pokemon.url);
    //creating a class called pokemon-item using innerHTML:
    html += `
      <li class="pokemon-item" data-id="${id}"> 
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="${pokemon.name}">
        <p>${pokemon.name}</p>
      </li>
    `;
  }

  $pokemonList.innerHTML = html;
  attachPokemonClickEvents();
}

// Track current batch
let currentIndex = 0;

// Asynchronous loader 
async function loadPokemon() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${currentIndex}&limit=20`);
  const json = await response.json();
  displayPokemon(json.results);
  currentIndex += 20;
}

// Load the Pokémon that I have just sent a request for got response for 
loadPokemon();

// Load more when button is clicked 
$loadMore.addEventListener('click', async function (e) {
  loadPokemon();
});

// form to open a pokemon card when clicked:
function attachPokemonClickEvents() {
  const $pokemonItems = document.querySelectorAll('.pokemon-item');

  for (const $item of $pokemonItems) {
    $item.addEventListener('click', async function () {
      const id = $item.getAttribute('data-id');

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();

      let types = '';
      for (const t of data.types) {
        types += `<li class="pokemon-type ${t.type.name}">${t.type.name}</li> `;
      }

      let abilities = '';
      for (const a of data.abilities) {
        abilities += `<li>${a.ability.name}</li>`;
      }

      const detailHTML = `
        <h2 style="text-transform: capitalize;">${data.name}</h2>
        <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}" style="width: 150px;">
        <p><strong>Type:</strong></p>
        <ul>${types}</ul>
        <p><strong>Abilities:</strong></p>
        <ul>${abilities}</ul>
      `;

      $pokeDetails.innerHTML = detailHTML;
      $pokeCard.style.display = 'block';

      // Create the Catch button
      const $catchButton = document.createElement('button');
      $catchButton.textContent = 'Catch It!';
      $catchButton.className = 'catch-button';

      // Add it to the details section
      $pokeDetails.appendChild($catchButton);

      // Add event listener to Catch button
      $catchButton.addEventListener('click', function () {
        const $confirm = document.createElement('p'); //creating a paragraph element 
        // in the HTML to show that the pokemon 
        // has been caught
        $confirm.textContent = `${data.name} has been caught!`;
        $confirm.className = 'caught-message'; //creating a class for the paragraph 
        // element so I can style it later in css. 
        $pokeDetails.appendChild($confirm);
      });
    });
  }
}

// card closer function
$closeCard.addEventListener('click', function () {
  $pokeCard.style.display = 'none';
});

