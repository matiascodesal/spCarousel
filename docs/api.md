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
<a name="spCarousel.init"></a>

### spCarousel.init()
Sets up and initializes the carousel.  Calculates size, populates thecarousel and draws it on the DOM.

**Kind**: static method of <code>[spCarousel](#spCarousel)</code>  
**Access:** public  
