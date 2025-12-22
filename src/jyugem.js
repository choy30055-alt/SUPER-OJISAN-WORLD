//
//ジュゲムのクラス
//
class Jyugem {
    constructor(sp, x, y, vx, vy, tp) {
        this.sp = sp;
        this.x = x<<8;
        this.y = y<<8;
        this.ay = 0; 
        this.w = 16;
        this.h = 16;
        this.vx = vx;
        this.vy = vy;
        this.sz = 0;
        this.anim = 0;
        this.snum = 0;
        this.kill = false;
        //this.count = 0;
        this.acou = 0;   
        if(tp == undefined) tp = ITEM_JYUGEM;
        this.tp = tp;
        this.hasDorpped = false;
    }

    //更新処理
    update() {
        if(this.kill) return;
        if(this.proc_jyugem()) return;
  
        this.x += this.vx;
        if(this.x > SCREEN_SIZE_W * 200 || this.x < 0) {
            this.vx *= -1;  //折り返しの座標を指定
        }
 
        this.acou++;  //アニメ用のカウンタ
        if(Math.abs(this.vx) == MAX_SPEED) this.acou++; 
        this.updateAnim();
    }

    //描画処理
    draw() {
        let an = this.sp;
        let sx = (an&15)<<4;
        let sy = (an>>4)<<4;
        let px = (this.x>>4) - (field.scx);
        let py = (this.y>>4) - (field.scy);
        let s;
        if(this.sz) s = this.sz;
        else s = 32;
        vcon.drawImage(chImg, sx, sy, 16, s, px, py, 16, 16);
    }

    //当たり判定　Ｘ軸が重なったか
    checkDrop() {
        return(this.x >= ojisan.x && this.x <= ojisan.x + ojisan.w);
    }

    proc_jyugem() {
        if(this.checkDrop()) {
            if(!this.hasDorpped) {
                if(Math.random() < 0.1) {
                    jyugemSound.play();
                    togezo.push(new Togezo(106, this.x>>8, this.y>>8, 12, 0, ITEM_TOGEZO));
                    this.hasDorpped = true;
                }
            } else {
                this.hasDorpped = false;
            }
        }
    }
  
    updateAnim() {
        //アニメスプライトの決定
        if(this.tp == ITEM_JYUGEM) {
            this.sp = 137;
            if(this.vx < 0) {
                this.sp = 169;
            }  
        }      
    }

    
}
