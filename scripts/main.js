
jQuery(function($) {
	'use strict';

	var g = window.g = {},
		$window = $(window);

	window.checkSupport = function(properties) {

		var style = document.createElement('div').style,
			prefixes = ['webkit', 'Webkit', 'Khtml', 'Moz', 'ms', 'O'],
			property,
			capitalizedProperty,
			fullSupport = true;

		g.properties = g.properties || {};

		checkProperty:
		for (var i in arguments) {
			property = arguments[i];

			if (property in style) {
				g.properties[property] = property;
				continue;
			}
			capitalizedProperty = property.charAt(0).toUpperCase() + property.slice(1);

			for (var i in prefixes) {
				if (prefixes[i] + capitalizedProperty in style) {
					g.properties[property] = prefixes[i] + capitalizedProperty;
					continue checkProperty;
				}
			}
			g.properties[property] = false;
			fullSupport = false;
		}
		return fullSupport ? true : false;
	};

	if ( !checkSupport('transition', 'transform') ) {
		alert('this browser doesn\'t support css3, not gonna work');
		return false;
	}

	var cardContainer = $('.card-container'),
		transformProperty = g.properties.transform,
		positions = [];

	for (var i = 0; i < 52; i++) {
		positions[i] = i * 190;
	}

	var shuffle = function(array) {
		for (var i = 0; i < array.length; i++) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

	var positions = shuffle(positions);

	for (var i = 0; i < 52; i++) {
		$('<div class="card" style="-webkit-transform: translateX(-' + Math.round(i / 3) + 'px);"><b style="background-position: 0 -' + positions[i] + 'px"></b><i></i></div>').prependTo(cardContainer);
	}

	var cards = cardContainer.find('div'),
		originX = null,
		originY = null,
		deltaX = null,
		deltaY = null,
		zIndex = 0,
		card,
		styleString = '',
		moving = false;

	var getRandom = function(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	};

	cards.on({
		mousedown: function(event) {
			event.preventDefault();
			card = this;
			if (moving) return;
			if ($(this).hasClass('flipped')) {
				card.style[transformProperty] += ' rotateZ(120deg) translate(-300px, -100px)';
				$(card).addClass('gtfo');
				return false;
			}
			originX = event.screenX - $(this).position().left;
			originY = event.screenY - $(this).position().top;
			this.style.zIndex = ++zIndex;
			$(this).addClass('no-transition');
			$window.on({
				mousemove: function(event) {
					deltaX = event.screenX - originX;
					deltaY = event.screenY - originY;
					card.style[transformProperty] = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
				},
				mouseup: function() {
					$window.off();
					$(card).removeClass('no-transition');
					styleString = card.style[transformProperty] || '';
					if (deltaX > -200 && deltaX < 0) {
						styleString += ' translate(-200px, ' + getRandom(-50, 50) + 'px)';
						moving = true;
					} else if (deltaX < 200 && deltaX >= 0) {
						styleString += ' translate(200px, ' + getRandom(-50, 50) + 'px)';
						moving = true;
					}
					setTimeout( function() {
						moving = false;
					}, 300);
					card.style[transformProperty] = styleString + ' rotateY(180deg) rotateZ(' + getRandom(-10, 10) + 'deg)';
					$(card).addClass('flipped');
					deltaX = 0;
					deltaY = 0;
				}
			});
		}
	});


});