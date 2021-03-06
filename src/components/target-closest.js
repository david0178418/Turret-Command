define(function(require) {
	"use strict";
	return {
			initTargetClosest: function(props) {
				this._targetAction = props.targetAction || function(){};
				this._range = props.range || 10000;
			},
			aquireTarget: function(targets) {
				var closestTarget,
					closestDistance,
					game = this.game,
					arcade = game.physics.arcade;

				targets.forEachAlive(function(target) {
					var distance = arcade.distanceBetween(this, target);

					if(distance >= this._range) {
						return;
					}

					if(!closestTarget || distance < closestDistance) {
						closestTarget = target;
						closestDistance = distance;
					}
				}, this);

				if(closestTarget) {
					this._targetAction(closestTarget);
				}
			},
		};
});

