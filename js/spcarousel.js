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
		frameHeight = frameWidth / imgRatio / 1.5
		slideWidth = frameWidth / 1.5;
		slideHeight = frameHeight;
		slidesWrapWidth = 4 * slideWidth;
		slidesWrapHeight = frameHeight;
		offset = slideWidth - (frameWidth-slideWidth)/2;
	}

	spCarousel.init = function() {
		frameElem = document.getElementsByClassName('sp-carousel-frame')[0];
		slidesWrapElem = document.getElementsByClassName('sp-carousel-inner')[0];
		slidesArr = slidesWrapElem.children;

		calculateDimensions();
		populateVisibleSlides();
		drawSlides();
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
	}

	function drawSlides() {
		for (i = 0; i < slidesArr.length; i++) { 
		    slidesArr[i].style.display = "none";
		    slidesArr[i].style.width = slideWidth + "px";
		}
		var xPos = -offset;
		for (i = 0; i < visibleSlidesArr.length; i++) { 
		    slidesArr[visibleSlidesArr[i]].style.left = xPos.toString() + 'px';
		    slidesArr[visibleSlidesArr[i]].style.display = "inline-block";
		    xPos += slideWidth;
		}
	}

	function windowResizeHandler() {
		calculateDimensions();
		drawSlides();
	}

	function slideNextHandler() {
		slidesArr[currentIndex].className = slidesArr[currentIndex].className.replace('active', '');
		currentIndex = getNextSlideIndex();
		slidesArr[currentIndex].className += slidesArr[currentIndex].className ? ' active' : 'active';
		var nextIndex = getNextSlideIndex(); // The next one we're pushing to the array
		visibleSlidesArr.push(nextIndex);
		slidesArr[nextIndex].style.left = (1.5*slideWidth+offset) + 'px';
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