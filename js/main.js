var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        }
    },
    scene: [Menu, Scene1, PauseScene, VictoryScene],
    input: {
        mouse: {
            target: window
        }
    }
};

var game = new Phaser.Game(config);