//ハンマーブロスのクラス
//
class HammerBros {
    constructor(sp, x, y, vx, vy, tp) {
        this.x = x << 8;
        this.y = y << 8;
        this.vx = vx;
        this.vy = vy;
        this.w = 16;
        this.h = 32;
        this.acou = 0;
        this.kill = false;
        this.dirc = -1;      // ★ 初期は左向き固定 向き（-1:左 / 1:右）
        this.spBase = 166;   // 左向き
        this.sp = this.spBase;
        if (tp === undefined) tp = ITEM_HAMMERBROS;
        this.tp = tp;
        this.throwTimer = 0;     // 投げ間隔用
        this.throwInterval = 90; // 90フレームごと（約1.5秒）
        this.throwRangeX = 400;  // 横距離（px）
        this.throwRangeY = 96;   // 縦距離（px）
        this.landed = false;
        this.jumpTimer = 0;
        this.jumpInterval = 60; // 基本周期（1.5秒）
        this.active = false;        // ★ 起動フラグ
        this.activateRange = 120;  // ★ おじさん接近で起動（px）
    }

    update() {
        if (!this.active) {  // ★ 起動チェック（まだ動かさない）
            const dx = Math.abs((ojisan.x >> 4) - (this.x >> 4));
            if (dx < this.activateRange) {
                this.active = true;   
                this.vx = -8;   // ★ 起動時に初速を与える（超重要）
                this.dirc = -1;
            } else {
                this.vx = 0;  // 起動前は完全停止
                this.vy = 0;
                return;
            }
        }
        if (!this.landed && this.vy >= 0 && (this.y >> 4) >= 150) { // ★ 初回着地だけ初期化
            this.vx = -8;
            this.dirc = -1;
            this.landed = true;
        }
        const dx = (ojisan.x >> 4) - (this.x >> 4);
        if (Math.abs(dx) < this.throwRangeX) {
            this.dirc = (dx < 0) ? -1 : 1;
        }
        if (this.vy < AIR_RESIST) this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
         this.spBase = (this.dirc === -1) ? 166 : 134; // ★ 向き → 見た目（ここだけ）
        this.checkFloor();
        this.checkCliffBlock();
        this.checkWall();
        this.checkThrowHammer();
        this.checkRandomJump();
        this.acou++;
        this.updateAnim();
    }

    updateAnim() {
        const anim = ((this.acou / 10) | 0) % 3;
        this.sp = this.spBase + anim;
    }

    draw() {
        const frame = this.sp;
        const px = (this.x >> 4) - field.scx;
        const py = (this.y >> 4) - field.scy;
        let sx = (frame & 15) << 4;
        let sy = (frame >> 4) << 4;
        vcon.drawImage(chImg, sx, sy, 16, 16, px, py, 16, 16);
        let f2 = frame + 16;
        sx = (f2 & 15) << 4;
        sy = (f2 >> 4) << 4;
        vcon.drawImage(chImg, sx, sy, 16, 16, px, py + 16, 16, 16);
    }

    checkFloor() {
        if (this.vy <= 0) return;
        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);
        if (field.isBlock(lx + 1, ly + 31) ||
            field.isBlock(lx + 14, ly + 31)) {
            this.vy = 0;
            this.y = ((((ly + 31) >> 4) << 4) - 32) << 4;
        }
    }

    checkWall() {
        let lx = ((this.x + this.vx) >> 4);
        let ly = ((this.y + this.vy) >> 4);
        if (field.isBlock(lx + 15, ly + 3) ||
            field.isBlock(lx + 15, ly + 12) ||
            field.isBlock(lx,      ly + 3) ||
            field.isBlock(lx,      ly + 12)) {
            this.vx *= -1;
            this.dirc *= -1;   // ★ 壁では向きも反転
        }
    }

    checkCliffBlock() {
        let footY = (this.y >> 4) + this.h;
        let footX = (this.x >> 4) + (this.vx > 0 ? this.w : 0);
        let nextFootX = footX + (this.vx > 0 ? 1 : -1);
        if (field.isBlock(footX, footY) &&
            !field.isBlock(nextFootX, footY)) {
            this.vx *= -1;   // ★ 向きは変えない
        }
    }

    checkThrowHammer() {
        if (this.throwTimer > 0) {
            this.throwTimer--;
            return;
        }
        const dx = Math.abs((this.x >> 4) - (ojisan.x >> 4));
        if (dx < this.throwRangeX) {
            this.throwHammer();
            this.throwTimer = this.throwInterval;
        }
    }
    
    throwHammer() {
        // ★ 投げる瞬間だけオジサン向きにする
        const throwDir = ((ojisan.x >> 4) < (this.x >> 4)) ? -1 : 1;
        this.dirc = throwDir;   // ← 見た目もここで一致
        const vx = throwDir * 8 + this.vx * 0.8;
        const dy = (ojisan.y >> 4) - (this.y >> 4);
        const vy = -10 + Math.max(-4, Math.min(4, dy * 0.05));
        hammer.push(new Hammer(116, (this.x>>4) -5, (this.y>>4), vx, vy, ITEM_HAMMER));
    }
    
    checkRandomJump() {
        if (this.jumpTimer > 0) {
            this.jumpTimer--;
            console.log("JUMP");
            return;
        }
        if (Math.random() < 0.4) { // ★ 周期が来たときに、確率でジャンプ
            this.vy = -90;   // ジャンプ力
        }
        // 次の判定までの間隔をランダムに
        this.jumpTimer = this.jumpInterval + (Math.random() * 60 | 0);
    }
}

//ハンマーのクラス
//
class Hammer {
    constructor (sp, x, y, vx, vy,tp) {
        this.sp = sp;
        this.x = x<<4;
        this.y = y<<4;
        this.ay = 0; 
        this.w =16;
        this.h =16;
        this.vx = vx;
        this.vy = vy;
        this.sz = 0;
        this.anim = 0;
        this.snum = 0;
        this.kill = false;
        this.acou = 0;   
        if(tp == undefined) tp = ITEM_HAMMER;
        this.tp = tp;
    }

    update () {
        this.vy += GRAVITY * 0.03; // ハンマー専用：軽い重力
        this.x += this.vx;
        this.y += this.vy;
        if ((this.y >> 4) > 192) { // // 床に落ちたら消える 地面ラインは適宜調整
            this.kill = true;
        }
        this.acou++;  //アニメ用のカウンタ
        this.updateAnim();
    }

    draw () {
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

    updateAnim() {
        //アニメスプライトの決定
        this.sp = 116 + ((this.acou / 5) % 4); //3で割ると0,1,2
    }
}