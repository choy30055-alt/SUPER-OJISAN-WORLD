//
//ゴール旗のクラス
// 
class Flag {
    constructor(tx, ty) { // tx,ty はタイル座標で渡す想定
        this.x = tx * 16;   // ピクセル
        this.y = ty * 16;
        this.sp = 493;      // 旗スプライト番号（必要なら調整）
        this.isFalling = false; // 旗がスルスル落ちているか
        this.vy = 0;
        this.touched = false;   // 既に当たって通知したか（将来的に使える)
        this.fallLevel = 160;
    }

    update() { 
        if (!this.isFalling /*&& !this.touched*/) { // ----- 当たり判定（アイテム側が担当） -----
            const fx = this.x<<4; // ピクセル単位で判定（スクロール考慮不要）
            const fy = this.y<<4;
            const ox = ojisan.x;
            const oy = ojisan.y;
            const dx = Math.abs(ox - fx); // 中心合わせで広めに判定（必要なら閾値を調整）
            const dy = Math.abs(oy - fy); 
            if (dx < 256 && dy < 720) { // 当たり！ 旗は自分で落ちる（今回の仕様）256/512
                this.isFalling = true;
                this.touched = true;    // 二重反応防止
                this.vy = GOAL_GRAVITY;            // 落下速度（微調整可）
                ojisan.isGoal = true;  // ★ ゴール開始！
                ojisan.goalState = GOAL_GRAB;
                ojisan.goalTimer = 0;
                ojisan.goalGroundY = this.fallLevel << 4;
            }
        } 
        if (this.isFalling) { // 落下中
            this.y += this.vy;
            if(this.y >= this.fallLevel) {
                this.y = this.fallLevel;
            }
        }
    }

    draw() {
        const px = this.x - field.scx; //描画は world(pixel) - scroll(pixel)
        const py = this.y - field.scy;
        drawSprite(this.sp, px, py);
    }
}
