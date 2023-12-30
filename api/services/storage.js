
class StorageService {
  constructor() {
    this.storage = {};
  }

  get(key) {
    return this.storage[key];
  }

  set(key, value) {
    this.storage[key] = value;
  }
}

games = new StorageService();
players = new StorageService();

module.exports = {
    games,
    players
}