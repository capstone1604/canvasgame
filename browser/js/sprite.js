
(function() {
    function Sprite(url, pos, size, speed, frames, dir, otherplayersunit) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.otherplayersunit = otherplayersunit;
        this.selected = false;
    };

    Sprite.prototype = {

        update: function() {
            if (rightClick.x && rightClick.y && this.selected){
                // this._index += 0.25;
            }
        },

        renderEllipse: function(){
            ctx.beginPath();
            ctx.ellipse(this.pos[0] + this.size[0]/8, this.pos[1] + this.size[1]/4, this.size[1]/10, this.size[1]/20, 0, 0, Math.PI*2);
            ctx.fillStyle = this.selected ? "rgba(0, 0, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";
            ctx.fill();
            ctx.closePath();
        },

        render: function(ctx) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }

            if(!this.otherplayersunit) this.renderEllipse();

            if (frame === -1) {
                ctx.drawImage(resources.get(this.url),
                         x, y);
            } else {
                ctx.drawImage(resources.get(this.url),
                         x, y,
                         this.size[0], this.size[1],
                         0, 0,
                         this.size[0], this.size[1]);
            }
        }
    };

    window.Sprite = Sprite;
})();