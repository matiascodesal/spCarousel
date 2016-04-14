### Generate jsDocs HTML
[link](http://usejsdoc.org/index.html)  
npm install -g jsdoc  
jsdoc --private -r -d docs .  

### Generate jsDocs MarkDown (github md)
[link](https://github.com/jsdoc2md/jsdoc-to-markdown)  
npm install -g jsdoc-to-markdown  
jsdoc2md --private src/spcarousel.js > api.md  
