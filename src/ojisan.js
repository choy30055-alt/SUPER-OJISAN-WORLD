//
//おじさんクラス
//
class Ojisan {
    constructor(x, y) {
        this.x = x<<4;
        this.y = y<<4;
        this.ay = 16;
        this.w = 16;
        this.h = 16;
        this.vx = 0;
        this.vy = 0;
        this.type = TYPE_MINI;
        this.dirc = 0;
        this.jump = 0;
        this.anim = 0;
        this.snum = 0;
        this.acou = 0;
        this.kill = false;
        this.isDead = false;
        this.scoreValue = 100;
        this.loseValue = -100;
        this.scoreCount = 1;
        //this.reload = 0;
        this.kinoko = 0;
        this.coinGet = false;
        this.fire = 0;
        this.tookDmgKuri = 0; //負
        this.dealDmgKuri = 0; //勝
        this.tookDmgNoko = 0; //負
        this.dealDmgNoko = 0; //勝
        this.tookDmgToge = 0; //負
        this.dealDmgToge = 0; //勝
        this.tookDmgHammer = 0;  //負
        this.dealDmgHammer = 0; //勝
        this.isGoal = false;
        this.goalState = 0;
        this.goalTimer = 0;
        this.scale = 1;
        this.alpha = 1;
        this.gameclear = false;
        this.clearPlayed = false; // ゴール音を再生したか
        this.fireworkCount = 0; // 花火セット数
        this.ojisanButtonShown = false;
        this.goalAnchor = null;
    }

