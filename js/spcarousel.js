var spCarousel = spCarousel || {};
(function (spCarousel) {
	var currentIndex = 0;
	var slidesArr = [];
	var visibleSlidesArr = [];
	var frameElem, slidesWrapElem;
	var frameWidth, frameHeight, slideWidth, slideHeight, 
		slidesWrapWidth, slidesWrapHeight, imgRatio;
	var offset;
	var slideTransDuration = 500;
	var transitionLocked = false;

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
		if (slidesArr.length < 3) {
			alert("[Error] Carousel must contain at least 3 images");
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

	function slidePrevHandler() {
		if (!acquireTransitionLock()) {
			return;
		}

		slidesArr[currentIndex].className = slidesArr[currentIndex].className.replace('active', '');
		currentIndex = getPrevSlideIndex();
		slidesArr[currentIndex].className += slidesArr[currentIndex].className ? ' active' : 'active';
		var prevIndex = getPrevSlideIndex(); // The next one we're pushing to the array
		visibleSlidesArr.unshift(prevIndex);
		slidesArr[prevIndex].style.left = (-slideWidth-offset) + 'px';
		console.log(offset)
		console.log((-slideWidth-offset));
		slidesArr[prevIndex].style.display = "inline-block";
		var animObj = slidesWrapElem.animate([{transform: 'translate(0)'},
										{transform: 'translate(' + slideWidth + 'px, 0px)'}
										], {duration:slideTransDuration, easing:'ease-out'});
		animObj.addEventListener('finish', function(e) {
			var newPos;
			for (i = 0; i < visibleSlidesArr.length; i++) {
				newPos = Number(slidesArr[visibleSlidesArr[i]].style.left.replace("px", "")) + slideWidth;
		  		slidesArr[visibleSlidesArr[i]].style.left = newPos + 'px';
		  	}
		  	slidesArr[visibleSlidesArr[visibleSlidesArr.length-1]].style.display = "none";
			visibleSlidesArr.pop();
			releaseTransitionLock()
		});
		
	}
	function slideNextHandler() {
		if (!acquireTransitionLock()) {
			return;
		}

		slidesArr[currentIndex].className = slidesArr[currentIndex].className.replace('active', '');
		currentIndex = getNextSlideIndex();
		slidesArr[currentIndex].className += slidesArr[currentIndex].className ? ' active' : 'active';
		var nextIndex = getNextSlideIndex(); // The next one we're pushing to the array
		visibleSlidesArr.push(nextIndex);
		slidesArr[nextIndex].style.left = (1.5*slideWidth+offset) + 'px';
		slidesArr[nextIndex].style.display = "inline-block";
		var animObj = slidesWrapElem.animate([{transform: 'translate(0)'},
										{transform: 'translate(' + -slideWidth + 'px, 0px)'}
										], {duration:slideTransDuration, easing:'ease-out'});
		animObj.addEventListener('finish', function(e) {
			var newPos;
			for (i = 0; i < visibleSlidesArr.length; i++) {
				newPos = Number(slidesArr[visibleSlidesArr[i]].style.left.replace("px", "")) - slideWidth;
		  		slidesArr[visibleSlidesArr[i]].style.left = newPos + 'px';
		  	}
		  	slidesArr[visibleSlidesArr[0]].style.display = "none";
			visibleSlidesArr.shift();
			releaseTransitionLock();
		});
		
	}

	function acquireTransitionLock() {
		if (transitionLocked) {
			return false;
		}
		else {
			transitionLocked=true;
			return true;
		}
	}

	function releaseTransitionLock() {
		transitionLocked=false;
	}

	
	window.onload = function() {
		window.addEventListener('resize', windowResizeHandler, true);
		document.getElementById('sp-carousel-prev-btn').addEventListener('click', slidePrevHandler, true);
		document.getElementById('sp-carousel-next-btn').addEventListener('click', slideNextHandler, true);
		spCarousel.init();
	};

	return spCarousel;
}(spCarousel));