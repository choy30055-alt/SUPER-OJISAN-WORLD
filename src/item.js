//
//キノコとかアイテムのクラス
//
class Item extends Sprite {
    constructor(sp, x, y, vx, vy, tp) {
        super(sp, x, y, vx, vy);
        if(tp == undefined) tp = ITEM_KINO;
        this.tp = tp;
    }

    //更新処理
    update() {
        //if (ojisan.isGoal) return; // ゴール演出中は停止
        if(this.kill) return;
        if(ojisan.kinoko) return;

        switch(this.tp) {
            case ITEM_KINO:
                if(this.proc_kinoko()) return;
                break;
            case ITEM_KUSA:
                this.proc_kusa();
                return;
            case ITEM_FIRE:
                this.proc_fire();
                return;
            case ITEM_COIN:
                this.proc_coin();
                return;  
        } 

        this.checkWall();
        this.checkFloor(); 
        this.checkCliff();
        super.update();
        
        this.acou++;  //アニメ用のカウンタ
        if(Math.abs(this.vx) == MAX_SPEED) this.acou++; 
        this.updateAnim();
    }

    draw() {
        super.draw();
        if(this.tp == ITEM_KUSA) {
            let c = (this.count - 16)>>4;
            for(let i = 0; i <= c; i++ ) {
                let an = 486 + 16;
                let sx = (an&15)<<4;
                let sy = (an>>4)<<4;
                let px = (this.x>>4) - (field.scx);
                let py = (this.y>>4) - (field.scy);
                let s;
                if(i == c) s = (this.count%16);
                else s = 16;
                py += 16 + i * 16;
                vcon.drawImage(chImg, sx, sy, 16, s, px, py, 16, s);
            }
        }    
    }

    //横の壁の判定
    checkWall() {
        let lx = ((this.x + this.vx)>>4);
        let ly = ((this.y + this.vy)>>4);
        //左右側のチェック
        if(field.isBlock(lx + 15, ly + 3)  ||
           field.isBlock(lx + 15, ly + 12)||
           field.isBlock(lx, ly + 3)  ||
           field.isBlock(lx, ly + 12)) {
            this.vx *= -1;
        }
    }

    //床の判定
    checkFloor() {
        if(this.vy <= 0) return;
        let lx = ((this.x + this.vx)>>4);
        let ly = ((this.y + this.vy)>>4);
        if(field.isBlock(lx + 1, ly + 15) ||field.isBlock(lx + 14, ly + 15)) {
            this.vy = 0;
            this.y = ((((ly + 15)>>4)<<4) - 16)<<4;
        }
    }

    //崖の判定
    checkCliff() {
        if(this.y <= GROUND_LEVEL) return;
        let nextStepX = (this.x>>4) + (this.vx>>4);
        let checkY = (this.y>>4) + (this.h>>4)+10;
        if(!field.isBlock(nextStepX, checkY)) {
            this.vx *= -1;
        }
    }
    
    //キノコの処理
    proc_kinoko() {
        if(this.checkHit(ojisan)) {
            ojisan.kinoko = 1;
            this.kill = true;
            return true;
        }
        if(++this.count <= 32) {
            itemSound.currentTime = 0; //連続再生
            itemSound.play();
            this.sz = (1 + this.count)>>1;
            this.y -= 1<<3;
            if(this.count == 32) this.vx = 24;
            return true;
        }
        return false;
    }

    //草
    proc_kusa() {
        if(this.y > 0) {
            this.count++;
            if(this.count < 16) this.sz = this.count;
            else this.sz = 16;
            this.y -= 1<<4;
            lvdSound.play();
       }
    }
    
    //ファイアフラワーの処理
    proc_fire() {
        if(this.checkHit(ojisan)) {
            if(ojisan.type == TYPE_MINI){
                ojisan.fire = 0;
                this.kill = false;
                return true;
            }
            ojisan.fire = 1;
            this.kill = true;
            return true;
        }
        if(++this.count <= 32) {
            itemSound.currentTime = 0; //連続再生
            itemSound.play();
            this.sz = (1 + this.count)>>1;
            this.y -= 8;
            this.sp = 253 + ((this.count / 10) % 3);
            return true;
        }
        this.sp = 253 + ((this.count / 10) % 3)
        return false;
    }

    //コインの処理
    proc_coin() {
        if(this.checkHit(ojisan)) {
            ojisan.coinGet =true;
            this.kill = true;
            return true;
        }
        if(++this.count <= 32) {
            this.y -= 10;
            this.sp = 384 + ((this.count / 10) % 3);
            return true;
        }
        this.sp = 384 + ((this.count / 10) % 3);
        return false;
    }

    updateAnim() {
        //アニメスプライトの決定
        if(this.tp == ITEM_COIN) {
            this.sp = 384 + ((this.acou / 10) % 3); //3で割ると0,1,2
        } else if(this.tp == ITEM_FIRE) {
            this.sp = 253 + ((this.acou / 10) % 4); //3で割ると0,1,2
        }
    }  
}
