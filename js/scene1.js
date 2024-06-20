class Scene1 extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'Scene1' });

        // Variáveis de estado do jogador
        this.lastDirection = 'right';
        this.isJumping = false;
        this.dashingPower = 450;
        this.dashingTime = 200; // in milliseconds
        this.dashingCooldown = 1000; // in milliseconds
        this.player = null;
        this.diamonds = null;
        this.canDash = true;
        this.isDashing = false;
        this.totalDiamonds = 5;
        this.diamondCount = 0;
    }

    preload ()
    {
    
    // Backgroud image
    this.load.image('sky', 'assets/origbig.png');

    this.load.image('tiles', 'assets/Mapas/tileset.png');
    this.load.tilemapTiledJSON('fase1atualizada', 'assets/Mapas/fase1atualizada.json');

    // Spikes
    this.load.image('spikecolumn', 'assets/Spikes/spikecolumn.png');

    // Porta de vitoria
    this.load.image('door', 'assets/door.png');

    // Chave de vitoria
    this.load.image('key', 'assets/key.png');

    // Plataforma que cai
    this.load.image('fallingplatform', 'assets/fallingplatform.png');

    // Espinho sobe e desce
    this.load.image('spear', 'assets/trapspike.png');

    // Serra animada
    this.load.spritesheet('saw', 
        'assets/Serra.png', 
        { frameWidth: 32, frameHeight: 32 }
    );

    // Diamonds
    this.load.spritesheet('diamond', 
        'assets/diamond.png', 
        { frameWidth: 32, frameHeight: 32 }
    );

    // Shield PowerUp
    this.load.image('shield', 'assets/shield.png');

    // Correr para a direita
    this.load.spritesheet('PlayerRunRight',
        'assets/Character/RunRight.png',
        { frameWidth: 48, frameHeight: 48 }
    );
    // Correr para a esquerda
    this.load.spritesheet('PlayerRunLeft',
        'assets/Character/RunLeft.png',
        { frameWidth: 48, frameHeight: 48 }
    );
    // Parado virado para a direita
    this.load.spritesheet('PlayerIdleRight',
        'assets/Character/IdleRight.png',
        { frameWidth: 48, frameHeight: 48 }
    );
    // Parado virado para a esquerda
    this.load.spritesheet('PlayerIdleLeft',
        'assets/Character/IdleLeft.png',
        { frameWidth: 48, frameHeight: 48 }
    );
    // Saltar Direita
    this.load.spritesheet('PlayerJumpRight',
        'assets/Character/JumpRight.png',
        { frameWidth: 48, frameHeight: 48 }
    );
    // Saltar Esquerda
    this.load.spritesheet('PlayerJumpLeft',
        'assets/Character/JumpLeft.png',
        { frameWidth: 48, frameHeight: 48 }
    );
    // Queda Direita
    this.load.spritesheet('PlayerFallRight',
        'assets/Character/FallRight.png',
        { frameWidth: 48, frameHeight: 48 }
    );
    // Queda Esquerda
    this.load.spritesheet('PlayerFallLeft',
        'assets/Character/FallLeft.png',
        { frameWidth: 48, frameHeight: 48 }
    );

    this.load.spritesheet('PlayerDash',
        'assets/Character/Dash.png',
        { frameWidth: 112, frameHeight: 56 }
    );

    // SoundEffects
    this.load.audio('walkSound', 'assets/soundeffects/walk.wav');
    this.load.audio('jumpSound', 'assets/soundeffects/jump.wav');
    this.load.audio('fallSound', 'assets/soundeffects/fall.wav');
    this.load.audio('dashSound', 'assets/soundeffects/dash.wav');
    this.load.audio('wallSlideSound', 'assets/soundeffects/wallSlide.wav');
    this.load.audio('diamondCollectSound', 'assets/soundeffects/coin.wav');

    }
    
    create ()
    {
        // Inicializar sound effects
        this.walkSound = this.sound.add('walkSound', { volume: 0.25, rate: 2});
        this.jumpSound = this.sound.add('jumpSound', { volume: 0.25 });
        this.fallSound = this.sound.add('fallSound', { volume: 0.25 });
        this.dashSound = this.sound.add('dashSound', { volume: 0.35 });
        this.wallSlideSound = this.sound.add('wallSlideSound', { volume: 0.25 });
        this.diamondCollectSound = this.sound.add('diamondCollectSound', { volume: 0.25 });

        // Resetar variáveis
        this.diamondCount = 0;
        // Adicionar a imagem do background e ajustá-la ao tamanho da tela
        let background = this.add.image(0, 0, 'sky').setOrigin(0, 0);
        // Calcular a escala necessária para aumentar a imagem background
        let scaleX = this.cameras.main.width / background.width;
        let scaleY = this.cameras.main.height / background.height;
        let scale = Math.max(scaleX, scaleY); // Ajusta a escala para cobrir toda a tela
        // Definir a escala do background
        background.setScale(scale);
        // Certifique-se de que a imagem cubra toda a tela
        background.setScrollFactor(0);

        // Fase1 - mapa
        var map = this.make.tilemap({ key: 'fase1atualizada' });
        var tileset = map.addTilesetImage('tileset', 'tiles');
        const layer = map.createLayer('ground', tileset, 0, 0);
        const layer2 = map.createLayer('fill', tileset, 0, 0);

        layer.setCollisionByProperty({ colides: true });

        // Criar o jogador
        this.player = this.physics.add.sprite(70, 580, 'PlayerIdleRight');
        this.player.setDepth(1); // Definir a profundidade do jogador para evitar o sprite ficar atrás da porta, por exemplo

        // Hitbox do jogador
        this.player.setSize(18, 40);
        this.player.setCollideWorldBounds(true);  
        this.player.setScale(1);

        // Criar o grupo de espinhos e adicionar manualmente
        this.spikecolumn = this.physics.add.staticGroup();

        // Adicionar spikes
        this.spikecolumn.create(180, 685, 'spikecolumn');
        this.spikecolumn.create(220, 685, 'spikecolumn');
        this.spikecolumn.create(260, 685, 'spikecolumn');
        this.spikecolumn.create(300, 685, 'spikecolumn');

        // Segundos espinhos
        this.spikecolumn.create(498, 670, 'spikecolumn').setScale(0.9, 1).refreshBody();
        this.spikecolumn.create(533, 670, 'spikecolumn').setScale(0.9, 1).refreshBody();
        this.spikecolumn.create(569, 670, 'spikecolumn').setScale(0.9, 1).refreshBody();
        this.spikecolumn.create(606, 670, 'spikecolumn').setScale(0.9, 1).refreshBody();

        // Terceiros espinhos
        this.spikecolumn.create(820, 700, 'spikecolumn');
        this.spikecolumn.create(860, 700, 'spikecolumn');
        this.spikecolumn.create(900, 700, 'spikecolumn');
        this.spikecolumn.create(940, 700, 'spikecolumn');

        // Adicionar a serra como um objeto dinâmico
        this.saw = this.physics.add.sprite(650, 450, 'saw');
        this.saw.body.setAllowGravity(false); // Desabilitar a gravidade para a serra
        this.saw.body.immovable = true; // Evitar pisar na serra e ela mover-se
        this.saw.setCollideWorldBounds(true);

        // Criar um tween para mover a serra horizontalmente
        this.tweens.add({
            targets: this.saw,
            x: 800, // Posição final da serra à direita da tela
            duration: 1000, // Duração do movimento
            ease: 'Linear',
            yoyo: true, // Faz a serra retornar à posição inicial
            repeat: -1 // Repete indefinidamente
        });

        // Adicionar as lanças como objetos dinâmicos
        this.spear = this.physics.add.sprite(1030, 620, 'spear');
        this.spear.body.setAllowGravity(false); // Desabilitar a gravidade para a lança
        this.spear.body.immovable = true; // Evitar pisar na lança e ela mover-se
        this.spear.setCollideWorldBounds(true);

        this.spear2 = this.physics.add.sprite(1080, 620, 'spear');
        this.spear2.body.setAllowGravity(false); // Desabilitar a gravidade para a lança
        this.spear2.body.immovable = true; // Evitar pisar na lança e ela mover-se
        this.spear2.setCollideWorldBounds(true);

        // Criar um tween para mover a primeira lança verticalmente
        this.tweens.add({
            targets: this.spear,
            y: 500, // Posição final da lança à direita da tela
            duration: 500, // Duração do movimento
            ease: 'Linear',
            yoyo: true, // Faz a lança retornar à posição inicial
            repeat: -1 // Repete indefinidamente
        });

        // Criar um tween para mover a segunda lança verticalmente
        this.tweens.add({
            targets: this.spear2,
            y: 500, // Posição final da lança à direita da tela
            duration: 500, // Duração do movimento
            ease: 'Linear',
            yoyo: true, // Faz a lança retornar à posição inicial
            repeat: -1 // Repete indefinidamente
        });

        // Porta de vitória
        this.door = this.physics.add.sprite(1250, 495, 'door');
        this.door.setSize(30, 40);
        this.door.body.setAllowGravity(false);
        this.door.body.immovable = true;

        // Chave de vitória
        this.key = this.physics.add.sprite(1265, 300, 'key');
        this.key.setSize(20, 30);
        this.key.body.setAllowGravity(false);
        this.key.body.immovable = true;
        this.key.setVisible(false); // Inicialmente invisível
        this.key.setActive(false); // Inicialmente inativa

        // Adicionar o power-up do escudo
        this.shieldPowerUp = this.physics.add.sprite(660, 140, 'shield');
        this.shieldPowerUp.setScale(0.5);
        this.shieldPowerUp.body.setAllowGravity(false);

        // Adicionar imagem de diamante
        this.diamondIcon = this.add.image(20, 20, 'diamond').setScale(1.2);
        this.diamondIcon.setScrollFactor(0); // Não rola com a câmera

        // Adicionar texto dinâmico para contar os diamantes
        this.diamondCountText = this.add.text(30, 10, ' x 0/' + this.totalDiamonds, { fontSize: '24px', fill: '#fff' });
        this.diamondCountText.setScrollFactor(0); // Não rola com a câmera

        // Criar animação para o diamante, se ainda não estiver criada
        if (!this.anims.exists('diamondAnim')) {
            this.anims.create({
                key: 'diamondAnim',
                frames: this.anims.generateFrameNumbers('diamond', { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1 // Repetir indefinidamente
            });
        }

        // Posições dos diamantes
        var diamondPositions = [
            { x: 170, y: 450 },
            { x: 720, y: 450 },
            { x: 880, y: 620 },
            { x: 80, y: 130 },
            { x: 600, y: 600 }
        ];

        // Array para armazenar os sprites dos diamantes
        this.diamonds = [];

        // Iterar sobre as posições e criar os diamantes
        diamondPositions.forEach(pos => {
            var diamond = this.physics.add.sprite(pos.x, pos.y, 'diamond');
            diamond.body.setAllowGravity(false);
            diamond.body.immovable = true;
            this.diamonds.push(diamond); // Adicionar cada diamante ao array

            // Adicionar a interação de colisão para cada diamante
            this.physics.add.overlap(this.player, diamond, this.collectDiamond, null, this);
            diamond.anims.play('diamondAnim', true); // Iniciar a animação do diamante
        });

        this.fallingPlatforms = this.physics.add.staticGroup(); // Criar grupo de plataformas que caem

        // Array de posições das plataformas
        var platformPositions = [
            { x: 300, y: 180 },
            { x: 400, y: 250 },
            { x: 570, y: 170 }
        ];

        // Criar cada plataforma que cai
        platformPositions.forEach(pos => {
            let platform = this.fallingPlatforms.create(pos.x, pos.y, 'fallingplatform');
            platform.setScale(0.7).refreshBody();
        });
        
        // Colisoes
        this.physics.add.collider(this.player, layer);
        this.physics.add.collider(this.player, this.spikecolumn, this.hitSpike, null, this); // colisão entre o jogador e os espinhos
        this.physics.add.collider(this.player, this.saw, this.hitSaw, null, this);
        this.physics.add.collider(this.player, this.spear, this.hitSpear, null, this);
        this.physics.add.collider(this.player, this.spear2, this.hitSpear, null, this);
        this.physics.add.overlap(this.player, this.shieldPowerUp, this.collectShield, null, this);
        this.physics.add.overlap(this.player, this.door, this.reachDoor, null, this);
        this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);
        this.physics.add.collider(this.player, this.fallingPlatforms, this.onPlatform, null, this);

        createAnimations(this);

        // Create cursors
        this.cursors = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        this.input.keyboard.on('keydown-P', this.togglePause, this);
        this.input.keyboard.on('keydown-ESC', this.togglePause, this);

        // Reinicialização das variáveis do jogador
        this.canDash = true; // Restaurar a capacidade de dash
        this.isDashing = false;
        this.player.hasShield = false; // Reinicializar o escudo do jogador se necessário
        this.saw.anims.play('spin', true); // Iniciar a animação da serra

        // Criar ícone de escudo na interface
        this.shieldIcon = this.add.image(25, 60, 'shield');
        this.shieldIcon.setScale(0.5);
        this.shieldIcon.setScrollFactor(0);
        this.shieldIcon.setDepth(1); // Garante que o ícone apareça acima de tudo na tela
        this.shieldIcon.setVisible(false); // Começa invisível

        this.platformTouched = false;
        this.platformTimeout = null;

    }

    update ()
    {
        var isColliding = this.player.body.blocked.left || this.player.body.blocked.right;
        const isMoving = this.cursors.left.isDown || this.cursors.right.isDown;
        const isOnGround = this.grounded();

        if (this.isDashing) {
            return;
        }

        var horizontal = 0;
        if (this.cursors.left.isDown) {
            horizontal = -1;
        } else if (this.cursors.right.isDown) {
            horizontal = 1;
        }

        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
        
            this.player.anims.play('left', true);
            this.lastDirection = 'left';
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            
            this.player.anims.play('right', true);
            this.lastDirection = 'right';
        }
        else
        {
            this.player.setVelocityX(0);
            if (this.lastDirection === 'left' && this.cursors.right.isUp) {
                this.player.anims.play('idleLeft', true); // Usamos a animação de idle esquerda se a última direção foi para a esquerda e a tecla direita não está pressionada
            } else if (this.lastDirection === 'right' && this.cursors.left.isUp) {
                this.player.anims.play('idleRight', true); // Usamos a animação de idle direita se a última direção foi para a direita e a tecla esquerda não está pressionada
            }
        }

        // Sound Effect para andar
        if (isMoving && isOnGround) {
            if (!this.walkSound.isPlaying) {
                this.walkSound.play();
            }
        } else {
            if (this.walkSound.isPlaying) {
                this.walkSound.stop();
            }
        }

        // Verificar se o jogador estava no ar e agora está no chão para tocar o som de queda
        if (this.wasInAir && isOnGround) {
            this.fallSound.play();
        }
        // Atualizar o estado de `wasInAir`
        this.wasInAir = !isOnGround;
            
        if (this.cursors.space.isDown && this.grounded()) {
            this.player.setVelocityY(-450);
            this.jumpSound.play();
            this.isJumping = true; // Indicando que o jogador está no ar
        }
        
        // Verifica se o jogador está no ar e subindo
        if (this.isJumping && this.player.body.velocity.y < 0 && this.lastDirection === 'right') {
            this.player.anims.play('jumpRight', true);
        } else if (this.isJumping && this.player.body.velocity.y < 0 && this.lastDirection === 'left') {
            this.player.anims.play('jumpLeft', true);
        }

        // Verifica se o jogador está no ar e a descer
        if (this.isJumping && this.player.body.velocity.y >= 0 && this.lastDirection === 'right' && !this.grounded()) {
            this.player.anims.play('fallRight', true);
        } else if (this.isJumping && this.player.body.velocity.y >= 0 && this.lastDirection === 'left' && !this.grounded()) {
            this.player.anims.play('fallLeft', true);
        }

        // Dash
        if (this.cursors.shift.isDown && this.canDash) {
            this.dash(horizontal); // Garantir que o contexto da cena seja passado
            this.dashSound.play();
        }

        // Apply normal movement if not dashing
        if (!this.isDashing) {
            this.player.setVelocityX(horizontal * 160);
        }

        // Lógica para wall slide e wall jump
        if (isColliding && !this.player.body.touching.down) {
            // Verificar se o jogador está deslizando para baixo
            if (this.player.body.velocity.y > 0) {
                // Reproduzir som de wall slide, se não estiver tocando
                if (!this.wallSlideSound.isPlaying) {
                    this.wallSlideSound.play();
                }
            } else {
                // Parar o som de wall slide se não estiver deslizando para baixo
                if (this.wallSlideSound.isPlaying) {
                    this.wallSlideSound.stop();
                }
            }

            // Ajustar a velocidade vertical para o wall slide
            this.player.setVelocityY(Math.min(this.player.body.velocity.y, 100));

            // Verificar se ocorreu um wall jump
            if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
                this.jumpSound.play();
                // Wall jump
                if (this.player.body.blocked.left) {
                    this.player.setVelocityX(160);
                } else if (this.player.body.blocked.right) {
                    this.player.setVelocityX(-160);
                }
                this.player.setVelocityY(-330);

                // Parar o som de wall slide ao realizar o wall jump
                if (this.wallSlideSound.isPlaying) {
                    this.wallSlideSound.stop();
                }
            }
        } else {
            // Parar o som de wall slide se não estiver mais encostado na parede
            if (this.wallSlideSound.isPlaying) {
                this.wallSlideSound.stop();
            }
        }

    }


    dash(horizontal) {
        if (horizontal === 0) {
            return;
        }

        this.canDash = false;
        this.isDashing = true;
        this.player.setGravityY(0); // Disable gravity during dash
        this.player.setVelocity(horizontal * this.dashingPower, 0); // Apply dash velocity

        this.time.delayedCall(this.dashingTime, function() {
            this.isDashing = false;
            this.time.delayedCall(this.dashingCooldown, function() {
                this.canDash = true;
            }, [], this);
        }, [], this);
    }

    grounded() {
        if (this.player.body.touching.down || this.player.body.blocked.down) {
            return true;
        }
        return false;
    }

    hitSpike(player, spikecolumn) {
        if (player.hasShield) {
            player.setPosition(100, 450); // Teleporta o jogador para o início
            player.hasShield = false; // Remove o escudo
            this.shieldIcon.setVisible(false);
        } else {
            this.scene.restart(); // Reinicia a fase
        }
    }

    hitSaw(player, saw) {
        if (player.hasShield) {
            player.setPosition(100, 450); // Teleporta o jogador para o início
            player.hasShield = false; // Remove o escudo
            this.shieldIcon.setVisible(false);
        } else {
            this.scene.restart(); // Reinicia a fase
        }
    }

    hitSpear(player, spear) {
        if (player.hasShield) {
            player.setPosition(100, 450); // Teleporta o jogador para o início
            player.hasShield = false; // Remove o escudo
            this.shieldIcon.setVisible(false);
        } else {
            this.scene.restart(); // Reinicia a fase
        }
    }

    collectShield(player, shieldPowerUp) {
        shieldPowerUp.disableBody(true, true);
        player.hasShield = true;
        this.shieldIcon.setVisible(true);
        console.log('Shield collected!');
    }

    collectKey(player, key) {
        if (key.active) { // Verificar se a chave está ativa
            key.disableBody(true, true); // Remover a chave do mundo
            player.hasKey = true; // Definir que o jogador tem a chave
            console.log('Chave coletada!');
        }
    }

    reachDoor(player, door) {
        if (player.hasKey) {
            console.log('Você coletou a chave e passou de fase!');
            // Parar a cena Scene1
            this.scene.stop('Scene1');
            // Iniciar a cena VictoryScene
            this.scene.start('VictoryScene');
        } else {
            console.log('Você precisa da chave para passar de fase!');
        }
    }

    collectDiamond(player, diamond) {
        this.diamondCollectSound.play();
        diamond.disableBody(true, true); // Remove o diamante do mundo
        this.diamondCount++; // Incrementa o contador de diamantes
    
        // Atualiza o texto do contador de diamantes
        this.diamondCountText.setText(' x ' + this.diamondCount + '/' + this.totalDiamonds);
    
        // Verifica se o jogador coletou todos os diamantes
        if (this.diamondCount === this.totalDiamonds) {
            console.log('Todos os diamantes foram coletados!');
            this.key.setVisible(true);
            this.key.setActive(true);
            // Adicione aqui a lógica para o jogador ter coletado todos os diamantes
        }
    }

    onPlatform(player, platform) {
        if (!platform.isTouched) { // Verifica se a plataforma já foi tocada
            platform.isTouched = true; // Define a plataforma como tocada
    
            // Oculta a plataforma após 500ms
            this.time.delayedCall(500, () => {
                platform.setVisible(false);
                platform.disableBody(true, true);
    
                // Programa a plataforma para voltar ao estado normal após 3 segundos
                this.time.delayedCall(3000, () => {
                    platform.isTouched = false; // Resetar o estado da plataforma
                    platform.setVisible(true); // Torna a plataforma visível novamente
                    platform.enableBody(true, platform.x, platform.y, true, true); // Reativa o corpo da plataforma
                }, [], this);
            }, [], this);
        }
    }

    togglePause() {
        if (this.scene.isPaused('Scene1')) {
            this.input.setDefaultCursor('none'); // Esconder o cursor quando o jogo é retomado
            this.scene.resume();
            this.scene.stop('PauseScene');
        } else {
            this.input.setDefaultCursor('default'); // Mostrar o cursor quando o jogo é pausado
            this.scene.pause();
            this.scene.launch('PauseScene');
        }
    }



}

