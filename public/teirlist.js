const localData = localDataStorage("smash");

const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", () => {
  localData.clear();
  window.location.href = "/";
});

const smashedPokemon = localData.get("smashedPokemon");
const smashedIds = smashedPokemon.map((pokemon) => pokemon.id);

const sSlot = document.querySelector("#s");
const aSlot = document.querySelector("#a");
const bSlot = document.querySelector("#b");
const cSlot = document.querySelector("#c");
const dSlot = document.querySelector("#d");
const unrankedSlot = document.querySelector("#unranked");

populate();

const saveButton = document.querySelector("#save");
const dialog = document.querySelector("dialog");
saveButton.addEventListener("click", () => dialog.showModal());
const tierList = document.querySelector(".tier-grid");
html2canvas(tierList).then((canvas) => dialog.append(canvas));
const closeButton = document.createElement("button");
closeButton.innerText = "Close";
dialog.append(closeButton);
closeButton.addEventListener("click", () => dialog.close());

const drake = dragula([sSlot, aSlot, bSlot, cSlot, dSlot, unrankedSlot], {
  revertOnSpill: true,
  direction: "horizontal",
});

drake.on(drop, (el, target, source, sibling) => {
  const pokemonId = parseInt(el.getAttribute("data-id"));
  const siblingId = parseInt(sibling.getAttribute("data-id"));
  const targetRank = target.id;
  const sourceSlot = source.id;
  if (sourceSlot !== "unranked" && localData.contains(sourceSlot, pokemonId)) {
    localData.pull(sourceSlot, pokemonId, true);
  }
  if (localData.haskey(targetRank) && siblingId) {
    const siblingIndex = localData.where(targetRank, siblingId);
    if (siblingIndex) {
      localData.push(targetRank, pokemonId, siblingIndex);
      return;
    }
  }
  localData.push(targetRank, pokemonId);
});

function populate() {
  if (!localData.haskey("smashedPokemon")) {
    const intro = document.querySelector(".intro");
    intro.innerHTML =
      "<p>You haven't smashed any Pokemon yet.</p><a href='/'>Return to the start to get smashing!</a>";
    return;
  }

  const smashNumber = document.querySelector("#smash-number");
  const smashPercent = document.querySelector("#smash-percent");
  smashNumber.innerText = `${smashedPokemon.length}`;
  smashPercent.innerText = `${Math.round(
    (smashedPokemon.length / 1008) * 100
  )}`;

  const s = localData.haskey("s") ? localData.get("s") : [];
  const a = localData.haskey("a") ? localData.get("a") : [];
  const b = localData.haskey("b") ? localData.get("b") : [];
  const c = localData.haskey("c") ? localData.get("c") : [];
  const d = localData.haskey("d") ? localData.get("d") : [];
  const ranked = [...s, ...a, ...b, ...c, ...d];
  const unranked = smashedIds.filter((pokemonId) => {
    return !ranked.includes(pokemonId);
  });

  buildTier(s, "s", sSlot);
  buildTier(a, "a", aSlot);
  buildTier(b, "b", bSlot);
  buildTier(c, "c", cSlot);
  buildTier(d, "d", dSlot);
  buildTier(unranked, "unranked", unrankedSlot);
}

const buildTier = (tier, tierName, slot) => {
  if (!tier.length) {
    return;
  }
  for (const pokemonId of tier) {
    if (!smashedIds.includes(pokemonId)) {
      if (tierName !== "unranked") {
        localData.pull(tierName, pokemonId, true);
      }
      continue;
    }
    const sprite = document.createElement("img");
    sprite.setAttribute("src", `/img/${pokemonId}.png`);
    sprite.setAttribute("alt", getName(pokemonId));
    sprite.setAttribute("data-id", `${pokemonId}`);
    sprite.classList.add("sprite");
    slot.appendChild(sprite);
  }
};

const getName = (pokemonId) => {
  for (const pokemon of smashedPokemon) {
    if (pokemon.id === pokemonId) {
      return pokemon.name;
    }
  }
};
