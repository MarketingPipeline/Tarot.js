# [Tarot.js](https://github.com/MarketingPipeline/Tarot.js/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/MarketingPipeline/Tarot.js/blob/main/LICENSE) [![Current version](https://img.shields.io/github/package-json/v/MarketingPipeline/Tarot.js.svg?style=flat)](https://github.com/MarketingPipeline/Tarot.js/releases)  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/MarketingPipeline/Tarot.js/blob/main/README.md#contributing-)


**[Live Demo](https://marketingpipeline.github.io/Tarot.js/)** | **[Getting Started](https://github.com/MarketingPipeline/Tarot.js/wiki/1.-Getting-Started)** | **[Documentation](https://github.com/MarketingPipeline/Tarot.js/wiki)** | **[GitHub](https://github.com/MarketingPipeline/Tarot.js/)**

**Tarot.js** is a powerful and customizable JavaScript library for creating and managing Tarot card decks, custom spreads, and readings. Whether you're a Tarot enthusiast or a developer looking to integrate Tarot readings into your application, Tarot.js offers a flexible toolkit to enhance your experience.


## Features <img height="20px" src="https://user-images.githubusercontent.com/86180097/196882869-d38fe649-8e33-44fe-ae91-b1f9cd5f1c3e.png">

- **Deck Management**: Easily draw, shuffle, and get details about your Tarot deck.
- **Custom Spreads**: Create and manage unique Tarot spreads tailored to your needs.
- **Readings**: Perform readings using your custom spreads, drawing the specified number of cards for each position.
- **Current Spread Tracking**: View the most recent spread and cards drawn for a convenient reference.
- **Detailed Deck Information**: Retrieve full deck details, including card counts and each card’s metadata.


## Example and usage

You can view a demo of Tarot.js in use [here](https://marketingpipeline.github.io/Tarot.js/).

How to use **_Tarot.js_**:

```javascript
import Tarot from "https://esm.sh/gh/MarketingPipeline/Tarot.js";
// Load a existing tarot deck via ES6 assert import or via fetch etc... 
import englishDeck from "https://esm.sh/gh/MarketingPipeline/Tarot.js/decks/en/default.json" assert { type: "json" }; 

// Initialize a Tarot instance and deck
const tarot = new Tarot.Tarot();
tarot.initializeDeck(englishDeck);

// Access current deck and spread information
console.log(tarot.getDeckInfo());

// Add a spread (e.g., Past, Present, Future)
tarot.addSpread('Three-Card Spread', {
  positions: ['Past', 'Present', 'Future'],
  description: 'Insight into past, present, and future aspects.'
});

// Perform a reading using the spread
console.log(tarot.doReading("Three-Card Spread"));

// Make your own deck
const your_own_custom_deck = tarot.initializeDeck([
  {
    name: "The Fool",
    meaning: "New beginnings, innocence",
    whatever_key_names_you_want: "l33t"
  },
  {
    name: "The Coder",
    meaning: "Tired, broke, curious",
    whatever_values_you_want: ["dope"]
  }
  /* Add more card objects as needed. 
     Note: Objects must be same length or greater as your positions in your spread.
   */
]);

// Add your custom spread
tarot.addSpread("shakespeare", {
  positions: ["To be", "Not to be"],
  description: "Random example spread"
});

console.log(tarot.doReading("shakespeare"));

// View the most recent spread and cards drawn
console.log(tarot.getCurrentSpread());
```

For more advanced usage you can find the Tarot.js documentation [here](https://github.com/MarketingPipeline/Tarot.js/wiki).  

## Contributing [![GitHub contributors](https://badgen.net/github/contributors/MarketingPipeline/Tarot.js)](https://github.com/MarketingPipeline/Tarot.js/graphs/contributors/)

Contributions are welcome! Feel free to submit issues, suggest features, or create pull requests to improve Tarot.js.

See also the list of
[contributors](https://github.com/MarketingPipeline/Tarot.js/graphs/contributors) who
participate in this project.

## License   [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/MarketingPipeline/Tarot.js/blob/main/LICENSE)

This project is licensed under the MIT License - see the
[LICENSE](https://github.com/MarketingPipeline/Tarot.js/blob/main/LICENSE) file for details.
