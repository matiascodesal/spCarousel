var spCarousel = spCarousel || {};
(function (spCarousel) {
	var currentIndex = 0;
	var slidesArr = [];
	var visibleSlidesArr = [];
	var frameElem, slidesWrapElem;
	var frameWidth, frameHeight, slideWidth, slideHeight, 
		slidesWrapWidth, slidesWrapHeight, imgRatio;
	var offset;

	function calculateDimensions() {
		imgRatio = slidesArr[0].naturalWidth / slidesArr[0].naturalHeight;
		frameWidth = frameElem.offsetWidth;
		frameHeight = frameWidth / imgRatio / 2
		slideWidth = frameWidth / 2;
		slideHeight = frameHeight;
		slidesWrapWidth = 4 * slideWidth;
		slidesWrapHeight = frameHeight;
		offset = slideWidth/2;
	}

	spCarousel.init = function() {
		frameElem = document.getElementsByClassName('sp-carousel-frame')[0];
		slidesWrapElem = document.getElementsByClassName('sp-carousel-inner')[0];
		slidesArr = slidesWrapElem.children;

		calculateDimensions();
		populateVisibleSlides();
	};

	function getPrevSlideIndex() {
		if (currentIndex == 0) {
			return (slidesArr.length - 1);
		}
		else {
			return (currentIndex - 1);
		}
	}

	function getNextSlideIndex() {
		if (currentIndex == slidesArr.length - 1) {
			return 0;
		}
		else {
			return (currentIndex + 1);
		}
	}

	function populateVisibleSlides() {
		// @todo: Raise an error if there are no slides
		if (slidesArr.length < 3) {

		}
		visibleSlidesArr.push(slidesArr.length - 1);
		visibleSlidesArr.push(0);
		visibleSlidesArr.push(1);

		for (i = 0; i < slidesArr.length; i++) { 
		    slidesArr[i].style.display = "none";
		}
		var xPos = -slideWidth + offset;
		for (i = 0; i < visibleSlidesArr.length; i++) { 
		    slidesArr[visibleSlidesArr[i]].style.left = xPos.toString() + 'px';
		    slidesArr[visibleSlidesArr[i]].style.display = "inline-block";
		    xPos += slideWidth;
		}
		
	}

	function getCarouselDimensions() {

	}


	function windowResizeHandler() {
		console.log('resize fired!');
	}

	function clickHandler(e) {
		e.preventDefault();
	}

	function slideNextHandler() {
		currentIndex = getNextSlideIndex();
		var nextIndex = getNextSlideIndex(); // The next one we're pushing to the array
		visibleSlidesArr.push(nextIndex);
		slidesArr[nextIndex].style.left = (2*slideWidth+offset) + 'px';
		slidesArr[nextIndex].style.display = "inline-block";
		var newPos;
		for (i = 0; i < visibleSlidesArr.length; i++) { 
			newPos = Number(slidesArr[visibleSlidesArr[i]].style.left.replace("px", "")) - slideWidth;
		    slidesArr[visibleSlidesArr[i]].style.left = newPos + 'px';
		}
		slidesArr[visibleSlidesArr[0]].style.display = "none";
		visibleSlidesArr.shift();
	}

	
	window.onload = function() {
		window.addEventListener('resize', windowResizeHandler, true);
		document.getElementById('sp-carousel-next-btn').addEventListener('click', slideNextHandler, false);
		spCarousel.init();
	};

	return spCarousel;
}(spCarousel));