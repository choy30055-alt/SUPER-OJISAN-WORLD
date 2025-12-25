//ノコノコのクラス
//
class Nokonoko {
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
        this.count = 0;
        this.acou = 0;   
        if(tp == undefined) tp = ITEM_NOKONOKO;
        this.tp = tp;
    }

    //更新処理
    update() {
        if(this.kill) return;
        //if (this.kickCool > 0) this.kickCool--;
        if(this.proc_nokonoko()) return;
  
        this.checkWall();
        this.checkFloor();
        this.checkCliff();
       
        if(this.vy < AIR_RESIST) this.vy += GRAVITY; //重力・空気抵抗
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
        else s = 32;
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
        if(this.y <= GROUND_LEVEL) return;
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
        const stompThreshold = this.y>>4 + this.h / 4; //上の1/4の範囲
        if(obj.y>>4 + this.h <= stompThreshold && obj.vy > 10) {
            return "stomp"; //踏みつけ 
        } else {
            return "hit"; //通常の衝突(横からまたは下から)
        }
    }
    
   proc_nokonoko() {
        if (!this.checkHit(ojisan)) return false;
        const collisionType = this.checkEnemyCollision(ojisan);
        if (this.tp === ITEM_URNOKONOKO) {  //甲羅状態（ひっくり返り）
            if (collisionType === "hit") {  // 横から体当たり
                this.vx = ojisan.dirc ? -40 : 40; // ノコノコを弾として飛ばす
                this.vy = -20;
                ojisan.vx = ojisan.dirc ? 10 : -10; // 少しだけおじさんも反動
                fumuSound.play();
                return true;
            }
            return true;
        }
        if (collisionType === "stomp") {  //通常状態
            ojisan.dealDmgNoko = 1; // 踏んだ
            this.tp = ITEM_URNOKONOKO;  // 甲羅状態へ移行
            this.sp = 132;
            this.vx = 0;
            setTimeout(() => {  // 一定時間後に復活
                this.vx = 10;
                this.tp = ITEM_NOKONOKO;
            }, 9000);
            return true;
        } 
        if (collisionType === "hit") {  //通常ヒット（ダメージ）
            ojisan.tookDmgNoko = 1;
            return true;
        }
        return false;
}

    updateAnim() {
        //アニメスプライトの決定
        if(this.tp == ITEM_NOKONOKO) {
            this.sp = 130 + ((this.acou / 10) % 2); //3で割ると0,1,2
           if(this.vx <0) {
                this.sp = 162 + ((this.acou / 10) % 2); //左向きは+16を使う
            }  
        }      
    }
}
