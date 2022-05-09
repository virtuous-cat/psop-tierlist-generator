const localData = localDataStorage("smash");

if (localData.haskey("lastPokemonId")) {
  const startButton = document.querySelector(".button");
  const buttonGroup = document.querySelector(".button-wrapper");

  const p = document.createElement("p");
  const resetButton = document.createElement("a");
  resetButton.innerText = "Start Fresh";
  resetButton.setAttribute("href", "/smash.html");

  if (localData.get("lastPokemonId") < 898) {
    p.innerText = "Looks like you've already have a smash list going!";
    startButton.innerText = "Continue Smashing";
  }

  if (localData.get("lastPokemonId") === 898) {
    p.innerText =
      "Looks like you've already have a tierlist built or in progress!";
    startButton.innerText = "Skip to Tierlist";
    startButton.setAttribute("href", "/tierlist.html");
  }

  buttonGroup.before(p);
  startButton.after("Or", resetButton);
  resetButton.addEventListener("click", () => {
    localData.remove("lastPokemonId");
    localData.remove("smashedPokemon");
  });
  resetButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      localData.remove("lastPokemonId");
      localData.remove("smashedPokemon");
    }
  });
}
