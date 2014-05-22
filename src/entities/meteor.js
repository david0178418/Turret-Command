define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		injector = require('injector'),
		damageComponent = require('components/damage'),
		RADIANS_COEF = Math.PI / 180;
	
	function Meteor(props) {
		var game = injector.get('game');
		
		Phaser.Sprite.call(this, game, props.x, props.y, 'meteor');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 75;
		this.height = 75;
		// END
		
		this.scored = false;
		this.onKill = props.onKill;
		this.revive(Meteor.TOUGHNESS);
		this.anchor.setTo(0.5, 0.5);
		game.physics.enable(this, Phaser.Physics.ARCADE);

		this.body.allowRotation = false;
		this.body.collideWorldBounds = false;
		
		this.resourceFragments = injector.get('resourceFragments');
		this.startFall(props);
	}
	
	Meteor.TOUGHNESS = 4;
	
	Meteor.preload = function(game) {
		game.load.image('meteor', '');
	};
	
	Meteor.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Meteor.prototype, damageComponent, {
		constructor: Meteor,
		update: function() {
			if(!this.alive) {
				return;
			}
			
			if(this.isDead()) {
				this.kill();
				this.resourceFragments.spawnResourceFragments(this.x, this.y, 5);
				return;
			}
			if(!this.y > this.game.world.height) {
				this.kill();
			}
		},
		startFall: function(props) {
			this.events.onKilled.addOnce(this.onKill);
			this.scored = false;
			this.reset(props.x, props.y);
			this.health = Meteor.TOUGHNESS;
			this.body.velocity.x = props.speed * Math.cos(props.angle * RADIANS_COEF);
			this.body.velocity.y = props.speed * Math.sin(props.angle * RADIANS_COEF);
		}
	});

	return Meteor;
});