    //毎フレーム毎の更新処理
    update() {
        if (this.isGoal) {  //ゴール演出(ここで完全に乗っ取る)
            this.updateGoal();
            return;
        }

        //キノコ：ゲット
        if(this.kinoko) {
            if(this.type == TYPE_FIRE || this.type == TYPE_BIG ) {
                this.kinoko = 0;
            } else {
                pupSound.play();
                let anim = [32, 14, 32, 14, 32, 14,  0, 32, 14, 0];
                this.snum = anim[this.kinoko>>2];
                this.h = this.snum == 32?16:32;
                if(this.dirc) this.snum += 48; //左向きは+48を使う
                if(++this.kinoko == 40)/*anim.length<<4*/ {
                    yafuSound.play();
                    this.type = TYPE_BIG;
                    this.ay = 0;
                    this.kinoko = 0; 
                    score += SCORE_ITEM * this.scoreCount;
                    this.scoreCount = 0;    
               }
               this.scoreCount = 1;
            }
            return;
        }
        
        //コイン：ゲット
        if(this.coinGet) {
            this.coinGet = false;
            score += SCORE_COIN;
            coinSound.play();    
        } 

        //ファイアフラワー：ゲット
        if(this.fire) {
            if(this.type == TYPE_FIRE) {
                this.fire = 0;
            } else {
                pupSound.play();
                let anim = [256, 0, 256, 0, 256, 0, 256, 0, 256, 0];
                this.snum = anim[this.fire>>2];
                this.h = this.snum == 32?16:32;
                if(this.dirc) this.snum += 48; //左向きは+48を使う
                if(++this.fire == 40) {
                    hahaSound.play();
                    this.type = TYPE_FIRE;
                    this.ay = 0;
                    this.fire = 0;
                    score += SCORE_ITEM * this.scoreCount;
                    this.scoreCount = 0;    
                }
                this.scoreCount = 1;
            } 
            return;
        }
        
        //クリボ：WIN_踏んだ時  MYオリジナルロジック
        if(this.dealDmgKuri) {
            if (this.dealDmgKuri === 1) {
                fumuSound.play();
                score += SCORE_KURIBO * this.scoreCount;
                this.scoreCount = 0;    
            }
            this.y -= 12;
            if(this.dirc) {this.x -= 20;} else {this.x += 20;} 
            if(++this.dealDmgKuri == 20) {
               this.dealDmgKuri = 0;
               this.scoreCount = 1;
               yaSound.play();
            }
            return;
        }

        //ノコノコ：WIN_踏んだ時　MYオリジナルロジック
        if(this.dealDmgNoko) {
            if (this.dealDmgNoko === 1) {
                fumuSound.play();
                score += SCORE_NOKONOKO * this.scoreCount;
                this.scoreCount = 0;    
            }
            this.y -= 12;
            if(this.dirc) {this.x -= 20;} else {this.x += 20;}
            if(++this.dealDmgNoko == 20) {
               this.dealDmgNoko = 0;
               this.scoreCount = 1;
               yaSound.play();
            }
            return;
        }
            
        //ハンマーブロス：WIN_踏んだ時 
        if(this.dealDmgHammer) {
            if (this.dealDmgHammer === 1) {
                fumuSound.play();
                hammerBrosFlip.push(new HammerBrosFlip(134, this.x>>8, this.y>>8, 0, 0, ITEM_HAMMERBROS));
                this.vy = -80;        //踏みジャンプの本体
                this.vx -= 10;
                this.jump = 1;        //空中判定
                this.dealDmgHammer = 0; 
                yafuSound.play();
                score += SCORE_HAMMERBROS * this.scoreCount;
                this.scoreCount = 0;
            }
            this.scoreCount = 1;
            return;
        }
            
        //クリボ：LOSE_ぶつかった時
        if(this.tookDmgKuri) {
            if (this.tookDmgKuri === 1) {
                lvdSound.play();
            }
            this.y -= 8;
            this.snum = 94;
            this.h = this.snum == 94?16:32;
            lifePoint += this.loseValue / 100; //MYオリジナルロジック 
            this.loseValue = 0;
            if(++this.tookDmgKuri == 40) {
               this.tookDmgKuri = 0; 
               miyaSound.play();
               this.snum = 32;
               this.h = this.snum == 32?16:32;
               this.type = TYPE_MINI;
               this.ay = 16;
               this.loseValue = -100;
            }
            return;
        } 

        //ノコノコ：LOSE_ぶつかった時
        if(this.tookDmgNoko) {
            if (this.tookDmgNoko === 1) {
                lvdSound.play();
            }
            this.y -= 8;
            this.snum = 94;
            this.h = this.snum == 94?16:32;
            lifePoint += this.loseValue / 100; //MYオリジナルロジック 
            this.loseValue = 0;
            if(++this.tookDmgNoko == 40) {
               this.tookDmgNoko = 0; 
               miyaSound.play();
               this.snum = 32; 
               this.h = this.snum == 32?16:32;
               this.type = TYPE_MINI;
               this.ay = 16;
               this.loseValue = -100;
            }
            return;
        } 

        //トゲゾー：LOSE_ぶつかった時
        if(this.tookDmgToge) {
            if (this.tookDmgToge === 1) {
                lvdSound.play();
            }
            this.y -= 8;
            this.snum = 94;
            this.h = this.snum == 94?16:32;
            lifePoint += this.loseValue / 100; //MYオリジナルロジック 
            this.loseValue = 0;
            if(++this.tookDmgToge == 40) {
               this.tookDmgToge = 0; 
               miyaSound.play();
               this.snum = 32; 
               this.h = this.snum == 32?16:32;
               this.type = TYPE_MINI;
               this.ay = 16;
               this.loseValue = -100;
            }
            return;
        } 

        //ハンマー：LOSE_ぶつかった時
        if(this.tookDmgHammer) {
            if (this.tookDmgHammer === 1) {
                waSound.play();
            }
            this.y -= 8;
            this.x -= 50; 
            this.snum = 94;
            this.h = this.snum == 94?16:32;
            lifePoint += (this.loseValue * 0.25) / 100; //MYオリジナルロジック 
            this.loseValue = 0;
            if(++this.tookDmgHammer == 40) {
               this.tookDmgHammer = 0; 
               this.snum = 32; 
               this.h = this.snum == 32?16:32;
               this.type = TYPE_MINI;
               this.ay = 16;
               this.loseValue = -100;
            }
            return;
        } 
    
        //アニメのカウンタ
        this.acou++;
        if(Math.abs(this.vx) == MAX_SPEED) this.acou++;

        this.updateAnim();
        this.updateJump();
        this.updateWalk();
        this.shootFireball();
        this.checkGameOver();
        //if(this.reload > 0) this.reload--;    
        
        //重力・空気抵抗
        if(this.vy < AIR_RESIST) this.vy += GRAVITY; //重力空気抵抗
        //横の壁のチェック
        this.checkWall();
        //床のチェック
        this.checkFloor();
        //天井のチェック
        this.checkCeil();
        //実際に座標を変えてる
        this.x += this.vx;
        this.y += this.vy;
    }

    //毎フレーム毎の描画処理
    draw() {
        let px = (this.x >> 4) - field.scx;
        let py = (this.y >> 4) - field.scy;
        let sx = (this.snum & 15) << 4;
        let sy = (this.snum >> 4) << 4;
        let w = this.w;
        let h = this.h;
        if (this.goalState === GOAL_END) return;
        py += (32 - h); // ちっちゃいおじさん対策（本来の処理そのまま）
        if (!this.isGoal) {
            vcon.drawImage(chImg, sx, sy, w, h, px, py, w, h); // ★ 通常時（ゴール以外）は今まで通りの描画にする
            return;
        }  
        vcon.save(); // ★ ゴール中だけ透明化・縮小を反映  
        vcon.globalAlpha = this.alpha ?? 1; // 透明度 
        vcon.translate(px + w / 2, py + h / 2); // 中心に基準を合わせる（縮小が綺麗）
        vcon.scale(this.scale ?? 1, this.scale ?? 1); // 縮小率 scale を適用（通常は scale=1 なので変化なし）
        vcon.drawImage(chImg, sx, sy, w, h, -w / 2, -h / 2, w, h); // 中心基準で描画
        vcon.restore();
        vcon.globalAlpha = 1; // 透明度のリセット（他の描画への影響防止）
    }
}