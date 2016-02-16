var spCarousel = spCarousel || {};
(function (spCarousel) {
		var currentIndex = 0;
		var slidesArr = [];
		var visibleSlidesArr = [];
		var frameElem, slidesWrapElem, prevButton, nextButton;
		var frameWidth, frameHeight, frameMaxWidth, slideWidth, slideHeight, 
				slidesWrapWidth, slidesWrapHeight, imgRatio, sideWidth;
		var offset;
		var slideTransDuration = 500;
		var transitionLocked = false;
		var config = {defaultButtons:true}
		var slideTimer;

		function calculateDimensions() {
			var frameElemStyles = getComputedStyle(frameElem, null);
			var tmpMaxHeight = frameElemStyles.maxHeight.replace("px", "");
			imgRatio = slidesArr[0].children[0].naturalWidth / slidesArr[0].children[0].naturalHeight;
			frameWidth = frameElem.offsetWidth;
			frameHeight = frameWidth / imgRatio / 1.5;
			frameMaxWidth = null;
			if (tmpMaxHeight != undefined
					&& Number(tmpMaxHeight) < frameHeight){
				frameHeight = Number(tmpMaxHeight);
				frameWidth = frameHeight * imgRatio * 1.5;
				frameMaxWidth = frameWidth;
			}
			slideWidth = frameWidth / 1.5;
			slideHeight = frameHeight;
			slidesWrapWidth = 4 * slideWidth;
			slidesWrapHeight = frameHeight;
			bookEndWidth = (frameWidth-slideWidth)/2
			offset = slideWidth - bookEndWidth;
		}

		spCarousel.init = function() {
				createStyling();
				frameElem = document.getElementsByClassName('sp-carousel-frame')[0];
				spCarousel.frameElem = frameElem;
				spCarousel.test = frameElem;
				slidesWrapElem = document.getElementsByClassName('sp-carousel-inner')[0];
				slidesArr = slidesWrapElem.children;

				window.addEventListener('resize', windowResizeHandler, true);
				//slideTimer = setInterval(slideNextHandler, 4000);
				//frameElem.addEventListener('mouseenter', function() {if (slideTimer) {clearTimeout(slideTimer);}}, true);
				//frameElem.addEventListener('mouseout', function() {slideTimer = setInterval(slideNextHandler, 4000);}, true);
				calculateDimensions();
				populateVisibleSlides();
				drawSlides();
				if (config.defaultButtons) {
					addButtons();
				}
				
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
		function addButtons() {
				prevButton = document.createElement('button');
				prevButton.style.left = '0px';
				prevButton.style.height = frameHeight + 'px';
				prevButton.style.width = bookEndWidth + 'px';
				prevButton.className += prevButton.className ? ' sp-carousel-control sp-carousel-control-prev' : 'sp-carousel-control sp-carousel-control-prev';
				prevArrow = document.createElement('div');
				prevArrow.style.left = bookEndWidth/3 + 'px';
				prevArrow.style.height = prevArrow.style.width = bookEndWidth/4 + 'px';
				prevArrow.className += prevArrow.className ? ' sp-carousel-arrow-left' : 'sp-carousel-arrow-left';
				prevButton.appendChild(prevArrow);
				nextButton = document.createElement('button');
				nextButton.style.right = '0px';
				nextButton.style.height = frameHeight + 'px';
				nextButton.style.width = bookEndWidth + 'px';
				nextButton.className += nextButton.className ? ' sp-carousel-control sp-carousel-control-next' : 'sp-carousel-control sp-carousel-control-next';
				nextArrow = document.createElement('div');
				nextArrow.style.left = bookEndWidth/3 + 'px';
				nextArrow.style.height = nextArrow.style.width = bookEndWidth/4 + 'px';
				nextArrow.className += nextArrow.className ? ' sp-carousel-arrow-right' : 'sp-carousel-arrow-right';
				nextButton.appendChild(nextArrow);
				frameElem.appendChild(prevButton);
				frameElem.appendChild(nextButton);
				prevButton.addEventListener('click', slidePrevHandler, true);
				nextButton.addEventListener('click', slideNextHandler, true);
		}

		function drawSlides() {
				frameElem.style.height = frameHeight + 'px';
				frameElem.style.maxWidth = frameMaxWidth + 'px';
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
				prevButton.style.height = nextButton.style.height = frameHeight + 'px';
				prevButton.style.width = nextButton.style.width = bookEndWidth + 'px';
				prevButton.children[0].style.left = nextButton.children[0].style.left = bookEndWidth/3 + 'px';
				prevButton.children[0].style.height = prevButton.children[0].style.width = nextButton.children[0].style.height = nextButton.children[0].style.width = bookEndWidth/4 + 'px';
				drawSlides();
		}

		function slidePrevHandler(e) {
				if (!acquireTransitionLock()) {
						return;
				}

				slidesArr[currentIndex].className = slidesArr[currentIndex].className.replace('sp-active', '');
				currentIndex = getPrevSlideIndex();
				slidesArr[currentIndex].className += slidesArr[currentIndex].className ? ' sp-active' : 'sp-active';
				var prevIndex = getPrevSlideIndex(); // The next one we're pushing to the array
				visibleSlidesArr.unshift(prevIndex);
				slidesArr[prevIndex].style.left = (-slideWidth-offset) + 'px';
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
		function slideNextHandler(e) {
				if (!acquireTransitionLock()) {
						return;
				}

				slidesArr[currentIndex].className = slidesArr[currentIndex].className.replace('sp-active', '');
				currentIndex = getNextSlideIndex();
				slidesArr[currentIndex].className += slidesArr[currentIndex].className ? ' sp-active' : 'sp-active';
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
				spCarousel.init();
		};

		function createCSSSelector(selector, style) {
			if (!document.styleSheets) {return;}

			if (document.getElementsByTagName('head').length == 0) {return;}

			var stylesheet,mediaType;

			if (document.styleSheets.length > 0) {
				for (i = 0; i < document.styleSheets.length; i++) {
					if (document.styleSheets[i].disabled) {continue;}
					var media = document.styleSheets[i].media;
					mediaType = typeof media;

					if (mediaType=='string'){
						if (media=='' || (media.indexOf('screen')!=-1)) {
							styleSheet = document.styleSheets[i];
						}
				 	}
				 	else if (mediaType=='object') {
						if (media.mediaText=='' || (media.mediaText.indexOf('screen')!=-1)) {
							styleSheet = document.styleSheets[i];
						}
				 	}

				 	if (typeof styleSheet!='undefined') {break;}
				}
			}

			if (typeof styleSheet=='undefined') {
				var styleSheetElement = document.createElement('style');
				styleSheetElement.type = 'text/css';
				document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

				for (i = 0; i < document.styleSheets.length; i++) {
					if (document.styleSheets[i].disabled) {continue;}
			 		styleSheet = document.styleSheets[i];
				}

				var media = styleSheet.media;
				mediaType = typeof media;
		 	}

		 	if (mediaType=='string') {
				for (i = 0; i < styleSheet.rules.length; i++) {
			 		if(styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase()==selector.toLowerCase()) {
						styleSheet.rules[i].style.cssText = style;
						return;
			 		}
				}

				styleSheet.addRule(selector,style);
		 	}
		 	else if (mediaType=='object') {
				var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;

				for (i = 0; i < styleSheetLength; i++) {
			 		if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
						styleSheet.cssRules[i].style.cssText = style;
						return;
			 		}
				}

				styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
		 	}
		}

		function createStyling(){
			createCSSSelector('.sp-carousel-control', 'display:inline-block;position:absolute;opacity:0.5;background-color:transparent;border:0;cursor:pointer;-webkit-transition:opacity 0.5s;-moz-transition:opacity 0.5s;-o-transition:opacity 0.5s;transition:opacity 0.5s;');
			createCSSSelector('.sp-carousel-control:hover', 'opacity:0.9;');
			createCSSSelector('.sp-carousel-control:focus', 'outline:none;');
			createCSSSelector('.sp-carousel-control-prev', "background-image: -webkit-linear-gradient(left,rgba(0,0,0,0.5) 0,rgba(0,0,0,0.0001) 100%);background-image: -o-linear-gradient(left,rgba(0,0,0,0.5) 0,rgba(0,0,0,0.0001) 100%);background-image: linear-gradient(to right,rgba(0,0,0,0.5) 0,rgba(0,0,0,0.0001) 100%);background-repeat: repeat-x;filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000',endColorstr='#00000000',GradientType=1)");
			createCSSSelector('.sp-carousel-control-next', "background-image: -webkit-linear-gradient(left,rgba(0,0,0,0.0001) 0,rgba(0,0,0,0.5) 100%);background-image: -o-linear-gradient(left,rgba(0,0,0,0.0001) 0,rgba(0,0,0,0.5) 100%);background-image: linear-gradient(to right,rgba(0,0,0,0.0001) 0,rgba(0,0,0,0.5) 100%);background-repeat: repeat-x;filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000',endColorstr='#80000000',GradientType=1);");
			createCSSSelector('.sp-carousel-arrow-left', 'transform: rotate(-45deg);position: absolute;border-top: 5px solid white;border-left: 5px solid white;');
			createCSSSelector('.sp-carousel-arrow-right', 'transform: rotate(45deg);position: absolute;border-top: 5px solid white;border-right: 5px solid white;');
			createCSSSelector('.sp-carousel-frame', 'display:block;position:relative;overflow:hidden');
			createCSSSelector('.sp-carousel-inner', 'display:block;position:relative');
			createCSSSelector('.sp-carousel-item', 'display:inline-block;position:absolute;height:auto;');
			createCSSSelector('.sp-carousel-item > img', 'width:100%;opacity:0.4;-webkit-transition:opacity 0.5s;-moz-transition:opacity 0.5s;-o-transition:opacity 0.5s;transition:opacity 0.5s;');
			createCSSSelector('.sp-active > img', 'opacity:1;'); //has to go second so it trump .sp-carousel-item
			
		}


		return spCarousel;
}(spCarousel));