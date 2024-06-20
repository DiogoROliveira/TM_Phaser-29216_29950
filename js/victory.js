class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    preload() {
        // Carrega a imagem de tela de vitória
        this.load.image('victoryScreen', 'assets/Screens/winscreen.png');
    }

    create() {
        // Adiciona a imagem de tela de vitória
        const victoryImage = this.add.image(640, 360, 'victoryScreen').setOrigin(0.5);

        // Redimensiona a imagem para ajustar à tela de 1280x720
        victoryImage.setScale(1280 / victoryImage.width, 720 / victoryImage.height);

        // Adiciona um evento de clique para voltar ao menu inicial
        this.input.on('pointerdown', () => {
            // Primeiro, pare a cena de vitória
            this.scene.stop('VictoryScene');
            
            // Em seguida, inicie a cena do Menu
            this.scene.start('Menu');
        });
    }
    shutdown() {
        // Limpar qualquer recurso residual ao encerrar a cena de vitória
        // Por exemplo, remover event listeners, objetos de cena, etc.
    }
}
