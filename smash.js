const localData = localDataStorage("smash");

const dex = new Pokedex.Pokedex();

let currentPokemonId = localData.haskey("lastPokemonId")
  ? localData.get("lastPokemonId") + 1
  : 1;

const prevButton = document.querySelector("#prev");
if (currentPokemonId > 1) {
  prevButton.classList.remove("hidden");
}

const loadPokemon = async (id) => {
  try {
    const pokemon = await dex.getPokemonByName(id);
    const name = document.querySelector("#name");
    name.innerText = pokemon.name;
    const height = document.querySelector("#height");
    height.innerText = pokemon.height;
    const weight = document.querySelector("#weight");
    weight.innerText = pokemon.weight;
    const idNumber = document.querySelector("#idNumber");
    idNumber.innerText = id;
    const types = document.querySelector("#types");
    types.innerText = pokemon.types[0].type.name;
    pokemon.types.forEach((type, i) => {
      if (i >= 1) {
        types.append(`/${type.type.name}`);
      }
    });
    const sprite = document.querySelector("img");
    sprite.setAttribute("src", `/img/${id}.png`);
    return { name: pokemon.name, id: id };
  } catch (e) {
    console.log(e);
  }
};

let currentPokemon = loadPokemon(currentPokemonId);

const goToNextPokemon = () => {
  localData.set("lastPokemonId", currentPokemonId);
  if (currentPokemonId === 1) {
    prevButton.classList.remove("hidden");
  }
  if (currentPokemonId === 898) {
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

const smash = async () => {
  if (!localData.contains("smashedPokemon", currentPokemon)) {
    localData.push("smashedPokemon", currentPokemon);
  }
  goToNextPokemon();
  currentPokemon = loadPokemon(currentPokemonId);
};

const pass = async () => {
  if (localData.contains("smashedPokemon", currentPokemon)) {
    localData.pull("smashedPokemon", currentPokemon);
  }
  goToNextPokemon();
  currentPokemon = loadPokemon(currentPokemonId);
};

const prev = async () => {
  goToPrevPokemon();
  currentPokemon = loadPokemon(currentPokemonId);
};

const smashButton = document.querySelector("#smash");
const passButton = document.querySelector("#pass");

smashButton.addEventListener("click", smash);
smashButton.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    smash();
  }
});

passButton.addEventListener("click", pass);
passButton.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    pass();
  }
});

prevButton.addEventListener("click", prev);
prevButton.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    prev();
  }
});
