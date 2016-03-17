/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 * local image file previewer (useful for before-upload visual validation).
 * Works still to be done to be really reusable. Specifically for image fitting.
 */

var Previewer = function(opt) {
    this.initialised = false;
    this.image = null;
};

Previewer.prototype = {
    init: function(canvas) {
        if (this.initialised)
            return this;
        this.initialised = true;
        // creating canvas object
        var canvas = (typeof canvas === 'string' ? document.querySelector(canvas) : canvas);
        if (!canvas || !canvas.getContext)
            return this;
        var ctx = canvas.getContext('2d');

        // drawing active image
        var image = this.image = new Image();
        image.onload = function() {
            canvas.setAttribute('width', canvas.parentNode.clientWidth)
            if (image.width < image.height) {
                width = canvas.width;
                factor = width / image.width;
                height = image.height * factor;
            } else {
                height = canvas.height;
                factor = height / image.height;
                width = image.width * factor;
            }
            canvas.setAttribute('height', height);
            var shiftX = (width - canvas.width) / 2;
            var shiftY = (height - canvas.height) / 2;

            ctx.drawImage(image, -shiftX, -shiftY, width, height); // draw the image on the canvas
        };
        return this;
    },

    preview: function(url) {
        if (!this.image)
            return this;
        var image = this.image,
            reader = new FileReader();
        reader.readAsDataURL(url);
        reader.onload = function(event) {
            var imgsize = event.target.result.length / 1300; //Mb
            // console.log("Image size (Mb) ", imgsize);
            if (imgsize > 10000) {
                alert("Image is too big !");
                return;
            };
            image.src = event.target.result;
        };
        return this;
    }
};

module.exports = Previewer;
