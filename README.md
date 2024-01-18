# psop-tierlist-generator

Markiplier made a video and I needed to make a website.

Is this website a joke? Yes. Is it fully functional? Also yes.

## Technology

This app interfaces with the [PokeAPI](https://pokeapi.co/) to let users curate a list of sprites, and then imploys CSS Grid and [Dragula](https://github.com/bevacqua/dragula) to let them drag and drop the sprites to create a tierlist. 

The finished tierlist can then be saved as an image using [html2canvas](https://github.com/niklasvh/html2canvas) for sharing, with auto-generated alt text also provided.

The user's progress is saved in local storage to allow for multiple sessions, with clear options for deleting this data should the user prefer.
