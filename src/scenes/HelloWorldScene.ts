import Phaser from 'phaser'

import WebFontFile from '../webFontFile'

export default class HelloWorldScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup
    private player?: Phaser.Physics.Arcade.Sprite
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private stars?: Phaser.Physics.Arcade.Group

    private score = 0; 
    private scoreText?:Phaser.GameObjects.Text

    constructor() {
        super('hello-world')
    }

    preload() {
        this.load.image('sky', 'assets/sky.png')
        this.load.image('ground', 'assets/platform.png')
        this.load.image('star', 'assets/star.png')
        this.load.image('bomb', 'assets/bomb.png')

        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32, frameHeight: 48
        })

        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create() {
        this.add.image(400, 300, 'sky')

        this.platforms = this.physics.add.staticGroup()

        const ground: Phaser.Physics.Arcade.Sprite = this.platforms.create(400, 568, 'ground')

        ground
            .setScale(2)
            .refreshBody()

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground')

        this.player = this.physics.add.sprite(100, 450, 'dude')

        this.player.setBounce(0.2);
        // this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0, end: 3
            }),
            frameRate: 10,
            repeat: -1,
        })

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        })

        this.physics.add.collider(this.player, this.platforms)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        })

        this.stars.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        })

        this.physics.add.collider(this.platforms, this.stars)

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)

        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            color: '#fff',
            fontFamily: '"Press Start 2P"',
        })
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }

        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160)

            this.player.anims.play('right', true);
        }

        else if (this.cursors?.up.isDown && this.player.body.touching.down) {
            
            this.player.setVelocityY(-330)
        }

        else if (this.cursors.up.isDown && this.player.body.touching.down && this.cursors.left.isDown){
            this.player.setVelocity(-160, -330);
            this.player.anims.play('left', true)
        }

        else {
            this.player.setVelocityX(0)

            this.player.anims.play('turn')
        }

        if(0 > this.player.x){
            this.player.setX(<number>this.game.config.width)
        }

        if(this.player.x > this.game.config.width){
            this.player.setX(0)
        }

    }

    private collectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject) {
        const star = s as Phaser.Physics.Arcade.Image

        star.disableBody(true, true)

        this.score += 10;

        this.scoreText.setText(`Score: ${this.score}`)
    }
}
