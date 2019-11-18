var gameMessenger = {
  gameOverMessageSent: false,
  gameOver: false,
  shouldRefreshWindow: false,
  showEndCard: false,
  playerWon: undefined,
  onRestart: undefined,
  init: function(config) {
    if (typeof config === 'object') {
      this.shouldRefreshWindow = (config.shouldRefreshWindow) ? config.shouldRefreshWindow : false;
      this.showEndCard = (config.showEndCard) ? config.showEndCard : false;
      this.onRestart = (config.onRestart) ? config.onRestart : false;

      if (config.blockedKeyCodes) {
        this.sendMessage({blockedKeyCodes: config.blockedKeyCodes});
      }

      if (config.type !== 'cgi') console.log("game initialized");

      if (config.type === 'cgi') {
        window.addEventListener("click", this.handleCgiClick, false);
      }
    }
    window.addEventListener("message", this.receiveMessage, false);
  },
  gameEnd: function(details) {
    console.log("gameEnd", details);
    this.gameOver = true;
    if (details && typeof details.playerWon !== 'undefined') {
      this.playerWon = details.playerWon;
    }
      var message = {
        gameOver: this.gameOver,
        playerWon: this.playerWon,
        showEndCard: this.showEndCard,
        gameOverMessageSent: this.gameOverMessageSent
      }
      if (!this.gameOverMessageSent) {
        this.sendMessage(message);
        this.gameOverMessageSent = true;
      }
  },
  gameRestart: function() {
    console.log("gameRestart");
    this.gameOver = false;
    this.gameOverMessageSent = false;
    this.playerWon = undefined;
    this.sendMessage({ gameRestarted: true });
  },
  handleCgiClick: function(e) {
    var el = e.target;
    if ((el.tagName === "INPUT" && el.type === "submit") ||
      el.tagName === "A") {
      gameMessenger.sendMessage({
        refreshAds: true
      });
    }
  },
  sendMessage: function(message) {
    console.log('sending message', message)
    window.parent.postMessage(message, '*');
  },
  receiveMessage: function(e) {
    var gm = window.fbGameMessenger;
    // We should do something meaningful eventually.
    if (e.data.keyCode && window.game_obj && window.game_obj.this) {
      if (e.data.eventType === 'keydown') {
        window.game_obj.this.keydown({'keyCode': e.data.keyCode})
      }
      if (e.data.eventType === 'keyup') {
        window.game_obj.this.keyup({'keyCode': e.data.keyCode})
      }
    }

    if (e.data.restartGame && typeof gm.onRestart === 'function') {
      gm.onRestart();
    }
  },
  refreshWindow: function() {
    window.location.reload()
  }
}

window.fbGameMessenger = gameMessenger;
