const localData = localDataStorage("smash");

const dex = new Pokedex.Pokedex();

if (!localData.haskey("smashedPokemon")) {
  localData.set("smashedPokemon", []);
}

const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", () => {
  localData.clear();
  window.location = "https://pokesmash.neocities.org/";
});

let currentPokemonId = localData.haskey("lastPokemonId")
  ? localData.get("lastPokemonId") + 1
  : 1;
console.log(currentPokemonId);

const prevButton = document.querySelector("#prev");
if (currentPokemonId > 1) {
  prevButton.classList.remove("hidden");
}

const loadPokemon = (id) => {
  const idNumber = document.querySelector("#idNumber");
  idNumber.innerText = id;
  const sprite = document.querySelector("img");
  sprite.setAttribute("src", `/img/${id}.png`);
  const name = document.querySelector("#name");
  const height = document.querySelector("#height");
  const weight = document.querySelector("#weight");
  const types = document.querySelector("#types");
  dex
    .getPokemonByName(id)
    .then((pokemon) => {
      console.log(pokemon);
      name.innerText = pokemon.name;
      height.innerText = pokemon.height;
      weight.innerText = pokemon.weight;
      types.innerText = pokemon.types[0].type.name;
      pokemon.types.forEach((type, i) => {
        if (i >= 1) {
          types.append(`/${type.type.name}`);
        }
      });
      return { name: pokemon.name, id: id };
    })
    .catch((e) => console.log(e));
};

let currentPokemon = loadPokemon(currentPokemonId);

const goToNextPokemon = () => {
  localData.set("lastPokemonId", currentPokemonId);
  if (currentPokemonId === 1) {
    prevButton.classList.remove("hidden");
  }
  if (currentPokemonId === 1008) {
    window.location.href = "/tierlist.html";
  }
  currentPokemonId++;
};

const goToPrevPokemon = () => {
  if (currentPokemonId > 2) {
    currentPokemonId--;
    localData.set("lastPokemonId", currentPokemonId - 1);
  }
  if (currentPokemonId === 2) {
    currentPokemonId--;
    localData.remove("lastPokemonId");
    prevButton.classList.add("hidden");
  }
};

const smash = () => {
  console.log("current pokemon", currentPokemon);
  if (!localData.contains("smashedPokemon", currentPokemon)) {
    localData.push("smashedPokemon", currentPokemon);
  }
  goToNextPokemon();
  currentPokemon = loadPokemon(currentPokemonId);
  console.log("now loading", currentPokemon);
};

const pass = () => {
  if (localData.contains("smashedPokemon", currentPokemon)) {
    localData.pull("smashedPokemon", currentPokemon);
  }
  goToNextPokemon();
  currentPokemon = loadPokemon(currentPokemonId);
};

const prev = () => {
  goToPrevPokemon();
  currentPokemon = loadPokemon(currentPokemonId);
};

const smashButton = document.querySelector("#smash");
const passButton = document.querySelector("#pass");

smashButton.addEventListener("click", smash);
// smashButton.addEventListener("keydown", (e) => {
//   if (e.key === "Enter") {
//     smash();
//   }
// });

passButton.addEventListener("click", pass);
// passButton.addEventListener("keydown", (e) => {
//   if (e.key === "Enter") {
//     pass();
//   }
// });

prevButton.addEventListener("click", prev);
// prevButton.addEventListener("keydown", (e) => {
//   if (e.key === "Enter") {
//     prev();
//   }
// });
