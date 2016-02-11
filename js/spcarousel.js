var spCarousel = spCarousel || {};
(function (spCarousel) {
	spCarousel.init = function() {
		spCarousel.frameElem = document.getElementsByClassName('sp-carousel-frame')[0];
		spCarousel.innerFrameElem = document.getElementsByClassName('sp-carousel-inner')[0];
		spCarousel.imageItems = spCarousel.innerFrameElem.children;
		spCarousel.offset = 0;
		spCarousel.itemData = [];
		for (i = 0; i < spCarousel.imageItems.length; i++) { 
		    spCarousel.itemData.push({offset:200*i});
		}
	};

	function _windowResizeHandler() {
		console.log('resize fired!')
	}

	function _clickHandler(e) {
		e.preventDefault();
	}

	
	window.onload = function() {
		window.addEventListener('resize', _windowResizeHandler, true);
		document.getElementById('sp-carousel-next-btn').addEventListener('click', _clickHandler, false);
		spCarousel.init();
	};

	return spCarousel;
}(spCarousel));