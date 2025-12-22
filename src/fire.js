//
//ファイアーボールのクラス
//
class Fireball {
    constructor(sp, x, y, direc, tp) {
        this.x = x<<4;
        this.y = y<<4;
        this.ay = 0;
        this.w = 16;
        this.h = 16;
        this.vx = (500>>4) * direc; //direc左右確認
        this.vy = -5;
        this.gravity = 1;
        this.groundLevel = SCREEN_SIZE_H * 13 - this.h;
        this.sp = sp;
        this.sz = 16;
        this.anim = 0;
        this.snum = 0;
        this.kill = false;  
        this.acou = 0;
        if(tp == undefined) tp = ITEM_FIREB;
        this.tp = tp;
        this.scoreValue = 100;
        //this.creationTime = Date.now();
        //this.lifespan = 3000;
        //this.count = 0;
         //this.lifeTime = 3000; 
    }

    //更新処理
    update() {
        if(this.kill) return;
        if(this.proc_firekuribo()) return;
        if(this.proc_firetogezo()) return;
        if(this.proc_firenokonoko()) return;
 
        //重力の影響
        this.vy += this.gravity;

        //位置の更新  
        this.x += this.vx + ojisan.vx;
        this.y += this.vy;

        //画面の外に出たら消す
        if(this.x < 0 || this.x > ojisan.x+3000) {
            this.kill = true;
        }
        
        /*for(let i = 0; i < this.length; i++) {
            this[i].kill = true;
        }*/

        this.checkWall();
        this.checkFloor();
        //this.checkCliff();

        this.acou++;  //アニメ用のカウンタ
        if(Math.abs(this.speedX) == MAX_SPEED) this.acou++; 
        this.updateAnim();
    }

    //描画処理
    draw() {
        if(this.kill) return;
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

   //横の壁の判定
    checkWall() {
        let lx = ((this.x + this.vx)>>4);
        let ly = ((this.y + this.vy)>>4);
        //左右側のチェック
        if(field.isBlock(lx ,ly) ) { 
            //this.vx *= -1; 
            this.kill = true ;  
        }
    }

    //崖の判定
    /*checkCliff() {
        if(this.y<=2820) return;
        let nextStepX = this.x>>4 + this.vx>>4;
        let checkY = this.y>>4 + this.h>>4 +10
        if(!field.isBlock(nextStepX, checkY)) {
            this.vx *= -1;
        }
    }*/

    //床の判定
    checkFloor() {
        if(this.vy <= 0) return;
        let lx = ((this.x + this.vx)>>4);
        let ly = ((this.y + this.vy)>>4);

        if(field.isBlock(lx + 8, ly + 8)) { 
            /*this.vy = 0;
            this.y = ((((ly + 15)>>4)<<4) - 16)<<4;*/
            this.y -= this.h;
            this.vy *= -0.7; //跳ね返り減衰あり
        }
    }

    proc_firekuribo(){
        //クリボがヒットした時の処理(配列内のクリボを総当たりで当たり判定)
        for(let i = 0; i < kuribo.length; i++) { //ku
            if(!kuribo[i].kill) {
                if(this.checkHit(kuribo[i])) {
                    firehitSound.play();
                    this.tp = ITEM_EXPL 
                    this.vx = 0;
                    this.vy = 0;
                    kuribo[i].kill = true;
                    this.kill = false;
                    score += this.scoreValue;
                    this.scoreValue = 0;
                    setTimeout(() => {
                        this.kill = true;
                        this.scoreValue = 100;
                    }, 500);
                    item.push(new Item(384, this.x>>8, this.y>>8, 0, 0, ITEM_COIN));
                    coinSound.play();
                    break;
                }
            }
        }
    }

    proc_firetogezo(){
        //トゲゾーがヒットした時の処理(配列内のトゲゾーを総当たりで当たり判定)
        for(let i =0; i < togezo.length; i++) { //ku
            if(!togezo[i].kill) {
                if(this.checkHit(togezo[i])) {
                    firehitSound.play();
                    this.tp = ITEM_EXPL 
                    this.vx = 0;
                    this.vy = 0;
                    togezo[i].kill = true;
                    this.kill = false;
                    score += this.scoreValue;
                    this.scoreValue = 0;
                    setTimeout(() => {
                        this.kill = true;
                        this.scoreValue = 100;
                    }, 500);
                    item.push(new Item(384, this.x>>8, this.y>>8, 0, 0, ITEM_COIN));
                    coinSound.play();
                    break;
                }
            }
        }
    }

    proc_firenokonoko(){
        //ノコノコがヒットした時の処理(配列内を総当たりで当たり判定)
        for(let i =0; i < nokonoko.length; i++) { //ku
            if(!nokonoko[i].kill) {
                if(this.checkHit(nokonoko[i])) {
                    firehitSound.play();
                    this.tp = ITEM_EXPL 
                    this.vx = 0;
                    this.vy = 0;
                    nokonoko[i].kill = true;
                    this.kill = false;
                    score += this.scoreValue;
                    this.scoreValue = 0;
                    setTimeout(() => {
                        this.kill = true;
                        item.push(new Item(384, this.x>>8, this.y>>8, 0, 0, ITEM_COIN));
                        this.scoreValue = 100;
                    }, 500);
                    break;
                }
            }
        }
    }

    updateAnim() {
        //アニメスプライトの決定
        if(this.tp == ITEM_FIREB) {
            this.sp = 112 + ((this.acou / 5) % 4); //3で割ると0,1,2
        } else if(this.tp == ITEM_EXPL) {
            this.sp = 203 + ((this.acou / 3) % 4);
        }
    }

    /*isAlive() {
        return Date.now() - this.creationTime <= this.lifespan;
    }*/
}
