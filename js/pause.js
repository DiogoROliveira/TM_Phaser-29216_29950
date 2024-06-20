class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    preload() {
        // Carregar as imagens
        this.load.image('menupause', 'assets/PauseMenu/menupause.png');
        this.load.image('continuebutton', 'assets/PauseMenu/continuebutton.png');
        this.load.image('restartbutton', 'assets/PauseMenu/restartbutton.png');
        this.load.image('exitbutton', 'assets/PauseMenu/exitbutton.png');
        this.load.image('gem', 'assets/PauseMenu/gemapausemenu.png');

        this.load.image('cursorMove', 'assets/Menu/cursormove.png');
        this.load.image('cursorClick', 'assets/Menu/cursorclick.png');
    }

    create() {
        // Adicionar o fundo do menu de pausa
        let menuPauseImage = this.add.image(640, 360, 'menupause');
        menuPauseImage.setScale(1.5);

        let gemImage = this.add.image(640, 540, 'gem');
        gemImage.setScale(1.2);

        // Adicionar o botão "Resume"
        const resumeButton = this.add.image(640, 330, 'continuebutton').setInteractive().setScale(1.5);
        resumeButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('Scene1');
        });

        // Adicionar o botão "Restart"
        const restartButton = this.add.image(640, 400, 'restartbutton').setInteractive().setScale(1.5);
        restartButton.on('pointerdown', () => {
            this.scene.stop('Scene1');
            this.scene.stop();
            this.scene.start('Scene1');
        });

        // Adicionar o botão "Exit"
        const exitButton = this.add.image(640, 470, 'exitbutton').setInteractive().setScale(1.5);
        exitButton.on('pointerdown', () => {
            this.scene.stop('Scene1');
            this.scene.start('Menu');
        });

        // Hide the default cursor
        this.input.setDefaultCursor('none');

        // Add the custom move cursor image and follow the mouse
        this.cursorMove = this.add.image(0, 0, 'cursorMove').setOrigin(0.5);
        this.cursorClick = this.add.image(0, 0, 'cursorClick').setOrigin(0.5).setVisible(false);

        this.input.on('pointermove', (pointer) => {
            this.cursorMove.x = pointer.x;
            this.cursorMove.y = pointer.y;
            this.cursorClick.x = pointer.x;
            this.cursorClick.y = pointer.y;
        });

        // Change cursor on button hover
        resumeButton.on('pointerover', () => {
            this.cursorMove.setVisible(false);
            this.cursorClick.setVisible(true);
        });

        resumeButton.on('pointerout', () => {
            this.cursorMove.setVisible(true);
            this.cursorClick.setVisible(false);
        });

        resumeButton.on('pointerdown', () => {
            this.cursorClick.setVisible(true);
            this.cursorMove.setVisible(false);
        });

        resumeButton.on('pointerup', () => {
            this.cursorClick.setVisible(false);
            this.cursorMove.setVisible(true);
        });

        restartButton.on('pointerover', () => {
            this.cursorMove.setVisible(false);
            this.cursorClick.setVisible(true);
        });

        restartButton.on('pointerout', () => {
            this.cursorMove.setVisible(true);
            this.cursorClick.setVisible(false);
        });

        restartButton.on('pointerdown', () => {
            this.cursorClick.setVisible(true);
            this.cursorMove.setVisible(false);
        });

        restartButton.on('pointerup', () => {
            this.cursorClick.setVisible(false);
            this.cursorMove.setVisible(true);
        });

        exitButton.on('pointerover', () => {
            this.cursorMove.setVisible(false);
            this.cursorClick.setVisible(true);
        });

        exitButton.on('pointerout', () => {
            this.cursorMove.setVisible(true);
            this.cursorClick.setVisible(false);
        });

        exitButton.on('pointerdown', () => {
            this.cursorClick.setVisible(true);
            this.cursorMove.setVisible(false);
        });

        exitButton.on('pointerup', () => {
            this.cursorClick.setVisible(false);
            this.cursorMove.setVisible(true);
        });

        // Adicionar controles de teclado para fechar o menu de pausa
        this.input.keyboard.on('keydown-P', this.togglePause, this);
        this.input.keyboard.on('keydown-ESC', this.togglePause, this);
    }

    togglePause() {
        this.scene.stop();
        this.scene.resume('Scene1');
    }

    shutdown() {
        // Resetar o cursor do mouse quando a cena de pausa for fechada
        this.input.setDefaultCursor('none');
    }
}
