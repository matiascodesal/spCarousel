/**
* @file The primary file for the spCarousel module.
* spCarousel is a image media carousel that gives end-users a sneak peak of
* upcoming images to promote curiosity, intrigue, and engagement. This library
* follows the Module Pattern: {@link http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html}
* @module
* @author Matias Codesal
* @version 1.2.0
* @copyright Matias Codesal 2016
*/

/**
 * The global module object/namespace for spCarousel.  Uses an existing
 * object if it exists or creates a new one.
 * @global
 * @namespace
 */
var spCarousel = spCarousel || {};

/**
 * Anonymous closure and function that provides privacy and state for the 
 * application.  We inject the spCarousel namespace, set up all of the business 
 * logic, and then return the same modified namespace.
 * @function
 * @name  AnonymousClosure
 * @param {module} spCarousel - the global module namespace
 * @return {module} spCarousel - Returns the injected module object.
 */
(function (spCarousel) {
		var currentIndex = 0;
		var slidesArr = [];
		var visibleSlidesArr = [];
		var loadingElem, frameElem, slidesWrapElem, prevButton, nextButton;
		var frameWidth, frameHeight, frameMaxWidth, slideWidth, slideHeight, 
				slidesWrapWidth, slidesWrapHeight, imgRatio, sideWidth;
		var offset;
		var slideTransDuration = 500;
		var transitionLocked = false;
		// @todo make the config publicly accessible to allow for user configuration
		var config = {defaultButtons:true, autoplay:false, slideInterval:4000};
		var slideTimer;

		/**
		 * Calculates dimensions of the carousel based on the styling of the frame
		 * and the aspect ratio of the source images.
		 * @method spCarousel~calculateDimensions
		 * @private
		 */
		function calculateDimensions() {
			// Getting computed style give use the actual computed maxHeight
			var frameElemStyles = getComputedStyle(frameElem, null);
			// The carousel is responsive, but sometimes we want to lock at a
			// max height.
			var tmpMaxHeight = frameElemStyles.maxHeight.replace("px", "");
			imgRatio = slidesArr[0].children[0].naturalWidth / slidesArr[0].children[0].naturalHeight;
			frameWidth = frameElem.offsetWidth;
			/*
			1.5 gives us a frame width that is 1.5 the image length.  This allows
			for a full width center image plus two quarter length side images
			@example <caption> Carousel with 12 unit center and 3 unit bookends</caption>
			|---|------------|---|
			|	|			 |   |
			| 3 |	12 units | 3 |
			|	|			 |   |
			|---|------------|---|
			 */
			frameHeight = frameWidth / imgRatio / 1.5;
			frameMaxWidth = null;
			/*
			If the use has set a maxHeight from the frame and we've exceeded it,
			set height to maxHeight and calculate width off of that and the 
			image aspect ratio.
			 */
			if (tmpMaxHeight != undefined
					&& Number(tmpMaxHeight) <= frameHeight){
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

		/**
		 * Sets up and initializes the carousel.  Calculates size, populates the
		 * carousel and draws it on the DOM.
		 * @method spCarousel.init
		 * @public
		 */
		spCarousel.init = function(userConfig) {
				clear();
				if (!(userConfig === undefined)) {
					for (var attrname in userConfig) { 
						config[attrname] = userConfig[attrname]; 
					}
				}

				createStyling();
				loadingElem = document.getElementsByClassName('sp-loading')[0];
				loadingElem.style.display = "none";
				frameElem = document.getElementsByClassName('sp-carousel-frame')[0];
				if (frameElem == undefined) {
					console.log('No element found using sp-carousel-frame class.');
					return;
				}
				spCarousel.frameElem = frameElem;
				spCarousel.test = frameElem;
				slidesWrapElem = document.getElementsByClassName('sp-carousel-inner')[0];
				slidesArr = slidesWrapElem.children;

				window.addEventListener('resize', windowResizeHandler, true);
				// Disabled autoplay sliding because it caused some erratic behavior.
				// @todo renable autoplay sliding
				if(config.autoplay) {
					spCarousel.startSlideTimer();
					frameElem.addEventListener('mouseenter', spCarousel.stopSlideTimer, true);
					frameElem.addEventListener('mouseout', spCarousel.startSlideTimer, true);
				}
				calculateDimensions();
				validateSlidesArrayLength();
				populateVisibleSlides();
				if (!hasClass(slidesArr[0], 'sp-active')) {
					slidesArr[0].className += slidesArr[0].className ? ' sp-active' : 'sp-active';
				}
				drawSlides();
				if (config.defaultButtons) {
					addButtons();
				}
				
		};

		/**
		 * Reset spCarousel components as possible.  Using this to clear the
		 * carousel before reinitializing.
		 * @method spCarousel~clear
		 * @private
		 */
		function clear() {
			buttons = document.getElementsByClassName('sp-carousel-condtrol-default');
			while(buttons.length > 0) { 
				buttons[0].parentNode.removeChild(buttons[0]);
			}

			window.removeEventListener("resize", windowResizeHandler);
			if(frameElem) {
				frameElem.removeEventListener("mouseenter", spCarousel.stopSlideTimer);
				frameElem.removeEventListener("mouseout", spCarousel.startSlideTimer);
			}

			var nodes = document.getElementsByClassName('sp-carousel-frame')[0].getElementsByTagName('*');
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].removeAttribute('style');
			}
		}

		/**
		 * Starts the carousel auto slide timer
		 * @method spCarousel.startSlideTimer
		 * @public
		 */
		spCarousel.startSlideTimer = function() {
			slideTimer = setInterval(slideNextHandler, config.slideInterval);
		}

		/**
		 * Stops the carousel auto slide timer if it exists.
		 * @method spCarousel.stopSlideTimer
		 * @public
		 */
		spCarousel.stopSlideTimer = function() {
			if (slideTimer) {
				clearTimeout(slideTimer);
			}
		}

		/**
		 * Get the index of the the next slide to be pushed from the left.
		 * @method spCarousel~getPrevSlideIndex
		 * @private
		 */
		function getPrevSlideIndex() {
				if (currentIndex == 0) {
						return (slidesArr.length - 1);
				}
				else {
						return (currentIndex - 1);
				}
		}

		/**
		 * Get the index of the the next slide to be pushed from the right.
		 * @method spCarousel~getNextSlideIndex
		 * @private
		 */
		function getNextSlideIndex() {
				if (currentIndex == slidesArr.length - 1) {
						return 0;
				}
				else {
						return (currentIndex + 1);
				}
		}

		/**
		 * Validates that the carousel has at least 3 items.  Throws an error
		 * alert otherwise.
		 * @method spCarousel~validateSlidesArrayLength
		 * @private
		 */
		function validateSlidesArrayLength() {
			if (slidesArr.length < 3) {
						alert("[Error] Carousel must contain at least 3 images");
			}
		}

		/**
		 * Copy the first 3 indices that will be shown on the carousel to their
		 * own "visible" array.
		 * @method spCarousel~populateVisibleSlides
		 * @private
		 */
		function populateVisibleSlides() {
				visibleSlidesArr = [];
				visibleSlidesArr.push(slidesArr.length - 1);
				visibleSlidesArr.push(0);
				visibleSlidesArr.push(1);
		}

		/**
		 * Create and setup buttons for controlling carousel sliding left/right.
		 * @method spCarousel~addButtons
		 * @private
		 */
		function addButtons() {
				prevButton = document.createElement('button');
				prevButton.style.left = '0px';
				prevButton.style.height = frameHeight + 'px';
				prevButton.style.width = bookEndWidth + 'px';
				prevButton.className += prevButton.className ? ' sp-carousel-control sp-carousel-condtrol-default sp-carousel-control-prev' : 'sp-carousel-control sp-carousel-condtrol-default sp-carousel-control-prev';
				prevArrow = document.createElement('div');
				prevArrow.style.left = bookEndWidth/3 + 'px';
				prevArrow.style.height = prevArrow.style.width = bookEndWidth/4 + 'px';
				prevArrow.className += prevArrow.className ? ' sp-carousel-arrow-left' : 'sp-carousel-arrow-left';
				prevButton.appendChild(prevArrow);
				nextButton = document.createElement('button');
				nextButton.style.right = '0px';
				nextButton.style.height = frameHeight + 'px';
				nextButton.style.width = bookEndWidth + 'px';
				nextButton.className += nextButton.className ? ' sp-carousel-control sp-carousel-condtrol-default sp-carousel-control-next' : 'sp-carousel-control sp-carousel-condtrol-default sp-carousel-control-next';
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

		/**
		 * Draws the carousel slides by setting the dimensions, position, and
		 * visibility styles of each slide.
		 * @method spCarousel~drawSlides
		 * @private
		 */
		function drawSlides() {
				frameElem.style.height = frameHeight + 'px';
				if(frameMaxWidth) {
					frameElem.style.maxWidth = frameMaxWidth + 'px';
				}
				else {
					frameElem.style.maxWidth = '';
				}
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

		/**
		 * Window resize callback function to resize the carousel.  The allows
		 * for a fully responsive carousel.
		 * @method spCarousel~windowResizeHandler
		 * @private
		 */
		function windowResizeHandler() {
				calculateDimensions();
				prevButton.style.height = nextButton.style.height = frameHeight + 'px';
				prevButton.style.width = nextButton.style.width = bookEndWidth + 'px';
				prevButton.children[0].style.left = nextButton.children[0].style.left = bookEndWidth/3 + 'px';
				prevButton.children[0].style.height = prevButton.children[0].style.width = nextButton.children[0].style.height = nextButton.children[0].style.width = bookEndWidth/4 + 'px';
				drawSlides();
		}

		/**
		* Event callback that handles sliding the carousel to the left.  Adds a
		* new item to the right of the visible array and pops off the left-most
		* item after sliding.
		* @method spCarousel~slidePrevHandler
		* @param {event} e - Event Object that triggered this function.
		* @private
		*/
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
						var endIndexOffset = 0;
						// For 3 item carousels, the first and last indices are
						// the same element.  We should skip the last element
						// to avoid double transformations.  Causes the last element
						// to pop off screen, but it's not that noticable.
						// #3itemhack
						if (slidesArr.length <= 3) {
							var endIndexOffset = -1;
						}
						for (i = 0; i < visibleSlidesArr.length+endIndexOffset; i++) {
								newPos = Number(slidesArr[visibleSlidesArr[i]].style.left.replace("px", "")) + slideWidth;
								slidesArr[visibleSlidesArr[i]].style.left = newPos + 'px';
						}
						// If we have more than 3 slides, hide the slide that
						// that has moved off view.  If there are only 3, no hiding
						// should take place because we're always using the same
						// 3 elements.
						// #3itemhack
						if (slidesArr.length > 3) {
							slidesArr[visibleSlidesArr[visibleSlidesArr.length-1]].style.display = "none";
						}
						visibleSlidesArr.pop();
						releaseTransitionLock()
				});
				
		}

		/**
		* Event callback that handles sliding the carousel to the right.  Adds a
		* new item to the left of the visible array and pops off the right-most
		* item after sliding.
		* @method spCarousel~slideNextHandler
		* @param {event} e - Event Object that triggered this function.
		* @private
		*/
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
				/*
				The animObj does the pretty slide tranformation, but the finish
				callback sets the permanent final position of the images.
				 */
				animObj.addEventListener('finish', function(e) {
						var newPos;
						var startIndex = 0;
						// For 3 item carousels, the first and last indices are
						// the same element.  We should skip the first element
						// to avoid double transformations.  Causes the first element
						// to pop off screen, but it's not that noticable.
						// #3itemhack
						if (slidesArr.length <= 3) {
							startIndex = 1;
						}
						for (i = startIndex; i < visibleSlidesArr.length; i++) {
								newPos = Number(slidesArr[visibleSlidesArr[i]].style.left.replace("px", "")) - slideWidth;
								slidesArr[visibleSlidesArr[i]].style.left = newPos + 'px';
						}
						// If we have more than 3 slides, hide the slide that
						// that has moved off view.  If there are only 3, no hiding
						// should take place because we're always using the same
						// 3 elements.
						// #3itemhack
						if (slidesArr.length > 3) {
							slidesArr[visibleSlidesArr[0]].style.display = "none";
						}
						visibleSlidesArr.shift();
						releaseTransitionLock();
				});
				
		}

		/**
		 * Acquire the lock to be able to execute transition animations.
		 * @method spCarousel~acquireTransitionLock
		 * @private
		 */
		function acquireTransitionLock() {
				if (transitionLocked) {
						return false;
				}
				else {
						transitionLocked=true;
						return true;
				}
		}

		/**
		 * Release the lock so another transition animation is allows to execute.
		 * @method spCarousel~releaseTransitionLock
		 * @private
		 */
		function releaseTransitionLock() {
				transitionLocked=false;
		}

		
		/**
		 * Initialize the carousel once the window has loaded.
		 * @private
		 */
		window.onload = function() {
				spCarousel.init();
		};

		/**
		 * Check if the given class exists on the given element.
		 * @method spCarousel~hasClass
		 * @param {DOMElement} element - Element to perform check on.
		 * @param {string} cls - The name of the CSS class to check for.
		 * @private
		 */
		function hasClass(element, cls) {
		    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
		}

		/**
		 * Does the heavy lifting for dynamically creating a CSS stylesheet using
		 * Javascript.
		 * @method spCarousel~createCSSSelector
		 * @param {string} selector - The CSS selector to create the style for.
		 * @param {string} style - The styling to be applied.
		 * @private
		 */
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

		/**
		 * Default styling to give the carousel its shape and form.  This method
		 * sparse having to deploy a CSS file and makes this a single JS file to
		 * download and include.
		 * @method spCarousel~createStyling
		 * @private
		 */
		function createStyling(){
			createCSSSelector('.sp-carousel-control', 'display:inline-block;position:absolute;opacity:0.5;background-color:transparent;border:0;cursor:pointer;-webkit-transition:opacity 0.5s;-moz-transition:opacity 0.5s;-o-transition:opacity 0.5s;transition:opacity 0.5s;');
			createCSSSelector('.sp-carousel-control:hover', 'opacity:0.9;');
			createCSSSelector('.sp-carousel-control:focus', 'outline:none;');
			createCSSSelector('.sp-carousel-control-prev', "background-image: -webkit-linear-gradient(left,rgba(0,0,0,0.5) 0,rgba(0,0,0,0.0001) 100%);background-image: -o-linear-gradient(left,rgba(0,0,0,0.5) 0,rgba(0,0,0,0.0001) 100%);background-image: linear-gradient(to right,rgba(0,0,0,0.5) 0,rgba(0,0,0,0.0001) 100%);background-repeat: repeat-x;filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000',endColorstr='#00000000',GradientType=1)");
			createCSSSelector('.sp-carousel-control-next', "background-image: -webkit-linear-gradient(left,rgba(0,0,0,0.0001) 0,rgba(0,0,0,0.5) 100%);background-image: -o-linear-gradient(left,rgba(0,0,0,0.0001) 0,rgba(0,0,0,0.5) 100%);background-image: linear-gradient(to right,rgba(0,0,0,0.0001) 0,rgba(0,0,0,0.5) 100%);background-repeat: repeat-x;filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000',endColorstr='#80000000',GradientType=1);");
			createCSSSelector('.sp-carousel-arrow-left', 'transform: rotate(-45deg);position: absolute;border-top: 5px solid white;border-left: 5px solid white;');
			createCSSSelector('.sp-carousel-arrow-right', 'transform: rotate(45deg);position: absolute;border-top: 5px solid white;border-right: 5px solid white;');
			createCSSSelector('.sp-carousel-frame', 'display:block;position:relative;overflow:hidden;opacity:1!important;'); // users should set opacity to 0 to hide frame until JS loads.
			createCSSSelector('.sp-carousel-inner', 'display:block;position:relative');
			createCSSSelector('.sp-carousel-item', 'display:inline-block;position:absolute;height:auto;');
			createCSSSelector('.sp-carousel-item img', 'width:100%;opacity:0.4;-webkit-transition:opacity 0.5s;-moz-transition:opacity 0.5s;-o-transition:opacity 0.5s;transition:opacity 0.5s;');
			createCSSSelector('.sp-active img', 'opacity:1;'); //has to go second so it trumps .sp-carousel-item
			createCSSSelector('.sp-hide', 'opacity:0;');
			
		}


		return spCarousel;
}(spCarousel));