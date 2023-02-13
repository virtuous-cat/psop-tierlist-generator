const localData = localDataStorage("smash");

const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", () => {
  localData.clear();
  window.location.href = "/";
});

const intro = document.querySelector(".intro");

if (!localData.haskey("smashedPokemon")) {
  intro.innerHTML =
    "<p>You haven't smashed any Pokemon yet.</p><a href='/'>Return to the start to get smashing!</a>";
}

const smashedPokemon = localData.haskey("smashedPokemon")
  ? localData.get("smashedPokemon")
  : [];
const smashedIds = smashedPokemon.map((pokemon) => pokemon.id);

const sSlot = document.querySelector("#s");
const aSlot = document.querySelector("#a");
const bSlot = document.querySelector("#b");
const cSlot = document.querySelector("#c");
const dSlot = document.querySelector("#d");
const unrankedSlot = document.querySelector("#unranked");

const saveButton = document.querySelector("#save");
const dialog = document.querySelector("dialog");
saveButton.addEventListener("click", () => {
  dialog.showModal();
  const tierList = document.querySelector(".to-save");
  const canvasHook = document.querySelector(".canvas-hook");
  const attribution = document.querySelector(".attribution");
  const imgDescription = document.querySelector(".description");
  const sList = listTier("s");
  const aList = listTier("a");
  const bList = listTier("b");
  const cList = listTier("c");
  const dList = listTier("d");
  imgDescription.append(sList, aList, bList, cList, dList);
  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.classList.add("secondary-bttn", "neutral");
  dialog.append(closeButton);
  attribution.classList.remove("hidden");
  html2canvas(tierList, {
    ignoreElements: (element) => element.id === "ignore",
    width: 1000,
    windowWidth: 1400,
  }).then((canvas) => {
    canvasHook.after(canvas);
    attribution.classList.add("hidden");
    dialog.addEventListener(
      "close",
      () => {
        canvas.remove();
      },
      { once: true }
    );
  });
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
  dialog.addEventListener(
    "close",
    () => {
      closeButton.remove();
      sList.remove();
      aList.remove();
      bList.remove();
      cList.remove();
      dList.remove();
    },
    { once: true }
  );
});

const drake = dragula([sSlot, aSlot, bSlot, cSlot, dSlot, unrankedSlot], {
  revertOnSpill: true,
  direction: "horizontal",
});

drake.on("drop", (el, target, source, sibling) => {
  const pokemonId = parseInt(el.getAttribute("data-id"));
  const siblingId = sibling ? parseInt(sibling.getAttribute("data-id")) : null;
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

const getName = (pokemonId) => {
  for (const pokemon of smashedPokemon) {
    if (pokemon.id === pokemonId) {
      return pokemon.name;
    }
  }
};

const listTier = (tier) => {
  const p = document.createElement("p");
  if (!localData.haskey(tier) || localData.get(tier).length < 1) {
    p.innerText = `${tier.toUpperCase()} tier: Empty.`;
    return p;
  }
  tierArray = localData.get(tier);
  p.innerText = `${tier.toUpperCase()} tier: ${tierArray.reduce(
    (list, pokemonId, currentIndex) => {
      if (currentIndex === tierArray.length - 1) {
        return list.concat(`${getName(pokemonId)}`);
      }
      return list.concat(`${getName(pokemonId)}, `);
    },
    ""
  )}.`;
  return p;
};

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

function populate() {
  if (!smashedPokemon.length || !smashedIds.length) {
    return;
  }
  const smashNumber = document.querySelectorAll(".smash-number");
  const smashPercent = document.querySelectorAll(".smash-percent");
  smashNumber.forEach((span) => (span.innerText = `${smashedPokemon.length}`));
  smashPercent.forEach(
    (span) =>
      (span.innerText = `${Math.round((smashedPokemon.length / 1008) * 100)}`)
  );
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

populate();
