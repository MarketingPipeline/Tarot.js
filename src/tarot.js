/**
 * Custom errors for Tarot operations
 * @extends Error
 */
class TarotError extends Error {}

/**
 * Error thrown when deck is not initialized
 * @extends TarotError
 */
class DeckNotInitializedError extends TarotError {}

/**
 * Error thrown when a requested spread is not found
 * @extends TarotError
 */
class SpreadNotFoundError extends TarotError {}

/**
 * Error thrown when an invalid card object is provided
 * @extends TarotError
 */
class InvalidCardError extends TarotError {}

/**
 * Error thrown when a spread configuration is invalid
 * @extends TarotError
 */
class InvalidSpreadError extends TarotError {}

/**
 * Shuffle an array immutably
 * @template T
 * @param {T[]} arr - Array to shuffle
 * @returns {T[]} New shuffled array
 */
const shuffleArray = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/**
 * Validate that a value is a non-empty string
 * @param {string} value - Value to validate
 * @param {string} name - Name of the variable for error messages
 * @throws {Error} Throws if value is not a non-empty string
 */
const validateNonEmptyString = (value, name) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${name} must be a non-empty string`);
  }
};

/**
 * Validate that a value is a non-empty array
 * @template T
 * @param {T[]} arr - Array to validate
 * @param {string} name - Name of the variable for error messages
 * @throws {Error} Throws if arr is not a non-empty array
 */
const validateNonEmptyArray = (arr, name) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error(`${name} must be a non-empty array`);
  }
};

/**
 * Class representing a Tarot deck and reading system
 */
class Tarot {
  /**
   * Create a Tarot instance
   */
  constructor() {
    /** @type {Object[]} */
    this.deck = [];
    /** @type {Object[]} */
    this.currentSpread = [];
    /** @type {Map<string, {positions: string[], description: string|null, cardCount: number}>} */
    this.customSpreads = new Map();
    /** @type {boolean} */
    this.isInitialized = false;
  }

  /**
   * Initialize the deck with cards
   * @param {Object[]} cards - Array of TarotCard-like objects
   * @returns {Object[]} The initialized deck
   * @throws {InvalidCardError} Throws if any card is not a valid object
   */
  initializeDeck(cards) {
    validateNonEmptyArray(cards, "Cards");

    const frozenCards = cards.map((card, index) => {
      if (typeof card !== "object" || Array.isArray(card)) {
        throw new InvalidCardError(
          `Item at index ${index} is not a valid TarotCard object`
        );
      }
      return Object.freeze({ ...card }); // freeze each card
    });

    this.deck = Object.freeze(frozenCards); // frozen array
    this.isInitialized = true;

    // return a frozen copy to prevent external push
    return Object.freeze([...this.deck]);
  }

  /**
   * Ensure the deck has been initialized
   * @throws {DeckNotInitializedError} Throws if deck is not initialized
   */
  validateDeckInitialized() {
    if (!this.isInitialized || this.deck.length === 0) {
      throw new DeckNotInitializedError(
        "Deck not initialized. Call initializeDeck() first"
      );
    }
  }

  /**
   * Ensure a custom spread exists
   * @param {string} name - Spread name
   * @throws {SpreadNotFoundError} Throws if spread does not exist
   */
  validateSpreadExists(name) {
    if (!this.customSpreads.has(name)) {
      throw new SpreadNotFoundError(
        `Spread "${name}" not found. Add it using addSpread() first`
      );
    }
  }

  /**
   * Add a custom spread configuration
   * @param {string} name - Spread name
   * @param {Object} options - Spread options
   * @param {string[]} options.positions - Array of position names
   * @param {string|null} [options.description=null] - Optional description
   * @returns {Object} The spread configuration added
   */
  addSpread(name, { positions, description = null }) {
    validateNonEmptyString(name, "Spread name");
    validateNonEmptyArray(positions, "Positions");
    positions.forEach((pos, i) => validateNonEmptyString(pos, `Position ${i}`));

    const spreadConfig = {
      positions,
      description,
      cardCount: positions.length
    };
    this.customSpreads.set(name, spreadConfig);
    return { ...spreadConfig };
  }

  /**
   * Remove a custom spread
   * @param {string} name - Spread name
   */
  removeSpread(name) {
    this.validateSpreadExists(name);
    this.customSpreads.delete(name);
  }

  /**
   * Get information about a spread
   * @param {string} name - Spread name
   * @returns {{positions: string[], description: string|null, cardCount: number}}
   */
  getSpreadInfo(name) {
    this.validateSpreadExists(name);
    return { ...this.customSpreads.get(name) };
  }

  /**
   * List all spread names
   * @returns {string[]} Array of spread names
   */
  listSpreads() {
    return Array.from(this.customSpreads.keys());
  }

  /**
   * Draw random cards from the deck
   * @param {number} count - Number of cards to draw
   * @returns {Object[]} Array of cards
   * @throws {TarotError} Throws if count exceeds deck size
   */
  drawCards(count) {
    this.validateDeckInitialized();

    if (count > this.deck.length) {
      throw new TarotError(
        `Cannot draw ${count} cards. Only ${this.deck.length} cards available`
      );
    }

    return shuffleArray(this.deck).slice(0, count);
  }

  /**
   * Map cards to spread positions
   * @param {string[]} positions - Array of position names
   * @param {Object[]} cards - Array of cards
   * @returns {Array<{position: string, card: Object}>} Spread mapping
   */
  mapCardsToSpread(positions, cards) {
    return positions.map((position, index) => ({
      position,
      card: cards[index]
    }));
  }

  /**
   * Perform a Tarot reading
   * @param {string} spreadName - Name of the spread
   * @returns {Array<{position: string, card: Object}>} Current spread mapping
   */
  doReading(spreadName) {
    this.validateDeckInitialized();
    this.validateSpreadExists(spreadName);

    const spread = this.customSpreads.get(spreadName);
    const cards = this.drawCards(spread.cardCount);
    this.currentSpread = this.mapCardsToSpread(spread.positions, cards);
    return [...this.currentSpread];
  }

  /**
   * Get the current spread
   * @returns {Array<{position: string, card: Object}>} Current spread mapping
   */
  getCurrentSpread() {
    return [...this.currentSpread];
  }

  /**
   * Shuffle the deck
   */
  shuffleDeck() {
    this.validateDeckInitialized();
    this.deck = shuffleArray(this.deck);
  }

  /**
   * Get deck information
   * @returns {{cardCount: number, cards: Object[]}} Deck summary
   */
  getDeckInfo() {
    this.validateDeckInitialized();
    return {
      cardCount: this.deck.length,
      cards: [...this.deck]
    };
  }
}

// Export as default
export default Tarot;
