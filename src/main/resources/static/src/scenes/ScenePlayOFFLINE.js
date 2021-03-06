import Player from '../gameObjects/Player.js';
import Boost from '../gameObjects/boost.js';
import Bullet from '../gameObjects/bullet.js';



class ScenePlayOFFLINE extends Phaser.Scene {
    constructor() {
        super({ key: "ScenePlay" });
        this.menuOn = false;
        this.respawnPlaces = [[490, 300], [850, 300], [450, 550], [930, 550]];
        this.timeText;
        this.gap = 0;
        this.tcount = 0;
    }


    create() {
        //timer        
        this.timeText = this.add.text(640, 30, "T", { font: 'Bold 32px Arial' }).setOrigin(0.5).setDepth(10) //Elapsed Time Text
        this.gap = 0;
        this.tcount = 0;
        
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.killText = this.add.text(640, 200, "+1 KILL", {fontFamily: 'army_font', color: 'yellow', fontSize: '50px ' }).setOrigin(0.5).setDepth(10).setTint(0xffdf00).setAlpha(0); //Elapsed Time Text
        // Add background
        this.background = this.add.image(640, 360, "background_2");
        //Options button
        this.add.text(15, 15, "Press ESC to open in game menu",  {fontFamily: 'army_font', color: 'white', fontSize: '24px ' } ).setDepth(10)

        //________________________________________________________

        //Sound effects
        //this.hitPlayer = this.sound.add('impact');
        this.funnyPlayer = this.sound.add('cry');
        this.hitPlayer = this.sound.add('deathcry');
        this.shieldEffect = this.sound.add('shieldEffect');
        this.extraLife = this.sound.add('extraLife');
        this.reload = this.sound.add('reload');
        //this.hitPlayer.play();
        this.funnyPlayer.play();

        this.input.keyboard.on('keydown-' + 'ESC', this.launchMenu, this);
        
        //Ambiental music
        this.sceneplayMusicBackground = this.sound.add('sceneplayMusic');
        this.sceneplayMusicBackground.play({volume: this.registry.get("backgroundVolumeFromMenu")});
        
        //#region Add platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(1130, 500, "platform_1").setScale(0.3, 0.3).refreshBody().setSize(115, 25, 0, 0);
        this.platforms.create(150, 500, "platform_1").setScale(0.3, 0.3).refreshBody().setSize(115, 25, 0, 0);
        this.platforms.create(640, 500, "platform_1").setScale(0.3, 0.3).refreshBody().setSize(115, 25, 0, 0);

        this.platforms.create(500, 100, "platform_2").setScale(0.3, 0.3).refreshBody().setSize(150, 25, 0, 0);
        this.platforms.create(780, 100, "platform_2").setScale(0.3, 0.3).refreshBody().setSize(150, 25, 0, 0);

        this.platforms.create(400, 600, "platform_3").setScale(0.3, 0.3).refreshBody().setSize(190, 25, 0, 0);
        this.platforms.create(880, 600, "platform_3").setScale(0.3, 0.3).refreshBody().setSize(190, 25, 0, 0);

        this.platforms.create(800, 350, "platform_4").setScale(0.3, 0.3).refreshBody().setSize(230, 25, 0, 0);
        this.platforms.create(480, 350, "platform_4").setScale(0.3, 0.3).refreshBody().setSize(230, 25, 0, 0);
        this.platforms.create(1050, 200, "platform_4").setScale(0.3, 0.3).refreshBody().setSize(230, 25, 0, 0);
        this.platforms.create(230, 200, "platform_4").setScale(0.3, 0.3).refreshBody().setSize(230, 25, 0, 0);
        //#endregion

        //boost
        this.boostArray = new Array();
        this.boostArray[0] = new Boost(this, 640, 450 + 10, "live").setScale(0.3, 0.3);
        this.boostArray[1] = new Boost(this, 230, 150 + 10, "bubble").setScale(0.3, 0.3);
        this.boostArray[2] = new Boost(this, 1050, 150 + 10, "ammo").setScale(0.15, 0.15);

        //players
        //En este caso uno mas 
        this.playersArray = new Array();
        this.playersArray[0] = new Player(this, 700, 650, "idle",this.registry.get("username2"),this.add.image(this.x, this.y+2, "shotgun")).setScale(0.5, 0.5).setOrigin(0.5, 0.8).setInteractive({ cursor: 'url(assets/player/weapon/mirillaRed.png), pointer' }).setTint(0x92C5FC);
        //Cambio de controles para local
        this.playersArray[0].player1jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.playersArray[0].player1RightControl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.playersArray[0].player1LeftControl = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.playersArray[0].player1die = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.playersArray[0].weapon.setScale(0.4,0.4)
        //Cambio de flipeo para local
        this.playersArray[0].flipHorizontal = function(){
            if (this.player1RightControl.isDown) {
                this.flipX = true;
                this.weapon.setOrigin(0.1, 0)
                this.weapon.flipX=false;
            }
            if (this.player1LeftControl.isDown) {
                this.flipX = false;
                this.weapon.setOrigin(0.9, 0)
                this.weapon.flipX=true;
            }
        

        }
        //this.playersArray[0].setShield(true)

        //PLAYER 1
        this.player1 = new Player(this, 50, 650, "idle", this.registry.get("username1"),this.add.image(this.x, this.y+2, "rifle")).setScale(0.5, 0.5).setOrigin(0.5, 0.8).setInteractive({ cursor: 'url(assets/player/weapon/mirillaRed.png), pointer' }).setTint(0xCC6666);

        // bullets player 1
        this.bulletsPlayer1 = new Array();
        for(var i = 0; i < this.player1.getTotalAmmo(); i++){
            let bullet = new Bullet(this, -50, -50, "bala").setScale(0.5);
            this.bulletsPlayer1.push(bullet);
            this.physics.add.collider(this.platforms, this.bulletsPlayer1[i], this.hit);
            this.physics.add.collider(this.bulletsPlayer1[i], this.playersArray[0], this.hitBody); // Collision with only one enemy
        }
        

        // player 1 shooting
        this.input.on('pointerdown', function (pointer) {
            if (this.menuOn == false) {
                if (this.player1.getCurrentAmmo() > 0) {
                    let foundBullet = false;
                    for(var i = 0; i < this.player1.getTotalAmmo();i++){
                        if(!this.bulletsPlayer1[i].active){
                            this.bulletsPlayer1[i].shot(pointer, this.player1);
                            foundBullet = true;
                        }
                        if(foundBullet)
                            i = this.player1.getTotalAmmo() - 1; // ends finding bullet
                    }

                    this.player1.decreaseCurrentAmmo();

                    //sound effect
                    //Sounds variables. this.bulletMenuSound is created here and not outside the functions so it creates a new sound every time and is independent from the old ones.
                    this.bulletMenuSound = this.sound.add('shot');
                    this.bulletMenuSound.play({volume: this.registry.get("effectsVolumeFromMenu")});
                    
                    //this.player1.decreaseLife(10);
                }else{
                    this.noAmmo = this.sound.add('noAmmo');
                    this.noAmmo.play();
                }
            }
        }, this);

        //controls player 1
        
        //Physics player 1
        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.playersArray, this.platforms);

