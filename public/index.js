const localData = localDataStorage("smash");

if (localData.haskey("lastPokemonId")) {
  const startButton = document.querySelector(".button");
  const p = document.querySelector("#button-intro");

  const resetButton = document.createElement("button");
  resetButton.innerText = "Clear Data and Start Fresh";
  resetButton.classList.add("pass", "large");

  if (localData.get("lastPokemonId") < 1008) {
    p.innerText = "Looks like you've already have a smash list going!";
    startButton.innerText = "Continue Smashing";
  }

  if (localData.get("lastPokemonId") >= 1008) {
    p.innerText =
      "Looks like you've already have a tier list built or in progress!";
    startButton.innerText = "Go to Tier List";
    startButton.setAttribute("href", "/tierlist.html");
  }

  startButton.after(resetButton);
  resetButton.addEventListener("click", () => {
    localData.clear();
    location.reload();
  });
}