function createAnimations(scene){

    if (!scene.anims.exists('left')) {
        scene.anims.create({ key: 'left', frames: scene.anims.generateFrameNumbers('PlayerRunLeft', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    }
    if (!scene.anims.exists('idleRight')) {
        scene.anims.create({ key: 'idleRight', frames: scene.anims.generateFrameNumbers('PlayerIdleRight', { start: 0, end: 11 }), frameRate: 18, repeat: -1 });
    }
    if (!scene.anims.exists('idleLeft')) {
        scene.anims.create({ key: 'idleLeft', frames: scene.anims.generateFrameNumbers('PlayerIdleLeft', { start: 0, end: 11 }), frameRate: 18, repeat: -1 });
    }
    if (!scene.anims.exists('right')) {
        scene.anims.create({ key: 'right', frames: scene.anims.generateFrameNumbers('PlayerRunRight', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    }
    if (!scene.anims.exists('jumpRight')) {
        scene.anims.create({ key: 'jumpRight', frames: scene.anims.generateFrameNumbers('PlayerJumpRight', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    }
    if (!scene.anims.exists('jumpLeft')) {
        scene.anims.create({ key: 'jumpLeft', frames: scene.anims.generateFrameNumbers('PlayerJumpLeft', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    }
    if (!scene.anims.exists('fallRight')) {
        scene.anims.create({ key: 'fallRight', frames: scene.anims.generateFrameNumbers('PlayerFallRight', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    }
    if (!scene.anims.exists('fallLeft')) {
        scene.anims.create({ key: 'fallLeft', frames: scene.anims.generateFrameNumbers('PlayerFallLeft', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    }
    if (!scene.anims.exists('dashRight')) {
        scene.anims.create({ key: 'dashRight', frames: scene.anims.generateFrameNumbers('PlayerDash', { start: 0, end: 4 }), frameRate: 10, repeat: -1 });
    }
    if (!scene.anims.exists('dashLeft')) {
        scene.anims.create({ key: 'dashLeft', frames: scene.anims.generateFrameNumbers('PlayerDash', { start: 8, end: 5 }), frameRate: 10, repeat: -1 });
    }
    if (!scene.anims.exists('spin')) {
        scene.anims.create({ key: 'spin', frames: scene.anims.generateFrameNumbers('saw', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    }
    if (!scene.anims.exists('diamondAnim')){
        scene.anims.create({ key: 'diamondAnim', frames: scene.anims.generateFrameNumbers('diamond', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
    }
}