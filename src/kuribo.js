//クリボクラス
//
class Kuribo {
    constructor(sp, x, y, vx, vy, tp) {
        this.sp = sp;
        this.x = x<<8;
        this.y = y<<8;
        this.ay = 0; 
        this.w =16;
        this.h =16;
        this.vx = vx;
        this.vy = vy;
        this.sz = 0;
        this.anim = 0;
        this.snum = 0;
        this.kill = false;
        this.count = 0;
        this.acou = 0;   
        if(tp == undefined) tp = ITEM_KURIBO;
        this.tp = tp;
        this.scoreValue = 100;
    }

    //更新処理
    update() {
        if(this.kill) return;
        //if(ojisan.kuribo) return;
        if(this.proc_kuribo()) return;
  
        this.checkWall();
        this.checkFloor();
        this.checkCliff();
       
        if(this.vy < AIR_RESIST) this.vy += GRAVITY; //重力空気抵抗
        this.x += this.vx;
        this.y += this.vy;
        if((this.y>>4) > FIELD_SIZE_H * 16) this.kill = true;

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
        else s = 16;
        vcon.drawImage(chImg, sx, sy, 16, s, px, py, 16, 16);
    }

    //横の壁の判定
    checkWall() {
        let lx = ((this.x + this.vx)>>4);
        let ly = ((this.y + this.vy)>>4);
        //左右側のチェック
        if(field.isBlock(lx + 15, ly + 3)  ||
           field.isBlock(lx + 15, ly + 12) ||
           field.isBlock(lx, ly + 3)       ||
           field.isBlock(lx, ly + 12)) { 
            this.vx *= -1;     
        }
    }

    //崖の判定
    checkCliff() {
        if(this.y<=GROUND_LEVEL) return;
        let nextStepX = this.x>>4 + this.vx>>4;
        let checkY = this.y>>4 + this.h>>4 +10
        if(!field.isBlock(nextStepX, checkY)) {
            this.vx *= -1;
        }
    }

    //床の判定
    checkFloor() {
        if(this.vy <= 0) return;
        let lx = ((this.x + this.vx)>>4);
        let ly = ((this.y + this.vy)>>4);

        if(field.isBlock(lx + 1, ly + 15) ||
          field.isBlock(lx + 14, ly + 15)) { 
            this.vy = 0;
            this.y = ((((ly + 15)>>4)<<4) - 16)<<4;
        }
    }

    //当たり判定
    checkHit(obj) {
        //物体1
        let left1 = (this.x>>4)      + 2;
        let right1 = left1 + this.w  - 4; 
        let top1 = (this.y>>4)       + 5 + this.ay;
        let bottom1 = top1 + this.h  - 7;
        //物体2
        let left2 = (obj.x>>4)      + 2;
        let right2 = left2 + obj.w  - 4; 
        let top2 = (obj.y>>4 )      + 5 + obj.ay;
        let bottom2 = top2 + obj.h  - 7;

        return(left1 <= right2 &&
            right1 >= left2 &&
            top1 <= bottom2 &&
            bottom1 >= top2); //条件に当たればtrue
    }

    checkEnemyCollision(obj) {
        if(!this.checkHit(obj)) {
            return "none"; //衝突なし
        }
        const stompThreshold = this.y>>4 + this.h / 4; //クリボ上の1/4の範囲
        if(obj.y>>4 + this.h <= stompThreshold && obj.vy > 10) {
            return "stomp"; //踏みつけ 
        } else {
            return "hit"; //通常の衝突(横からまたは下から)
        }
    }
    
    //クリボの処理、当たり判定の判定と出現後の
    proc_kuribo() {
        if(this.checkHit(ojisan)) {
            const collisionType = this.checkEnemyCollision(ojisan);
            if(collisionType === "stomp") {
                ojisan.dealDmgKuri = 1;
                this.tp = ITEM_STOMPKURI;
                this.sp = 98;
                this.vx = 0;
                this.kill = false;
                score += this.scoreValue
                this.scoreValue = 0;
                setTimeout(() => {
                    this.kill = true;
                    item.push(new Item(384, this.x>>8, this.y>>8, 0, 0, ITEM_COIN));
                    coinSound.play();
                    this.scoreValue = 100;
                }, 1000);
                return true;
            }
            if(collisionType === "hit") {
                ojisan.tookDmgKuri = 1;
                this.kill = false;
                return true;
            } 
        }
        if(++this.count <= 32) {
            this.sz = (1 + this.count)>>1;
            this.y -= 1<<3;
            if(this.count == 32) this.vx = 12;
            return true;
        }
        return false;
    } 

    updateAnim() {
        //アニメスプライトの決定
        if(this.tp == ITEM_KURIBO)
        this.sp = 96 + ((this.acou / 10) % 2); //3で割ると0,1,2    
    }
}
