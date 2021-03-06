import Button from "../gameObjects/Button.js";

var volumeEffectsFromMenu;
var volumeBackgroundMusicFromMenu;

class MainMenuBackground extends Phaser.Scene {
    constructor(){
        super( "MainMenuBackground");
    }
    
    
    create(){
       //Animated background
       this.cameras.main.fadeIn(1500, 0, 0, 0)
       this.background = this.add.image(640, 360, "background_2");
       this.cloud = this.add.image(-200,0,"cloud");
       this.cloud.setScale(0.3,0.3)
       this.cloud1 = this.add.image(-200,0,"cloud");
       
       this.cloud1.setScale(0.2,0.2)
      

       //this.title = this.add.sprite(640,165, "title_anim")
       //this.title.setScale(0.15,0.15)
       this.anims.create({key: "colorful_title",frames: this.anims.generateFrameNumbers("title_anim", {frames: [0,1,2,3]}), repeat: -1, frameRate: 8})
       //this.title.anims.play("colorful_title")
       this.character2 = this.add.sprite(-100,600,"run") 
       this.character2.setScale(0.75,0.75)
       this.character2.anims.play('run',true)
       this.character2.flipX = true
       this.sniper = this.add.image(this.character2.x+50, this.character2.y+10, "sniper");
       this.sniper.setScale(0.3,0.3)
       this.add.image(640, 540, "FLOOR").setScale(0.6,0.6);
       this.character1 = this.add.sprite(-300,600,"run") 
       this.character1.setScale(0.8,0.8)
       this.character1.anims.play('run',true)
       this.character1.flipX = true
       this.shotgun = this.add.image(this.character1.x+30, this.character1.y+20, "shotgun");
       this.shotgun.setScale(0.8,0.8)
       this.fog = this.add.sprite(640,600, "fog_anim")
       this.anims.create({key: "fog",frames: this.anims.generateFrameNumbers("fog_anim", {frames: [0,1,2,3,4]}), repeat: -1, frameRate: 7})
       this.fog.anims.play("fog")
       this.rights = this.add.text (640,700, "Okupa Software. All rights reserved. 2021.",{fontFamily: 'army_font', fontSize:'18px' }).setOrigin(0.5,0.5)
     
       this.scene.launch("MainMenu");
       this.scene.bringToTop("MainMenu");

        
        // Volume
        // Global volume
        volumeEffectsFromMenu = 0.5;
        volumeBackgroundMusicFromMenu = 0.2;
        this.registry.set('effectsVolumeFromMenu', volumeEffectsFromMenu);
        this.registry.set('backgroundVolumeFromMenu', volumeBackgroundMusicFromMenu);
        // Background music in menus
        this.backgroundMusic = this.sound.add('backgroundMusic');
        this.backgroundMusic.play({volume: volumeBackgroundMusicFromMenu});
        this.backgroundMusic.loop = true;
    }

    update(time, delta){
        //Animation control
        this.cloud.x++;
        this.cloud1.x--;
        this.character1.x+=1.2;
        this.shotgun.x+=1.2;
        this.character2.x+=0.8;
        this.sniper.x+=0.8;
      
        if(this.cloud.x>1500){
            this.cloud.x=-100;
        }
        if(this.cloud1.x<-200){
            this.cloud1.x=1500;
        }
        if(this.character1.x> 1400){
            this.character1.x = -100
            this.shotgun.x = this.character1.x+30
        }
        if(this.character2.x> 1400){
            this.character2.x = -100
            this.sniper.x = this.character2.x+50
        }
        
        
        /*
        if(Math.sin(time)>-0.5){

            this.titleText.setColor("red")
        }else{
            this.titleText.setColor("white")
        }
        //console.log(Math.sin(time))
        */
    }
}
export default MainMenuBackground;
