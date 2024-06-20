class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
        this.soundOn = true;
    }

    preload() {
        // Carrega as imagens
        this.load.image('menuBackground', 'assets/Menu/menu.png');
        this.load.image('playButton', 'assets/Menu/playButton3.png');
        this.load.image('exitButton', 'assets/Menu/exitButton2.png');
        this.load.image('logo', 'assets/Menu/celestialclimbciciv2.png');
        this.load.image('cursorMove', 'assets/Menu/cursormove.png');
        this.load.image('cursorClick', 'assets/Menu/cursorclick.png');
        this.load.image('soundOnButton', 'assets/Menu/mute.png');
        this.load.image('soundOffButton', 'assets/Menu/unmute.png');
        this.load.audio('menuMusic', 'assets/Menu/soundtrackmenu.mp3');
        this.load.image('infoButton', 'assets/Menu/info2.png');
        this.load.audio('buttonHover', 'assets/Menu/hoversound.mp3');
        this.load.audio('playSound', 'assets/Menu/clickplaysound.mp3');

        this.load.css('fontCSS', 'assets/fonts/DungeonFont.css');
    }

    create() {

        // Adiciona a trilha sonora do menu
        this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.15 });
        this.menuMusic.play();

        // Adiciona a imagem de fundo
        this.add.image(640, 360, 'menuBackground').setScale(0.25); // Centro da resolução 1280x720

        // Adiciona o logo
        this.add.image(640, 210, 'logo').setScale(0.55);


        // Adiciona o botão de play
        const playButton = this.add.image(640, 460, 'playButton').setInteractive();
        playButton.setScale(0.2);
        playButton.on('pointerdown', () => {
            this.menuMusic.stop();
            this.sound.play('playSound');
            this.cameras.main.fadeOut(1000); // Efeito de fade out durante 500ms
            this.time.delayedCall(1000, () => {
                this.scene.start('Scene1'); // Transição para a cena do jogo após o fade out
            });
        });

        // Adiciona o botão de exit
        const exitButton = this.add.image(640, 540, 'exitButton').setInteractive();
        exitButton.setScale(0.2);
        exitButton.on('pointerdown', () => {
            this.game.destroy(true); // Fecha o jogo
        });

        // Adiciona o botão de som
        this.soundButton = this.add.image(1180, 660, 'soundOnButton').setInteractive();
        this.soundButton.setScale(0.12);
        this.soundButton.on('pointerdown', () => {
            this.toggleSound();
        });

        // Adiciona o botão de informações
        const infoButton = this.add.image(640, 600, 'infoButton').setInteractive();
        infoButton.setScale(1);
        infoButton.on('pointerdown', () => {
            this.showInfoWindow();
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
        playButton.on('pointerover', () => {
            this.playButtonHoverSound();
            this.cursorMove.setVisible(false);
            this.cursorClick.setVisible(true);
        });

        playButton.on('pointerout', () => {
            this.cursorMove.setVisible(true);
            this.cursorClick.setVisible(false);
        });

        exitButton.on('pointerover', () => {
            this.playButtonHoverSound();
            this.cursorMove.setVisible(false);
            this.cursorClick.setVisible(true);
        });

        exitButton.on('pointerout', () => {
            this.cursorMove.setVisible(true);
            this.cursorClick.setVisible(false);
        });

        this.soundButton.on('pointerover', () => {
            this.playButtonHoverSound();
            this.cursorMove.setVisible(false);
            this.cursorClick.setVisible(true);
        });

        this.soundButton.on('pointerout', () => {
            this.cursorMove.setVisible(true);
            this.cursorClick.setVisible(false);
        });

        infoButton.on('pointerover', () => {
            this.playButtonHoverSound();
            this.cursorMove.setVisible(false);
            this.cursorClick.setVisible(true);
        });

        infoButton.on('pointerout', () => {
            this.cursorMove.setVisible(true);
            this.cursorClick.setVisible(false);
        });

    }

    toggleSound() {
        if (this.soundOn) {
            this.menuMusic.pause(); // Pausa a trilha sonora
            this.soundButton.setTexture('soundOffButton'); // Alterna para o botão de som desligado
        } else {
            this.menuMusic.resume(); // Retoma a trilha sonora
            this.soundButton.setTexture('soundOnButton'); // Alterna para o botão de som ligado
        }
        this.soundOn = !this.soundOn; // Inverte o estado do som
    }

    playButtonHoverSound() {
        // Efeito sonoro de hover nos botões
        this.sound.play('buttonHover', { volume: 0.3 });
    }
    
    showInfoWindow() {
        // Cria a janela de informações
        const infoWindow = this.add.graphics().setDepth(1); // Define profundidade para 1 (à frente dos outros objetos)
        infoWindow.fillStyle(0x000000, 0.8); // Preto com 80% de opacidade
        infoWindow.fillRect(200, 100, 880, 520); // Posiciona e dimensiona a janela
    
        // Adiciona texto à janela de informações
        const infoText = this.add.text(240, 120, 
            'Bem-vindo ao Celestial Climb!\n\nObjetivo do jogo:\n- Colete todos os diamantes possíveis enquanto se desvia dos obstáculos. Irá então ser desbloqueada uma chave que será necessária para passar para a próxima fase!.\n\nControles:\n- Use as letras "WASD" do teclado para mover seu personagem.\n- Pressione ESPAÇO para pular.\n- Pressione SHIFT para usar o dash.\n- Também é possível usar mecânicas de WallClimb\n\nBoa sorte e divirta-se!', 
            { fontFamily: 'DungeonFont', fontSize: '24px', fill: '#ffffff', wordWrap: { width: 800 } }
        ).setDepth(2); // Texto tem profundidade maior para estar à frente da janela

        // Ajusta o espaçamento entre as linhas
        infoText.setLineSpacing(10); // Define o espaçamento entre linhas para 10 pixels
    
        // Adiciona o botão de fechar
        const closeButton = this.add.text(1000, 120, 'X', 
            { fontFamily: 'DungeonFont', fontSize: '50px', fill: '#ff0000' }
        ).setInteractive().setDepth(2); // Botão de fechar também tem profundidade maior
    
        closeButton.on('pointerdown', () => {
            this.cursorMove.setVisible(true);
            this.cursorClick.setVisible(false);
            infoWindow.destroy();
            infoText.destroy();
            closeButton.destroy();
        });
    
        closeButton.on('pointerover', () => {
            this.cursorMove.setVisible(false);
            this.cursorClick.setVisible(true);
            this.playButtonHoverSound();
        });

        closeButton.on('pointerout', () => {
            this.cursorMove.setVisible(true);
            this.cursorClick.setVisible(false);
        });
    
        // Ajusta a profundidade do cursor para garantir que ele esteja à frente da janela de informações
        this.cursorMove.setDepth(3); // Define profundidade alta para o cursor move
        this.cursorClick.setDepth(3); // Define profundidade alta para o cursor click
    }
    
}
