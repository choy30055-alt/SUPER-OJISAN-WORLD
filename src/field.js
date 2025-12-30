//
//フィールドクラス
//

class Field{
    constructor(){
        this.scx = 0;
        this.scy = 0;
        this.fieldData = null;
        this.blType = null;
    }

    loadMap(map) {
        this.fieldData = map.fieldData;
        this.blType = map.blType;
        this.scx = 0;
        this.scy = 0;
    }

    //更新処理
    update() {
        if((ojisan.x>>4) > field.scx + 128) {
            field.scx = (ojisan.x>>4) -128;
        }
        if((ojisan.x>>4) < field.scx) {
            field.scx = (ojisan.x>>4)-96;
        }
    }

    //描画処理
    draw() {
        for(let y = 0; y < MAP_SIZE_H + 1; y++) {
            for(let x = 0; x < MAP_SIZE_W + 1; x++) {
                let sx = x + (this.scx>>4);
                let sy = y + (this.scy>>4);
                let bl = this.fieldData[sy * FIELD_SIZE_W + sx];
                let px = x * 16 - (this.scx&15);
                let py = y * 16 - (this.scy&15);
                if(bl >= 0) this.drawBlock(bl, px, py);
            }
        }
    }

    //ブロックかどうか返す
    isBlock(x, y) {
        let bl = this.fieldData[(y>>4) * FIELD_SIZE_W + (x>>4)];
        if(bl < 368) return 0;
        return this.blType[bl - 368] == 1?bl: 0;
    }

    //ブロックかどうか返す
    isUnblock(x, y) {
        let bl = this.fieldData[(y>>4) * FIELD_SIZE_W + (x>>4)];
        if(bl < 368) return 1;
        return this.blType[bl - 368] == 1?bl: 0;
    }
  
    //ブロック一つ描画
    drawBlock(bl, px, py) {
        const anim = [0, 1, 2, 1, 0] ;
        if(bl == 368) bl += anim[(frameCount>>3)% 5];
        if(bl == 496) bl += anim[(frameCount>>3)% 5];
        let sx = (bl&15)<<4;
        let sy = (bl>>4)<<4;
        vcon.drawImage(chImg, sx, sy, 16, 16, px, py, 16, 16);
    }
}