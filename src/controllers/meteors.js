define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		Meteor = require('entities/meteor'),
		instanceManager = require('instance-manager');
	
	function Meteors() {
		this.game = instanceManager.get('game');
		this.baseInterval = 1500;
		this.intervalRange = 2000;
		this.nextSpawn = 2000;
		this.level = 0;
		this.killCount = 0;
		this.speedInterval = 50;
	}
	
	Meteors.DIRECTION_ARC = 60;	//Arc off straight down in either direction that the meteor can begin motion
	Meteors.BASE_SPEED = 100;
	Meteors.SPAWN_HEIGHT = -50;

	Meteors.prototype = {
		update: function() {
			this.nextSpawn -= this.game.time.elapsed;

			if(this.nextSpawn < 0) {
				this.spawnMeteor();

				this.nextSpawn = this.baseInterval + _.random(this.intervalRange);
			}
		},
		
		incrementKills: function() {
			this.killCount++;
		},

		spawnMeteor: function() {
			var meteors = instanceManager.get('meteors'),
				meteor = meteors.getFirstDead(),
				properties = {
					x: _.random(100, this.game.world.width - 100),
					y: Meteors.SPAWN_HEIGHT,
					angle: _.random(-Meteors.DIRECTION_ARC + 90, Meteors.DIRECTION_ARC + 90),
					speed: Meteors.BASE_SPEED + _.random(0, this.level*this.speedInterval)
				};
			
			if(!meteor) {
				meteor = new Meteor(properties);
				meteors.add(meteor);
			} else {
				meteor.startFall(properties);
			}
		},
	};
	
	Meteors.preload = function(game) {
		Meteor.preload(game);
	};

	return Meteors;
});