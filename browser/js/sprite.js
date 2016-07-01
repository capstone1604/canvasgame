(function() {
    function Sprite(url, pos, size, speed, frames, dir, selectable) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.selectable = selectable; //selectable if not another player's unit
        this.selected = false;
    };

    Sprite.prototype = {

        renderEllipse: function(){
            ctx.beginPath();
            ctx.ellipse(this.pos[0] + this.size[0]/2, this.pos[1] + this.size[1], this.size[1]/3, this.size[1]/5, 0, 0, Math.PI*2);
            ctx.fillStyle = this.selected ? "rgba(0, 0, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";
            ctx.fill();
            ctx.closePath();
        },

        render: function(ctx, playerId, type) {
            var frame;

            if(playerId === currentKing && type === 'hero') {
                this.url = 'img/king.png';
                this.size = [34, 50];
                this.frames = [0, 1, 2, 3];
                this.speed = 10;
            }
            else if (type === 'hero'){
                this.url = 'img/hero.png';
                this.size = [46, 81];
                this.frames = [0, 1, 2, 3, 4, 5, 6, 7];
                this.speed = 16;
            }

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

            if (this.selectable) this.renderEllipse();

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
})()

function generateSprite(type, selectable, playerId){
    selectable = selectable || false;

    if (currentKing){
        if (type === 'hero' && playerId === currentKing){
            return new Sprite('img/king.png', [0, 155], [34, 50], 10, [0, 1, 2, 3], 'horizontal', selectable);
        }
    }

    if (type === 'hero' && selectable) {
       return new Sprite('img/hero.png', [0, 0], [46, 81], 16, [0, 1, 2, 3, 4, 5, 6, 7], 'horizontal', selectable);
    } else if (type === 'soldier' && selectable) {
        return new Sprite('img/soldier-asset.png', [0, 0], [64, 64], 1, [0, 1, 2, 3, 4, 5, 6, 7], 'horizontal', selectable);
    } else if(type === 'moneybag'){
        return new Sprite('img/'+ type +'.png', [0,0], [10,25], 1, [-1], false);
    } 
}