        for (var i = 0; i < this.boostArray.length; i++) {
            this.physics.add.collider(this.platforms, this.boostArray)
            this.physics.add.collider(this.player1, this.boostArray[i], this.boostArray[i].efect)
            this.physics.add.collider(this.playersArray[0], this.boostArray[i], this.boostArray[i].efect)
        }
        
        this.cameras.main.once('camerafadeoutcomplete', function() {
           
        });
    }

    update(time, delta) {
        
        this.checkRespawn();
        
        this.randBoostFunc();

        this.cronoFunc(time);
        
        //#region Players movement
        
        if (this.menuOn == false) {
            if(this.playersArray[0].alive == true){
            this.playersArray[0].body.setVelocityX(0)
            this.playersArray[0].update(time, delta)
                
            }
            this.player1.body.setVelocityX(0)
            this.player1.update(time, delta)
            this.player1.aim(this.input.activePointer.x, this.input.activePointer.y);
            // Player 1 controls
            
        }else{
            this.player1.body.setVelocityX(0)
            this.playersArray[0].body.setVelocityX(0)
        }
        //#endregion
        
        
        // Bullets position out of bounds. Need to be modularized.
        for(var i = 0; i < this.player1.getTotalAmmo() ;i++){
            if(this.bulletsPlayer1[i].active){
                //Code that we want
                //this.bulletsPlayer1[i].checkOutOfBounds(1280, 720);

                //Code that works by now
                if(this.bulletsPlayer1[i].x >= 1275 ||
                   this.bulletsPlayer1[i].x <= 5    ||
                   this.bulletsPlayer1[i].y <= 5    ||
                   this.bulletsPlayer1[i].y >= 715)
                {
                    this.bulletsPlayer1[i].setPosition(-50);
                    this.bulletsPlayer1[i].body.setVelocityX(0);
                    this.bulletsPlayer1[i].body.setVelocityY(0);
                    this.bulletsPlayer1[i].setVisible(false);
                    this.bulletsPlayer1[i].setActive(false);
                }
            }
        }
    }
    
    launchMenu() {
        if (this.menuOn == false) {
            this.menuOn = true;
            this.scene.launch("InGameMenu");
            this.scene.bringToTop("InGameMenu");
            console.log("TEST");
        } else if (this.menuOn == true) {
            this.menuOn = false;
            this.scene.stop("InGameMenu");
        }

    }

