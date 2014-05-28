//Really, "Service Locatore"...but whatever...  Using the
//anti-pattern just to get this thing up.
//TODO Organize more neatly so dependecies are known by the interface
define(function(require, exports) {
	"use strict";
	
	//TODO remove debug global
	var injector = window.injector = exports;
		
	var resources = {
		game: {
			init: function() {
				var CONFIG = require('config'),
					Phaser = require('phaser');

				//TODO remove debug global
				return window.game = new Phaser.Game(CONFIG.screen.width, CONFIG.screen.height, Phaser.AUTO, 'phaser');
			},
		},
		
		group: {
			cache: false,
			init: function() {
				return injector.get('game').add.group();
			}
		},

		hero: {
			init: function() {
				var CONFIG = require('config'),
					Hero = require('entities/hero');

				//TODO remove debug global
				return window.hero = new Hero({x: CONFIG.stage.width/2, y: CONFIG.stage.height});
			}
		},
		
		
		//TODO less ghetto way of collecting all targetables
		// since entities can only exist in one group at a time
		playerTargets: {
			init: function() {
				return {
					_lists: [
						injector.get('turrets'),
						injector.get('buildings'),
					],
					forEachAlive: function(callback) {
						for(var x = 0; x < this._lists.length; x++) {
							this._lists[x].forEachAlive(callback, context);
						}
					},
				};
			},
		},
		
		//TODO less ghetto way of collecting all targetables
		// since entities can only exist in one group at a time
		enemyTargets: {
			init: function() {
				return {
					_lists: [
						injector.get('meteors').meteors,
					],
					forEachAlive: function(callback, context) {
						//TODO less ghetto way of collecting all targetables
						// since entities can only exist in one group at a time
						for(var x = 0; x < this._lists.length; x++) {
							this._lists[x].forEachAlive(callback, context);
						}
					}
				};
			}
		},
		
		turrets: {
			init: function() {
				return injector.get('group');
			},
		},
		
		buildings: {
			init: function() {
				return injector.get('group');
			},
		},

		meteors: {
			init: function() {
				var Meteors = require('controllers/meteors');
				return new Meteors();
			},
		},

		resourceFragments: {
			init: function() {
				var ResourceFragments = require('controllers/resource-fragments');

				return new ResourceFragments();
			},
		},
		
		hud: {
			init: function() {
				var Hud = require('entities/hud');
				return new Hud();
			},
		},
		
		meteorTrail: {
			cache: false,
			init: function() {
				var game = injector.get('game');
				
				return null;
			}
		}
	},
		
	instances = {};
		
	exports.get = function(resourceName) {
		var resourceInstance = instances[resourceName];
		
		if(!resourceInstance) {
			resourceInstance = resources[resourceName].init();
			
			if(resources[resourceName].cache || resources[resourceName].cache === undefined) {
				instances[resourceName] = resourceInstance;
			}
		}

		return resourceInstance;
	};
	
	exports.reset = function(dependency) {
		instances[dependency] = resources[dependency]();
	};
});
