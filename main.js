function isInt(value) {
   return !isNaN(value) && parseInt(Number(value)) == value;
}
// enable vibration support
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
 
if (navigator.vibrate) {
    // vibration API supported
} else {
	navigator.vibrate = function(opt) {
		//nope
	};
}

/**
 *	GAME
 */
;(function(){
window.onload = function() {

/**
 *	Game services setup
 */
/*
	//some parameters
	var friendImages =  [] ;
	var MAX_FRIEND_IMAGES = 50;
	var menuReady = false;

	var gp = CocoonJS.Social.GooglePlayGames;
	var iosClientId = "273377255436-omilg308s7ev1jf4t6bspcrhae3odu3m.apps.googleusercontent.com";
	var webClientId = "361371112171-np3hs471cc3ecrvqh0s0msupu7qierc2.apps.googleusercontent.com";

	gp.init({clientId: navigator.isCocoonJS ? iosClientId : webClientId, defaultLeaderboard:"CgkI66WWm8IKEAIQAQ"});
			 
	var socialService = gp.getSocialInterface();
	//socialService.setTemplates("templates/leaderboards.html", "templates/achievements.html");
	socialService.onLoginStatusChanged.addEventListener(function(loggedIn, error){
		console.log("onLoginStatusChanged: " + loggedIn + " " + socialService.isLoggedIn());
		//show or hide the menu depending on the login state
		if (loggedIn) {
			if (menuReady)
				CocoonJS.App.forwardAsync("CocoonJS.App.show();");
		}
		else {
			if (menuReady)
				CocoonJS.App.forwardAsync("CocoonJS.App.hide();");
		}
	});
		
	//Load the webview menu
	CocoonJS.App.loadInTheWebView("WV-blank.html");
	CocoonJS.App.onLoadInTheWebViewSucceed.addEventListener(function(){
		menuReady = true;
		if (socialService.isLoggedIn())
			CocoonJS.App.forwardAsync("CocoonJS.App.show();");

	});
	CocoonJS.App.onLoadInTheWebViewFailed.addEventListener(function(){
		console.error("onLoadInTheWebViewFailed");
		menuReady = true;
	});

	function showLeaderboard() {
		socialService.showLeaderboard(function(error){
			if (error)
				console.error("showLeaderbord error: " + error.message);
		});
	}

	var loggedIn = socialService.isLoggedIn();
*/
/** 
 *	Ads
 */
CocoonJS.Ad.preloadFullScreen();

/*
 *	Fix problems with Phaser and Cocoon
 */
cocoonjsphaser.utils.fixDOMParser();
//var fileFormat = (navigator.isCocoonJS || 1 == 1) ? '.json' : '.xml';
var fileFormat = '.json';

/*
 *	Start phaser game
 */
var winW = window.innerWidth;
var winH = window.innerHeight;
			
var game = new Phaser.Game(winW, winH, Phaser.CANVAS, 'game_div');
var bonus = 0,
	lives = 3,
	gameCount = 0,
	score,
	bpmText,
	scoreText,
	livesText,
	retryText,
	bgMusic;
	
var plaqueOptions = [
	{ score: 5, frame: 0 },
	{ score: 10, frame: 1 },
	{ score: 25, frame: 2 },
	{ score: 50, frame: 3 },
	{ score: 75, frame: 4 },
	{ score: 100, frame: 5 }
];

var load_state = {  
    preload: function() { 
        this.game.stage.backgroundColor = '#71c5cf';
		this.game.load.image('floor', 'assets/platform.png');    
		this.game.load.image('ground', 'assets/sand.png');
		this.game.load.image('flowers', 'assets/flowers.png');
		this.game.load.image('seaweed', 'assets/seaweed.png');
		this.game.load.image('bubble', 'assets/bubble.png');
		this.game.load.image('star', 'assets/star.png');
		this.game.load.image('ex', 'assets/ex.png');
		this.game.load.image('boat', 'assets/justboat.png');
		this.game.load.image('scoreboard', 'assets/podiums.png');
		this.game.load.image('seaweedboat', 'assets/seaweed-boat.png');
		this.game.load.spritesheet('fish', 'assets/fish-lg.png', 168, 124);
		this.game.load.spritesheet('squid', 'assets/squids-lg.png', 200, 176);
		this.game.load.spritesheet('bubbles', 'assets/bubble.png', 205, 205);
		this.game.load.spritesheet('plaques', 'assets/onboards-lg.png', 200, 180);
		this.game.load.spritesheet('retryButton', 'assets/retryButton.png', 100, 75);
		
		//this.game.load.atlasJSONHash('font1', 'assets/fonts/font.png', 'assets/fonts/font.json');
		this.game.load.bitmapFont('mecha', 'assets/fonts/mecha.png', 'assets/fonts/mecha' + fileFormat);
		
        // Load jump sound
        this.game.load.audio('jump', 'assets/jump.wav');
        this.game.load.audio('waterdrop', 'assets/waterdrop.ogg');
        this.game.load.audio('nom', 'assets/nom.ogg');
        this.game.load.audio('bgmusic', 'assets/bgmusic.ogg');

    },

    create: function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		
		
		bgMusic = this.game.add.audio('bgmusic');
		bgMusic.volume = 0.33;
		
        // When all assets are loaded, go to the 'menu' state
        this.game.state.start('menu');
    }
};

var menu_state = {
    create: function() {
		bgMusic.stop();
		//this.game.input.onDown.add(this.start, this);

        // Defining variables
        var x = this.game.world.width,
			y = this.game.world.height,
			yH = y/2;

	//	this.taptp = this.game.add.sprite(this.game.world.centerX-100, this.game.world.height-35, 'taptoplay');
		this.taptp = this.game.add.bitmapText(this.game.world.centerX-95, this.game.world.height-40, 'mecha', 'Tap the squid to play', 25);
		
	/*	this.playMenuText = this.game.add.sprite(this.game.world.width - 70, 15, 'scoreboard');
		this.playMenuText.scale.setTo(0.20,0.20);
		this.playMenuText.alpha = 1;
        if (socialService.isLoggedIn()) {
			if (menuReady) {
			//	this.playMenuText.alpha = 1;
			//	this.playMenuText.setText('High Scores');
			} else {
				//this.playMenuText.alpha = 0;
			}
		} else {
			//this.login();
		}
		this.playMenuText.inputEnabled = true;
		this.playMenuText.events.onInputDown.add(this.leaderboard,this);
		*/
		// make flowers
		var repeatX = Math.floor(x / 450)+1;
		var repeatY = Math.floor(y / 450)+1;
		for (var i = 0; i < repeatX; i++) {
			for (var j = 0; j < repeatY; j++) {
				this.game.add.sprite(i*450, j*450, 'flowers');
			}
		}
		
		// save score if its high
		var prevHighScore = localStorage.getItem("highScore") || 0,
			highScore = prevHighScore,
			newHigh = false;
		if (score !== undefined) {
			prevHighScore = prevHighScore || 0;
			highScore = prevHighScore;
			if (score > highScore) {
				highScore = score;
				newHigh = true;
			}
		}
		localStorage.setItem("highScore", highScore);
		
	/*	if (score && socialService.isLoggedIn()) {
			socialService.submitScore(score, function(error){
				if (!error) {
					//this.leaderboard();
				}
			});
		}
		*/
		if (highScore != null) {
			var highScore = localStorage.getItem("highScore"),
				plaques = [],
				plaqueSprites = [],
				tweenDelay = 0,
				plaqueOriginalWidth = 200,
				plaqueOriginalHeight = 180,
				plaqueSpacing = 10;
			var plaqueScalar = (this.game.world.width > (plaqueOriginalWidth*0.5*3 + (plaqueSpacing*1.5))) ? 0.5 : ((this.game.world.width - 20) / 3)/plaqueOriginalWidth;
			var xStart = this.game.world.centerX - (1.5*plaqueScalar*plaqueOriginalWidth)-plaqueSpacing, // - 1.5 the intended witdh of plaque plus spacing
				yStart = this.game.world.height - 240;
		//	this.highscoreText = this.game.add.bitmapText((this.game.world.width/2)-80, 25, 'mecha', "High Score: " + highScore, 30);
			this.highscoreText = this.game.add.bitmapText(20, 20, 'mecha', "High Score: " + highScore, 30);
			for (var i in plaqueOptions) {
				plaqueSprites.push(this.game.add.sprite(xStart, yStart, 'plaques', plaqueOptions[i].frame));
				plaqueSprites[plaqueSprites.length-1].scale.setTo(0.5, 0.5);
				if (plaqueOptions[i].score <= highScore && plaqueOptions[i].score <= prevHighScore && 1 == 2) {
					// make alpha show
					plaqueSprites[plaqueSprites.length-1].alpha = 1.0;
				// newly achieved plaque
				} else if (plaqueOptions[i].score <= highScore) {
					plaqueSprites[plaqueSprites.length-1].scale.x = 0;
					plaqueSprites[plaqueSprites.length-1].scale.y = 0;
					this.game.add.tween(plaqueSprites[plaqueSprites.length-1]).to({ angle: 360 }, 600, Phaser.Easing.Linear.None, false, tweenDelay).start();
					this.game.add.tween(plaqueSprites[plaqueSprites.length-1].scale).to({ x: plaqueScalar, y: plaqueScalar }, 600, Phaser.Easing.Linear.None, false, tweenDelay).start();
					tweenDelay += 300;
				} else {
					// partial visible
					plaqueSprites[plaqueSprites.length-1].alpha = 0.5;
					plaqueSprites[plaqueSprites.length-1].scale.setTo(plaqueScalar, plaqueScalar);
				}
				xStart = (i == 2) ? (this.game.world.centerX - (1.5*plaqueScalar*plaqueOriginalWidth)-plaqueSpacing) : xStart+(plaqueScalar*plaqueOriginalWidth)+plaqueSpacing;
				yStart += (i == 2) ? 100 : 0;
			}
		}
        // If the user has a score to show
        if (score !== undefined) {
            // Display its score
			//this.lastscoreText = this.game.add.bitmapText((this.game.world.width/2)-80, 55, 'mecha', "Last Score: " + score, 30);
			this.lastscoreText = this.game.add.bitmapText(20, 50, 'mecha', "Last Score: " + score, 30);
		
			// SHOW AD
			CocoonJS.Ad.showFullScreen();
			
			// Show rating me please
        }
		//CocoonJS.Ad.showBanner();
		
        this.bird = this.game.add.sprite(this.game.world.centerX, this.game.world.height-306, 'squid'); // this.game.world.centerX-50, this.game.world.height-350
		this.bird.scale.setTo(0.5, 0.5);
		this.bird.anchor.x = 0.5;
		this.bird.anchor.y = 0.5;
		this.birdLoop = this.bird.animations.add('flippit', [0,1,2,3,4], 1, true, true);
		this.birdLoop.delay = 2000;
		this.birdFrame = 0;
		this.bird.inputEnabled = true;
		this.bird.events.onInputDown.add(this.start,this);
		
	//	var tween = this.game.add.tween(this.bird);
	//	tween.to( { y: 120 }, 2000, Phaser.Easing.Exponential.Out, true).onStart.add(function(){
	//		//this.birdLoop.delay = 2000;
	//	}, this);
	//	tween.to( { y: this.game.world.height - 350 }, 2000, Phaser.Easing.Linear.None, true).onStart.add(function(){
	//		//this.birdLoop.delay = 4000;
	//	}, this);
	//	tween.loop();
		// Add a simple bounce tween to each character's position.
		var yShift = this.game.add.tween(this.bird);
		yShift.to({y: 90+44}, 2400, Phaser.Easing.Exponential.Out, true);
		yShift.to({y: this.game.world.height - 306}, 2400, Phaser.Easing.Linear.None, true);
		yShift.loop();
		// Add another rotation tween to the same character.
	//	this.game.add.tween(this.bird).to({angle: 360}, 4800, Phaser.Easing.Linear.None, true).loop();
		this.birdLoop.play();
		
		
		this.game.add.sprite(-200, -200, '');
		this.game.add.sprite(-200, -200, '');
		this.game.add.sprite(-200, -200, '');
		
		console.log(this.bird);
		console.log(this.taptp);
		for (var i in plaqueSprites) {
			console.log(plaqueSprites[i]);
		}
		
		this.makeBubbles();
		this.game.add.sprite(-200, -200, '');
		
	//	this.rateMe();
    },
	makeBubbles: function() {
		
		this.back_emitter = game.add.emitter(this.game.world.centerX, this.game.world.height, 100);
		this.back_emitter.makeParticles('bubbles', [0]);
		this.back_emitter.maxParticleScale = 0.6;
		this.back_emitter.minParticleScale = 0.2;
		this.back_emitter.setYSpeed(-20, -100);
		this.back_emitter.setXSpeed(-10, 10);
		this.back_emitter.minParticleScale = 0.1;
		this.back_emitter.maxParticleScale = 0.3;
		this.back_emitter.gravity = 0;
		this.back_emitter.width = this.game.world.width * 1.5;
		this.back_emitter.minRotation = 0;
		this.back_emitter.maxRotation = 40;
		this.back_emitter.start(false, 9000, 1000);
		
	},
	swapsquid: function(i) {
		console.log(this.birdFrame + i);
		this.birdLoop.frame = this.birdFrame + i;
	},
	popsquid: function() {
		//this.bird.velocity
		//this.bird.body.velocity.y = -100;
	},
	login: function() {
    /*    if (!socialService.isLoggedIn()) {
            socialService.login(function(loggedIn, error) {
                if (error) {
                    console.error("login error: " + error.message + " " + error.code);
                }
                else if (loggedIn) {
                    console.log("login suceeded");
					this.playMenuText.alpha = 1;
                }
                else {
                    console.log("login cancelled");
					this.playMenuText.alpha = 0;
                }
            });
        }
		*/
	},
	leaderboard: function() {
  /*      if (socialService.isLoggedIn()) {
			showLeaderboard();
		} else {
			this.login();
		}*/
	},
	rateMe: function() {
		// The list of URLs for rating. As they depend on the operating system/store, different 
		var IOS_RATING_URL = "http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=519623307&onlyLatestVersion=false&type=Purple+Software";
		var ANDROID_RATING_URL = "market://details?id=co.canchat.dmc";

		// Select the rating URL depending on the operating system and if we are inside CocoonJS.
		var ratingURL = null;
		if (navigator.isCocoonJS) {
			if (/ios/.test(navigator.userAgent)) {
				ratingURL = IOS_RATING_URL;
			} else if (/android/.test(navigator.userAgent)) {
				ratingURL = ANDROID_RATING_URL;
			}
		} else {
			ratingURL = "http://goobackgames.com";
		}
		CocoonJS.App.openURL(ratingURL);
	},
	update: function() {
    //    if (socialService.isLoggedIn()) {
			//if (menuReady)
			//	this.playMenuText.setText('High Score');
			//else
			//	this.playMenuText.setText('Loading..');
	//	} else {
		//	this.playMenuText.setText('Login');
	//	}
		this.bird.revive();
	},
    // Start the actual game
    start: function() {
        this.game.state.start('play');
    }
};




var play_state = {

	levels: [
		{ level: 1, delay: 550, frames: [4,0,1,2,4,3], bonuses: [{i:0,bonus:1000,lives:0}],	jumpSpeed: 7 }, //0
		{ level: 2, delay: 440, frames: [4,0,1,2,4,3], bonuses: [{i:0,bonus:200,lives:0}],	jumpSpeed: 7 }, //1
		{ level: 3, delay: 300, frames: [4,0,1,2,4,3], bonuses: [{i:1,bonus:200,lives:0}],	jumpSpeed: 7 }, //2
		{ level: 4, delay: 220, frames: [4,0,1,2,4,3], bonuses: [{i:2,bonus:300,lives:0}],	jumpSpeed: 7 }, //3
		{ level: 5, delay: 180, frames: [4,0,1,2,4,3], bonuses: [{i:0,bonus:500,lives:0}],	jumpSpeed: 7 }, //4		//fast
		{ level: 6, delay: 170, frames: [4,0,1,2,4,3], bonuses: [{i:0,bonus:500,lives:0}],	jumpSpeed: 7 }, //5
		{ level: 7, delay: 150, frames: [4,0,1,2,4,3], bonuses: [{i:0,bonus:500,lives:0}],	jumpSpeed: 7 }, //6		//fast
		{ level: 8, delay: 120, frames: [4,0,1,2,4,3], bonuses: [{i:0,bonus:500,lives:0}],	jumpSpeed: 7 }, //7
		{ level: 9, delay: 100, frames: [4,0,1,2,4,3], bonuses: [{i:0,bonus:500,lives:0}],	jumpSpeed: 7 }  //8
	],
    create: function() {
        score = 0;
		lives = 3;
		this.hits = [];
		this.transitioning = true;

		// make flowers
		var repeatX = Math.floor(this.game.world.width / 450)+1;
		var repeatY = Math.floor(this.game.world.height / 450)+1;
		for (var i = 0; i < repeatX; i++) {
			for (var j = 0; j < repeatY; j++) {
				this.game.add.sprite(i*450, j*450, 'flowers');
			}
		}
		
		//this.boat = this.game.add.sprite(0, this.game.world.height-300, 'seaweedboat');
	//	this.boat = this.game.add.sprite(0, this.game.world.height-225, 'seaweedboat').scale.setTo(0.75, 0.75);
		// create seaweed sprites to tile
	//	var seaWeedWidth = 240;//320;
	//	while (seaWeedWidth < this.game.world.width) {
	//		this.game.add.sprite(seaWeedWidth, this.game.world.height-225/*300*/, 'seaweed').scale.setTo(0.75, 0.75);
	//		seaWeedWidth += 240;//320;
	//	}
		// create ground sprites to tile
		var groundWeedWidth = 0;
		while (groundWeedWidth < this.game.world.width) {
			this.game.add.sprite(groundWeedWidth, this.game.world.height-65, 'ground').scale.setTo(0.5, 0.5);
			groundWeedWidth += 400;
		}

       // this.pipes = game.add.group();
       // this.hit_faces = game.add.group();

		//  The platforms group contains the ground and the 2 ledges we can jump on
		this.platforms = this.game.add.group();
		this.platforms.enableBody = true;
		this.ground = this.platforms.create(0, this.game.world.height - 63, 'floor');
		this.ground.alpha = 0.0;
		this.ground.scale.setTo(2, 2);
		this.ground.body.immovable = true;
	
		this.fish = this.game.add.sprite(this.game.world.centerX-42, 135, 'fish');
		this.fish2 = this.game.add.sprite(this.game.world.centerX-42, 70, 'fish');
		this.fish3 = this.game.add.sprite(this.game.world.centerX-42, 5, 'fish');
		this.fishLoop = this.fish.animations.add('loop', [0,1,2,3,4], 1, true, true);
		this.fishLoop2 = this.fish2.animations.add('loop', [1,2,3,4,0], 1, true, true);
		this.fishLoop3 = this.fish3.animations.add('loop', [2,3,4,0,1], 1, true, true);
		this.fishLoop.delay = 450;
		this.fishLoop2.delay = 450;
		this.fishLoop3.delay = 450;
		this.fish.scale.setTo(0.5, 0.5);
		this.fish2.scale.setTo(0.5, 0.5);
		this.fish3.scale.setTo(0.5, 0.5);
		this.game.physics.arcade.enable(this.fish);
		this.fishLoops = [];
		for (var i in this.levels) {
			this.fishLoops[i] = this.fish.animations.add('loop-'+i, this.levels[i].frames, 1, true, true);
		}
		
		this.fish.body.immovable = true;
		this.fish.animations.play('loop');
		this.fish2.animations.play('loop');
		this.fish3.animations.play('loop');
		
		this.fishBirdDistance = this.game.world.height - 135 - 64 - 65 - 88;
								// world height - staring point of fish - height of fish - ground height - squid height
								
        this.bird = this.game.add.sprite(this.game.world.centerX-50, this.game.world.height - 65 - 88 - 10, 'squid');
		this.bird.scale.setTo(0.5, 0.5);
		this.bird.smoothed = false;
		this.birdLoop = this.bird.animations.add('flippit', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], 1, true, true);
		this.birdFrame = 0;
		this.game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = this.fishBirdDistance*10; // this.game.world.height * 8; //5000; // velocity should be enough to cover the screen height - 65 - top of die in a quarter second
		
		this.game.add.sprite(-200, -200, '');
		
		scoreText = game.add.bitmapText(10, 10, 'mecha','Score: '+score, 25);
		livesText = game.add.bitmapText(10, 40, 'mecha','Lives: '+lives, 25);
		retryText = game.add.bitmapText(this.game.world.width-60, 10, 'mecha','Retry', 25);
		retryText.inputEnabled = true;
		retryText.events.onInputDown.add(this.retry_game,this);
		this.retrySprite = this.game.add.button(this.game.world.width-100, 0, 'retryButton', this.retry_game, this);

		this.stars = this.game.add.group();
		this.stars.createMultiple(10, 'star');
		this.exes = this.game.add.group();
		this.exes.createMultiple(10, 'ex');
		
		// instruction text
		this.tapInstruction = game.add.bitmapText(10, this.game.world.height-65-50, 'mecha','Tap to jump', 25);
		this.game.add.sprite(-200, -200, '');
		this.tapInstructionTween = this.game.add.tween(this.tapInstruction);
		this.tapInstructionTween.to( { x: 20 }, 500, Phaser.Easing.Cubic.Out, true)
			.to( { x: 10 }, 700, Phaser.Easing.Linear.None, true)
			.loop();
		this.game.add.sprite(-200, -200, '');
		
		this.matchInstruction = game.add.bitmapText(10, 135+15, 'mecha','Match color', 25);
		this.game.add.sprite(-200, -200, '');
		this.matchInstructionTween = this.game.add.tween(this.matchInstruction);
		this.matchInstructionTween.to( { x: 20 }, 500, Phaser.Easing.Cubic.Out, true)
			.to( { x: 10 }, 700, Phaser.Easing.Linear.None, true)
			.loop();
		this.game.add.sprite(-200, -200, '');
		
		
		this.game.add.sprite(-200, -200, '');
		this.game.add.sprite(-200, -200, '');
		this.game.add.sprite(-200, -200, '');
		this.game.add.sprite(-200, -200, '');
		this.game.add.sprite(-200, -200, '');
		
		this.game.add.sprite(-200, -200, '');
		this.fakes = this.game.add.group();
		this.fakes.createMultiple(200, '');
		
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.game.input.onDown.add(this.jump, this);
        space_key.onDown.add(this.jump, this); 
		
        this.jump_sound = this.game.add.audio('waterdrop');
        this.nom_sound = this.game.add.audio('nom');
		bgMusic.play('', 0, 0.1, true);
		
		this.game.input.addPointer();
		
		//this.start_crawlers();
		this.change_level(0);
		//this.time_bonus();
		
		this.makeBubbles();
		this.game.add.sprite(-200, -200, '');
    },
	makeBubbles: function() {
	
		this.back_emitter = game.add.emitter(this.game.world.centerX, this.game.world.height, 100);
		this.back_emitter.makeParticles('bubbles', [0]);
		this.back_emitter.maxParticleScale = 0.6;
		this.back_emitter.minParticleScale = 0.2;
		this.back_emitter.setYSpeed(-20, -100);
		this.back_emitter.setXSpeed(-10, 10);
		this.back_emitter.minParticleScale = 0.1;
		this.back_emitter.maxParticleScale = 0.3;
		this.back_emitter.gravity = 0;
		this.back_emitter.width = this.game.world.width * 1.5;
		this.back_emitter.minRotation = 0;
		this.back_emitter.maxRotation = 40;
		this.back_emitter.start(false, 9000, 1000);
		
	},
	fishbubbles: function() {
	},
    update: function() {
	
		scoreText.setText('Score: '+score);
		livesText.setText('Lives: '+lives);
		
		this.game.physics.arcade.overlap(this.fish, this.bird, this.hit_dice, null, this);
		this.game.physics.arcade.collide(this.bird, this.ground, this.has_stopped, null, this);
		//this.game.physics.arcade.collide(this.bird, this.pipes, this.hit_pipe, null, this);
		//this.game.physics.arcade.collide(this.bird, this.crawlers, this.hit_crawler, null, this);
		//this.game.physics.arcade.collide(this.fish, this.clickemitter, this.fishbubbles, null, this);
		
		// !this.bird.alive || !this.bird.exists)
        if (this.bird.inWorld == false || !this.bird.exists)
            this.recreate_squid();
		if (lives <= 0)
            this.restart_game();
/*
		if (this.good_hits.length >= 200 && this.currentLevel != 8)
			this.change_level(8);
		else if (this.good_hits.length >= 100 && this.good_hits.length < 200 && this.currentLevel != 7) // 50
			this.change_level(7);
		else if (this.good_hits.length >= 50 && this.good_hits.length < 100 && this.currentLevel != 6) // 15
			this.change_level(6);
		else if (this.good_hits.length >= 40 && this.good_hits.length < 50 && this.currentLevel != 5) // 8
			this.change_level(5);
		else if (this.good_hits.length >= 30 && this.good_hits.length < 40 && this.currentLevel != 4) // 7
			this.change_level(4);
		*/	
		if (this.good_hits.length >= 75 && this.currentLevel != 6)
			this.change_level(6);
		else if (this.good_hits.length >= 50 && this.good_hits.length < 75 && this.currentLevel != 5) // 7
			this.change_level(5);
		else if (this.good_hits.length >= 25 && this.good_hits.length < 50 && this.currentLevel != 4) // 7
			this.change_level(4);
		else if (this.good_hits.length >= 15 && this.good_hits.length < 25 && this.currentLevel != 3) // 7
			this.change_level(3);
		else if (this.good_hits.length >= 10 && this.good_hits.length < 15 && this.currentLevel != 2) // 5
			this.change_level(2);
		else if (this.good_hits.length >= 5 && this.good_hits.length < 10 && this.currentLevel != 1) // 5
			this.change_level(1);
		else if (this.good_hits.length < 5 && this.currentLevel != 0) // 3
			this.change_level(0);
			
		if (this.bonusTimer) {
		//	var timeLeft = (this.bonusTimer.duration > 0) ? this.bonusTimer.duration : 0;
		//	timeLeft = (timeLeft > 0) ? Math.floor(timeLeft/1) : 0;
		//	this.bonusPoints = timeLeft;
		//	this.bonus_text.text = "+"+this.bonusPoints + "";
		}
		
    },
	recreate_squid: function() {
        this.bird.reset(this.game.world.centerX-50, this.game.world.height - 65 - 88 - 10);
        this.bird.body.gravity.y = this.fishBirdDistance*10;
	},
	change_bird_frame: function(frame) {
		this.birdLoop.frame = frame;
	},
	jumpSpeed: 5,
    jump: function() {
        // Play a jump sound
        this.jump_sound.play();
        // if the bird hit a pipe, no jump
        if (this.bird.alive == false)
            return; 
		
		if (this.bird.body.touching.down) {
		//	this.canHitFish = true;
			this.isJumping = true;
			this.change_bird_frame(this.birdFrame+5);
			this.bird.body.velocity.y = -1*(this.fishBirdDistance * this.jumpSpeed); //2500; // velocity should be enough to cover the screen height - 65 - top of die in a quarter second
		}

    },
	has_stopped: function() {
		this.isJumping = false;
		this.canHitFish = true;
	//	this.birdLoop.frame = this.birdFrame + 10;
		this.change_bird_frame(this.birdFrame+10);
	},
	new_bird: function() {
	},
	stop_player: function() {
        this.bird.body.velocity.y = 0;
	},
	change_player_face: function() {
		var cur = this.birdFrame;;
		var to = cur;
		while (to == cur) {
			to = Math.floor((Math.random() * 5));
		}
		this.birdFrame = to;
		
	//	if (this.bird.body.touching.down) {
		//	this.birdLoop.frame = this.birdFrame + 10;
	//	} else {
			this.birdLoop.frame = this.birdFrame;
	//	}
	},
	hit_dice: function(dice, bird) {
		var frame = this.fishLoop.frame;
		this.hit_face(frame);
		this.bird.body.velocity.y = this.game.world.height * 2; //1000; // velocity should be enough to cover the screen height - 65 - top of die in a quarter second but half
	},
	good_hits: [],
	// animations and such for a frame
	hit_face: function(frame) {
		
		// prevent hitting two fish on a single jump
		if (!this.canHitFish)
			return;
		this.canHitFish = false;
		
		//var type = this.food_types[frame];
		this.hits.push(frame);
		
		if (this.hits.length == 1) {
			this.tapInstruction.destroy();
		}
		
		if (frame == this.birdFrame) {
			this.nom_sound.play();
			//var type = { i:frame, lives:0, score: parseInt(0+this.bonusPoints) };
			var type = { i:frame, lives:0, score: 1 };
			this.good_hits.push(frame);
			if (this.good_hits.length == 1) {
				this.matchInstruction.destroy();
			}
			var fill = "#ffffff";
			this.new_bird();
		} else {
			navigator.vibrate(100);
		//	var type = { i:frame, lives:-1, score:-100 };
			var type = { i:frame, lives:-1, score:0 };
			var fill = "#ff0000";
			var bonusPoints = 0;
		}
		
		this.change_player_face(this.bird);
		
        score += type.score;
		lives += type.lives;
    //    this.label_score.text = "score: "+score;
    //    this.lives_text.text = "lives: "+lives;
       // var face = this.hit_faces.create(this.game.world.centerX-25, 100, 'food_face', frame);
		var text = "";
		if (type.score > 0)
			text += (type.score > 0) ? "+"+type.score : ""+type.score;
		if (type.lives != 0)
			text += ((type.score > 0) ? "" : " ") + ((type.lives < 0) ? ""+type.lives+" lives" : "+"+type.lives+" lives");
       // var face_score = this.game.add.text(this.game.world.centerX+50, 160, text, { font: "30px Arial", fill: fill });
		
		if (type.score > 0) {
			var star = this.stars.next(); // this.game.add.sprite(this.game.world.centerX+50, 160, 'star');
			star.reset(this.game.world.centerX+50, 160);
			star.scale.setTo(0.2);
			star.alpha = 1.0;
			var tween = this.game.add.tween(star);
			var scaletween = this.game.add.tween(star.scale);
			tween.to( { alpha: 0, y: -50 }, 3000, Phaser.Easing.Linear.None, true);
			scaletween.to( { x: 0.7, y: 0.7 }, 3000, Phaser.Easing.Linear.None, true);
		} else {
			var ex = this.exes.next(); // this.game.add.sprite(this.game.world.centerX+50, 160, 'star');
			ex.reset(this.game.world.centerX+50, 160);
			ex.scale.setTo(0.2);
			ex.alpha = 1.0;
			var tween = this.game.add.tween(ex);
			var scaletween = this.game.add.tween(ex.scale);
			tween.to( { alpha: 0, y: -50 }, 3000, Phaser.Easing.Linear.None, true);
			scaletween.to( { x: 0.7, y: 0.7 }, 3000, Phaser.Easing.Linear.None, true);
		}
		
	//	this.check_bonus(frame);
	//	this.time_bonus();
		
		if (type.score > 0)
			this.bubbleBurst();
	},
	bubbleBurst: function() {
	//	this.clickemitter.start(true, 2000, null, 18);
	//	this.game.add.tween(this.clickemitter).to( { alpha: 0 }, 2000, Phaser.Easing.Back.InOut, true, 0, Number.MAX_VALUE, true);
	},
	change_level: function(i) {
		this.transitioning = true;
		var level = this.levels[i];
		this.jumpSpeed = level.jumpSpeed;
		this.fishLoop.delay = level.delay;
		this.fishLoop2.delay = level.delay;
		this.fishLoop3.delay = level.delay;
		this.currentLevel = i;
		this.transitioning = false;
			// got it bonus text
			var gotit = this.game.add.bitmapText((this.game.world.width/2)-135, (this.game.world.height/2)-50, 'mecha', "LEVEL "+(i+1)+"!", 100);
			this.game.add.sprite(-200, -200, '');
			//var gotit = this.game.add.text(this.game.world.width/2, this.game.world.height/2, "LEVEL "+(i+1)+"!", { font: "80px Arial", fill: "#ffffff" });
			//gotit.anchor.setTo(0.5, 0.5);
			gotit.alpha = 0.5;
			this.game.add.tween(gotit).to({ y: (this.game.world.height/2)-150, alpha:0.0 }, 1400, Phaser.Easing.Cubic.Out, true);
	},
	
    retry_game: function() {
		score+=bonus;
		gameCount++;
		while (this.hits.length > 0) {
			this.hits.pop();
		}
		while (this.good_hits.length > 0) {
			this.good_hits.pop();
		}
		this.currentLevel = null;
        this.game.state.start('play');
    },
    restart_game: function() {
		score+=bonus;
		gameCount++;
	//	this.remove_bonus();
	//	this.hits.splice(0,this.hits.length);
	//	this.good_hits.splice(0,this.good_hits.length);
		while (this.hits.length > 0) {
			this.hits.pop();
		}
		while (this.good_hits.length > 0) {
			this.good_hits.pop();
		}
		
		this.currentLevel = null;
     //   this.game.time.events.remove(this.timer);
        this.game.state.start('menu');
    }
	
};


// Define all the states
game.state.add('load', load_state);  
game.state.add('menu', menu_state);  
game.state.add('play', play_state);  

// Start with the 'load' state
game.state.start('load'); 

};
})();