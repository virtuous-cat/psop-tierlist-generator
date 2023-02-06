const localData = localDataStorage("smash");

const dex = new Pokedex.Pokedex();

const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", () => {
  localData.clear();
  window.location.href = "/";
});

if (!localData.haskey("smashedPokemon")) {
  localData.set("smashedPokemon", []);
}

let currentPokemonId = localData.haskey("lastPokemonId")
  ? localData.get("lastPokemonId") + 1
  : 1;
console.log(currentPokemonId);

if (currentPokemonId > 1008) {
  window.location.href = "/tierlist.html";
}

const smashButton = document.querySelector("#smash");
const passButton = document.querySelector("#pass");
const prevButton = document.querySelector("#prev");
if (currentPokemonId > 1) {
  prevButton.classList.remove("hidden");
}

const pokemonName = document.querySelector("#name");
const height = document.querySelector("#height");
const weight = document.querySelector("#weight");
const types = document.querySelector("#types");
const idNumber = document.querySelector("#idNumber");
const sprite = document.querySelector("img");

const capitalize = (word) => word.replace(word[0], word[0].toUpperCase());

const loadPokemon = async (id) => {
  try {
    idNumber.innerText = id;
    sprite.setAttribute("src", `/img/${id}.png`);
    const pokemon = await dex.getPokemonByName(id);
    console.log(pokemon);
    pokemonName.innerText = capitalize(pokemon.name);
    height.innerText = pokemon.height;
    weight.innerText = pokemon.weight;
    types.innerText = capitalize(pokemon.types[0].type.name);
    pokemon.types.forEach((type, i) => {
      if (i >= 1) {
        types.append(`/${capitalize(type.type.name)}`);
      }
    });
    return { name: capitalize(pokemon.name), id: id };
  } catch (error) {
    console.log(error);
    pokemonName.innerText = "Unable to load Pokemon, refresh to try again.";
  }
};

const loadInitialPokemon = async () => {
  await loadPokemon(currentPokemonId);
};

loadInitialPokemon();

const goToNextPokemon = () => {
  console.log("before go to next id", currentPokemonId);
  localData.set("lastPokemonId", currentPokemonId);
  if (currentPokemonId === 1) {
    prevButton.classList.remove("hidden");
  }
  if (currentPokemonId >= 1008) {
    window.location.href = "/tierlist.html";
  }
  currentPokemonId++;
  console.log("after go to next id", currentPokemonId);
};

const goToPrevPokemon = () => {
  console.log("before go to prev id", currentPokemonId);
  if (currentPokemonId > 2) {
    currentPokemonId--;
    localData.set("lastPokemonId", currentPokemonId - 1);
  }
  if (currentPokemonId === 2) {
    currentPokemonId--;
    localData.remove("lastPokemonId");
    prevButton.classList.add("hidden");
  }
  console.log("after go to prev id", currentPokemonId);
};

const saveCurrentPokemon = () => {
  return { name: pokemonName.innerText, id: currentPokemonId };
};

const smash = async () => {
  const currentPokemon = saveCurrentPokemon();
  console.log("current pokemon", currentPokemon);
  if (!localData.contains("smashedPokemon", currentPokemon)) {
    localData.push("smashedPokemon", currentPokemon);
  }
  goToNextPokemon();
  const nextPokemon = await loadPokemon(currentPokemonId);
  console.log("now loading", nextPokemon);
};

const pass = async () => {
  const currentPokemon = saveCurrentPokemon();
  console.log("current pokemon", currentPokemon);
  if (localData.contains("smashedPokemon", currentPokemon)) {
    localData.pull("smashedPokemon", currentPokemon);
  }
  goToNextPokemon();
  const nextPokemon = await loadPokemon(currentPokemonId);
  console.log("now loading", nextPokemon);
};

const prev = async () => {
  goToPrevPokemon();
  const nextPokemon = await loadPokemon(currentPokemonId);
  console.log("now loading", nextPokemon);
};

smashButton.addEventListener("click", async () => {
  await smash();
});
// smashButton.addEventListener("keydown", async (e) => {
//   if (e.key === "Enter") {
//     await smash();
//   }
// });

passButton.addEventListener("click", async () => {
  await pass();
});
// passButton.addEventListener("keydown", async (e) => {
//   if (e.key === "Enter") {
//     await pass();
//   }
// });

prevButton.addEventListener("click", async () => {
  await prev();
});
// prevButton.addEventListener("keydown", async (e) => {
//   if (e.key === "Enter") {
//     await prev();
//   }
// });
