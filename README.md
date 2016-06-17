# spCarousel
##### *Sneak Peak Carousel*

This is a simple and elegant image carousel delivered as a single JS file.  Just add a few classes to your HTML and the carousel works!  It's called "sneak peak" because it gives the users just a glimpse of the adjacent images.  Just enough to want to see more.

### Screenshot
![spCarousel Screenshot](https://raw.githubusercontent.com/matiascodesal/spCarousel/master/screenshot.jpg "spCarousel Screenshot")

### Basic Setup
1. Source the script
   ```html
   <script src="../src/spcarousel.js"></script>
   ```

2. Add the `sp-carousel-frame` class to a div
   ```html
   <div class="sp-carousel-frame">
   ```
   This class identifies the div that gives the overall, visible dimensions to the carousel.  It has `overflow:hidden` style to provide the cropping effect

3. Add a div inside of the `sp-carousel-frame` div and give it the `sp-carousel-inner` frame
   ```html
   <div class="sp-carousel-inner">
   ```
  Contains the row of images and is wider than the frame so that it gets clipped with `overflow:hidden`.

4. Add how ever many images you want to the `sp-carousel-inner` div using the `sp-carousel-item` class.  A minimum of 3 `sp-carousel-item` elements is required.  
   ```html
   <div class="sp-carousel-item"><img src="images/image1.jpg"/></div>
   ```
5. All together

   ```html
     <div class="sp-carousel-frame sp-carousel-frame-pos">    
       <div class="sp-carousel-inner">   
         <div class="sp-carousel-item"><img src="images/image1.jpg"/></div>   
         <div class="sp-carousel-item"><img src="images/image2.jpg"/></div>   
         <div class="sp-carousel-item"><img src="images/image3.jpg"/></div>   
         <div class="sp-carousel-item"><img src="images/image4.jpg"/></div>   
       </div>   
     </div> 
   ```   

### Advanced Usage
For more advanced usage check out the  
> [wiki](https://github.com/matiascodesal/spCarousel/wiki)  

or take a look at the  

> [API](https://github.com/matiascodesal/spCarousel/wiki/API)  