//#region Bullets
    hit(gBullet, platform) {
        gBullet.setPosition(-50);
        gBullet.body.setVelocityX(0);
        gBullet.body.setVelocityY(0);
        gBullet.setVisible(false);
        gBullet.setActive(false);
        
    }
    hitBody(gBullet, target) {
        gBullet.setPosition(-50);
        gBullet.body.setVelocityX(0);
        gBullet.body.setVelocityY(0);
        gBullet.setVisible(false);
        gBullet.setActive(false);

        target.decreaseLife(20);
    }
//#endregion
    
    cronoFunc(time){
        // Time counter
        if (this.tcount == 0) {
            this.gap = Math.round(time * 0.001);
            this.tcount++;
        }
        var seconds = (time * 0.001); //Converted to Seconds
        var timer = 90 - Math.round(seconds) + this.gap;
        var ttext = timer.toString();

        if (timer > 0) {
            if (timer > 20) {
                this.timeText.setTint(0xFFFFFF);
                this.timeText.setText(ttext);
            } else {
                if (timer % 2 == 0) {
                    this.timeText.setTint(0xFFFFFF);
                    this.timeText.setText(ttext);
                }
                if (timer % 2 == 1) {
                    this.timeText.setTint(0xFF0000);
                    this.timeText.setText(ttext);
                }
            }
        }
        else {
            this.timeText.setText("END");
            this.player1.setCountKills(this.playersArray[0].getCountDeaths());
            this.playersArray[0].setCountKills(this.player1.getCountDeaths());
            this.registry.set("player1", this.player1);
            this.registry.set("player2", this.playersArray[0]);
            this.scene.launch("StatsScene");
            this.scene.bringToTop("StatsScene");
            this.scene.pause("ScenePlay");
            this.scene.stop("InGameMenu");
        }
    }
    randBoostFunc(){
        // Boost generator
        var randBoost = Math.floor(Math.random() * 3) + 1;
        for (var i = 0; i < this.boostArray.length; i++) {
            if (this.boostArray[i].status == false) {
                this.boostArray[i].counter++;
            }
            if (this.boostArray[i].counter == 700) {
                if (i == 0) {
                    if (randBoost == 1) {
                        this.boostArray[i] = new Boost(this, 640, 450 + 10, "live").setScale(0.3, 0.3);
                    }
                    if (randBoost == 2) {
                        this.boostArray[i] = new Boost(this, 640, 450 + 10, "bubble").setScale(0.3, 0.3);
                    }
                    if (randBoost == 3) {
                        this.boostArray[i] = new Boost(this, 640, 450 + 10, "ammo").setScale(0.15, 0.15);
                    }
                }
                if (i == 1) {
                    if (randBoost == 1) {
                        this.boostArray[i] = new Boost(this, 230, 150 + 10, "live").setScale(0.3, 0.3);
                    }
                    if (randBoost == 2) {
                        this.boostArray[i] = new Boost(this, 230, 150 + 10, "bubble").setScale(0.3, 0.3);
                    }
                    if (randBoost == 3) {
                        this.boostArray[i] = new Boost(this, 230, 150 + 10, "ammo").setScale(0.15, 0.15);
                    }
                }
                if (i == 2) {
                    if (randBoost == 1) {
                        this.boostArray[i] = new Boost(this, 1050, 150 + 10, "live").setScale(0.3, 0.3);
                    }
                    if (randBoost == 2) {
                        this.boostArray[i] = new Boost(this, 1050, 150 + 10, "bubble").setScale(0.3, 0.3);
                    }
                    if (randBoost == 3) {
                        this.boostArray[i] = new Boost(this, 1050, 150 + 10, "ammo").setScale(0.15, 0.15);
                    }
                }
                this.physics.add.collider(this.player1, this.boostArray[i], this.boostArray[i].efect);
                this.physics.add.collider(this.playersArray[0], this.boostArray[i], this.boostArray[i].efect);
            }
        }
    }
    checkRespawn(){
        if (this.playersArray[0].alive == false) {
            this.funnyPlayer.play();
            this.killText.setAlpha(1);
            this.killText.setPosition(this.killText.x,this.killText.y+5)
            this.playersArray[0].dieTimer--;
        }

        if (this.playersArray[0].alive == false && this.playersArray[0].dieTimer == 0) {
            var idx = Math.floor(Math.random() * (3 - 0 + 1) + 0)
            //this.playersArray[0].body.setPosition(-200,-200);
            this.killText.setAlpha(0);
            this.killText.setPosition(640,200)
            this.playersArray[0].respawn(this.respawnPlaces[idx][0], this.respawnPlaces[idx][1])
            this.playersArray[0].dieTimer = 200;
        }
    }
}

export default ScenePlayOFFLINE;
