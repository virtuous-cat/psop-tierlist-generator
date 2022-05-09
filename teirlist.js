const localData = localDataStorage("smash");

populate();

function populate() {
  if (!localData.haskey("smashedPokemon")) {
    const intro = document.querySelector(".intro");
    intro.innerHTML =
      "<p>You haven't smashed any Pokemon yet.</p><a href='/'>Return to the start to get smashing!</a>";
    return;
  }
  const smashedPokemon = localData.get("smashedPokemon");

  const smashNumber = document.querySelector("#smash-number");
  const smashPercent = document.querySelector("#smash-percent");
  smashNumber.innerText = `${smashedPokemon.length}`;
  smashPercent.innerText = `${Math.round((smashedPokemon.length / 898) * 100)}`;

  const s = localData.haskey("s") ? localData.get("s") : [];
  const a = localData.haskey("a") ? localData.get("a") : [];
  const b = localData.haskey("b") ? localData.get("b") : [];
  const c = localData.haskey("c") ? localData.get("c") : [];
  const d = localData.haskey("d") ? localData.get("d") : [];
  const ranked = [...s, ...a, ...b, ...c, ...d];
  const unranked = smashedPokemon.filter((pokemon) => {
    return !ranked.includes(pokemon);
  });

  const sSlot = document.querySelector("#s-slot");
  const aSlot = document.querySelector("#a-slot");
  const bSlot = document.querySelector("#b-slot");
  const cSlot = document.querySelector("#c-slot");
  const dSlot = document.querySelector("#d-slot");
  const unrankedSlot = document.querySelector("#unranked-slot");

  buildTier(s, sSlot);
  buildTier(a, aSlot);
  buildTier(b, bSlot);
  buildTier(c, cSlot);
  buildTier(d, dSlot);
  buildTier(unranked, unrankedSlot);
}

const buildTier = (tier, slot) => {
  if (!tier.length) {
    return;
  }
  for (const pokemon of tier) {
    const sprite = document.createElement("img");
    sprite.setAttribute("src", `/img/${pokemon.id}.png`);
    sprite.setAttribute("alt", pokemon.name);
    sprite.setAttribute("data-id", `${pokemon.id}`);
    slot.appendChild(sprite);
  }
};
