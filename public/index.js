const localData = localDataStorage("smash");

if (localData.haskey("lastPokemonId")) {
  const startButton = document.querySelector(".button");
  const buttonGroup = document.querySelector(".button-wrapper");

  const p = document.createElement("p");
  const resetButton = document.createElement("button");
  resetButton.innerText = "Clear Data and Start Fresh";

  if (localData.get("lastPokemonId") < 1008) {
    p.innerText = "Looks like you've already have a smash list going!";
    startButton.innerText = "Continue Smashing";
  }

  if (localData.get("lastPokemonId") === 1008) {
    p.innerText =
      "Looks like you've already have a tierlist built or in progress!";
    startButton.innerText = "Skip to Tierlist";
    startButton.setAttribute("href", "/tierlist.html");
  }

  buttonGroup.before(p);
  startButton.after("Or", resetButton);
  resetButton.addEventListener("click", () => {
    localData.clear();
    location.reload();
  });
}
