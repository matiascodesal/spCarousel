## Modules

<dl>
<dt><a href="#spcarousel.module_js">spcarousel.js</a></dt>
<dd><p>The primary file for the spCarousel module.
spCarousel is a image media carousel that gives end-users a sneak peak of
upcoming images to promote curiosity, intrigue, and engagement. This library
follows the Module Pattern: <a href="http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html">http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html</a></p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#spCarousel">spCarousel</a> : <code>object</code></dt>
<dd><p>The global module object/namespace for spCarousel.  Uses an existing
object if it exists or creates a new one.</p>
</dd>
</dl>

<a name="spcarousel.module_js"></a>

## spcarousel.js
The primary file for the spCarousel module.spCarousel is a image media carousel that gives end-users a sneak peak ofupcoming images to promote curiosity, intrigue, and engagement. This libraryfollows the Module Pattern: [http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html)

**Version**: 1.0.0  
**Author:** Matias Codesal  
**Copyright**: Matias Codesal 2016  
<a name="spcarousel.module_js..AnonymousClosure"></a>

### spcarousel.js~AnonymousClosure(spCarousel) ⇒ <code>module</code>
Anonymous closure and function that provides privacy and state for the application.  We inject the spCarousel namespace, set up all of the business logic, and then return the same modified namespace.

**Kind**: inner method of <code>[spcarousel.js](#spcarousel.module_js)</code>  
**Returns**: <code>module</code> - spCarousel - Returns the injected module object.  

| Param | Type | Description |
| --- | --- | --- |
| spCarousel | <code>module</code> | the global module namespace |

<a name="spCarousel"></a>

## spCarousel : <code>object</code>
The global module object/namespace for spCarousel.  Uses an existingobject if it exists or creates a new one.

**Kind**: global namespace  

* [spCarousel](#spCarousel) : <code>object</code>
    * _static_
        * [.init()](#spCarousel.init)
    * _inner_
        * [~calculateDimensions()](#spCarousel..calculateDimensions) ℗
        * [~getPrevSlideIndex()](#spCarousel..getPrevSlideIndex) ℗
        * [~getNextSlideIndex()](#spCarousel..getNextSlideIndex) ℗
        * [~validateSlidesArrayLength()](#spCarousel..validateSlidesArrayLength) ℗
        * [~populateVisibleSlides()](#spCarousel..populateVisibleSlides) ℗
        * [~addButtons()](#spCarousel..addButtons) ℗
        * [~drawSlides()](#spCarousel..drawSlides) ℗
        * [~windowResizeHandler()](#spCarousel..windowResizeHandler) ℗
        * [~slidePrevHandler(e)](#spCarousel..slidePrevHandler) ℗
        * [~slideNextHandler(e)](#spCarousel..slideNextHandler) ℗
        * [~acquireTransitionLock()](#spCarousel..acquireTransitionLock) ℗
        * [~releaseTransitionLock()](#spCarousel..releaseTransitionLock) ℗
        * [~hasClass(element, cls)](#spCarousel..hasClass) ℗
        * [~createCSSSelector(selector, style)](#spCarousel..createCSSSelector) ℗
        * [~createStyling()](#spCarousel..createStyling) ℗

<a name="spCarousel.init"></a>

### spCarousel.init()
Sets up and initializes the carousel.  Calculates size, populates thecarousel and draws it on the DOM.

**Kind**: static method of <code>[spCarousel](#spCarousel)</code>  
**Access:** public  
<a name="spCarousel..calculateDimensions"></a>

### spCarousel~calculateDimensions() ℗
Calculates dimensions of the carousel based on the styling of the frameand the aspect ratio of the source images.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
<a name="spCarousel..getPrevSlideIndex"></a>

### spCarousel~getPrevSlideIndex() ℗
Get the index of the the next slide to be pushed from the left.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
<a name="spCarousel..getNextSlideIndex"></a>

### spCarousel~getNextSlideIndex() ℗
Get the index of the the next slide to be pushed from the right.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
<a name="spCarousel..validateSlidesArrayLength"></a>

### spCarousel~validateSlidesArrayLength() ℗
Validates that the carousel has at least 3 items.  Throws an erroralert otherwise.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
<a name="spCarousel..populateVisibleSlides"></a>

### spCarousel~populateVisibleSlides() ℗
Copy the first 3 indices that will be shown on the carousel to theirown "visible" array.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
<a name="spCarousel..addButtons"></a>

### spCarousel~addButtons() ℗
Create and setup buttons for controlling carousel sliding left/right.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
<a name="spCarousel..drawSlides"></a>

### spCarousel~drawSlides() ℗
Draws the carousel slides by setting the dimensions, position, andvisibility styles of each slide.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
<a name="spCarousel..windowResizeHandler"></a>

### spCarousel~windowResizeHandler() ℗
Window resize callback function to resize the carousel.  The allowsfor a fully responsive carousel.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
<a name="spCarousel..slidePrevHandler"></a>

### spCarousel~slidePrevHandler(e) ℗
Event callback that handles sliding the carousel to the left.  Adds anew item to the right of the visible array and pops off the left-mostitem after sliding.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>event</code> | Event Object that triggered this function. |

<a name="spCarousel..slideNextHandler"></a>

### spCarousel~slideNextHandler(e) ℗
Event callback that handles sliding the carousel to the right.  Adds anew item to the left of the visible array and pops off the right-mostitem after sliding.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>event</code> | Event Object that triggered this function. |

<a name="spCarousel..acquireTransitionLock"></a>

### spCarousel~acquireTransitionLock() ℗
Acquire the lock to be able to execute transition animations.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
<a name="spCarousel..releaseTransitionLock"></a>

### spCarousel~releaseTransitionLock() ℗
Release the lock so another transition animation is allows to execute.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
<a name="spCarousel..hasClass"></a>

### spCarousel~hasClass(element, cls) ℗
Check if the given class exists on the given element.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>DOMElement</code> | Element to perform check on. |
| cls | <code>string</code> | The name of the CSS class to check for. |

<a name="spCarousel..createCSSSelector"></a>

### spCarousel~createCSSSelector(selector, style) ℗
Does the heavy lifting for dynamically creating a CSS stylesheet usingJavascript.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | The CSS selector to create the style for. |
| style | <code>string</code> | The styling to be applied. |

<a name="spCarousel..createStyling"></a>

### spCarousel~createStyling() ℗
Default styling to give the carousel its shape and form.  This methodsparse having to deploy a CSS file and makes this a single JS file todownload and include.

**Kind**: inner method of <code>[spCarousel](#spCarousel)</code>  
**Access:** private  
