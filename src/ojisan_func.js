//
//おじさんクラスのファンクション達
//

//＊＊＊判定界隈＊＊＊
    //床の判定
    Ojisan.prototype.checkFloor = function() {
        if(this.vy <= 0) return;
        let lx = ((this.x + this.vx)>>4);
        let ly = ((this.y + this.vy)>>4);
        let p = this.type == TYPE_MINI?2:0;

        if(field.isBlock(lx + 1 + p, ly + 31) ||
          field.isBlock(lx + 14 - p, ly + 31)) { 
            if(this.anim == ANIME_JUMP) this.anim = ANIME_WALK;
            this.jump = 0;
            this.vy = 0;
            this.y = ((((ly + 31)>>4)<<4) - 32)<<4;
        }
    };

    //天井の判定
    Ojisan.prototype.checkCeil = function() {
        if(this.vy >= 0) return;
        let lx = ((this.x + this.vx)>>4);
        let ly = ((this.y + this.vy)>>4);
        let ly2 = ly + (this.type == TYPE_MINI?21:5);
        let bl;
        if(bl = field.isBlock(lx + 8, ly2)) { 
            this.jump = 15;
            this.vy = 0;
            let x = (lx + 8)>>4;
            let y = (ly2)>>4;

            //ブロック別のアイテム生成(ランダム)
            if(bl == BL_NORMAL_A) { //ブロックAの場合
                const randomValueA = Math.floor(Math.random() * 4); //0,1,2,3
                switch(randomValueA) {
                    case 0:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        item.push(new Item(234, x, y, 0, 0, ITEM_KINO));
                        break;
                    case 1:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        item.push(new Item(384, x, y, 0, 0, ITEM_COIN));
                        score += SCORE_COIN;
                        coinSound.play();
                        break;
                    case 2:
                        block.push(new Block(368, x, y));
                        item.push(new Item(254, x, y, 0, 0, ITEM_FIRE));
                        break;
                    case 3:
                        blbSound.currentTime = 0; //連続再生
                        blbSound.play();
                        score += SCORE_BLOCK;
                        block.push(new Block(bl, x, y, 1, 20, -60));
                        block.push(new Block(bl, x, y, 1, -20, -60));
                        block.push(new Block(bl, x, y, 1, 20, -20));
                        block.push(new Block(bl, x, y, 1, -20, -20));
                        break;
                }
            }

            if(bl == BL_HATENA_A) { //？ブロックAの場合
                const randomValueB = Math.floor(Math.random() * 4); //0,1,2,3
                switch(randomValueB) {
                    case 0:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        item.push(new Item(234, x, y, 0, 0, ITEM_KINO));
                        break;
                    case 1:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        item.push(new Item(384, x, y, 0, 0, ITEM_COIN));
                        score += SCORE_COIN;
                        coinSound.play();
                        break;
                    case 2:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        if(this.type == TYPE_BIG) {
                        item.push(new Item(254, x, y, 0, 0, ITEM_FIRE));
                        }
                        break;
                    case 3:
                        item.push(new Item(384, x, y, 0, 0, ITEM_COIN));
                        score += SCORE_COIN;
                        coinSound.play();
                        item.push(new Item(384, x + 1, y, 0, 0, ITEM_COIN));
                        item.push(new Item(384, x + 2, y, 0, 0, ITEM_COIN));
                        item.push(new Item(384, x + 3, y, 0, 0, ITEM_COIN));
                        kuribo.push(new Kuribo(97, x + 4, 0, 0, 0, ITEM_KURIBO));
                        block.push(new Block(374, x, y));
                        break;
                }
            }

            if(bl == BL_HATENA_B) { //？ブロックBの場合
                const randomValueC = Math.floor(Math.random() * 4); //0,1,2,3
                switch(randomValueC) {
                    case 0:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        item.push(new Item(234, x, y, 0, 0, ITEM_KINO));
                        break;
                    case 1:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        item.push(new Item(384, x, y, 0, 0, ITEM_COIN));
                        score += SCORE_COIN;
                        coinSound.play();
                        break;
                    case 2:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        if(this.type == TYPE_BIG) {
                        item.push(new Item(254, x, y, 0, 0, ITEM_FIRE));
                        }
                        break;
                    case 3:
                        block.push(new Block(373, x, y));
                        item.push(new Item(234, x, y, 0, 0, ITEM_KINO));
                        break;
                }
            }

            if(bl == BL_NORMAL_B) { //ブロックBの場合
                const randomValueC = Math.floor(Math.random() * 4); //0,1,2,3
                switch(randomValueC) {
                    case 0:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        item.push(new Item(234, x, y, 0, 0, ITEM_KINO));
                        break;
                    case 1:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        item.push(new Item(384, x, y, 0, 0, ITEM_COIN));   
                        score += SCORE_COIN;
                        coinSound.play();
                        break;
                    case 2:
                        block.push(new Block(bl, x, y)); //ブロックを揺らす
                        if(this.type == TYPE_BIG) {
                        item.push(new Item(254, x, y, 0, 0, ITEM_FIRE));
                        }
                        break;
                    case 3:
                        item.push(new Item(486, x, y, 0, 0, ITEM_KUSA));
                        block.push(new Block(374, x, y));
                        break;
                }
            }

            if(bl == BL_NORMAL_C) { //ブロックCの場合
                return;
            }

            if(bl == BL_TRANSP_A) { //ブロックD(隠)の場合
                item.push(new Item(254, x, y, 0, 0, ITEM_FIRE));
                block.push(new Block(374, x, y));
                return;
            }

            if(bl == BL_NORMAL_D) { //ブロックCの場合
                blbSound.currentTime = 0; //連続再生
                blbSound.play();
                score += SCORE_BLOCK;
                block.push(new Block(bl, x, y, 1, 20, -60));
                block.push(new Block(bl, x, y, 1, -20, -60));
                block.push(new Block(bl, x, y, 1, 20, -20));
                block.push(new Block(bl, x, y, 1, -20, -20));
                return;
            }
        }     
    };

    //横の壁の判定
    Ojisan.prototype.checkWall = function() {
        let lx = ((this.x + this.vx)>>4);
        let ly = ((this.y + this.vy)>>4);
        let p = this.type == TYPE_MINI?16+8:9;
        //右側のチェック
        if(field.isBlock(lx + 15, ly + p)  ||
            (this.type == TYPE_BIG && (
                field.isBlock(lx + 15, ly + 15) ||
                field.isBlock(lx + 15, ly + 24)))) { 
                    this.vx = 0;
                    this.x -= 8;
        }
        //左側のチェック
        else if(field.isBlock(lx, ly + 9)  ||
            (this.type == TYPE_BIG && (
                field.isBlock(lx, ly + 15) ||
                field.isBlock(lx, ly + 24)))) { 
                    this.vx = 0;
                    this.x += 8;
            }
    };

//＊＊＊移動・行動界隈＊＊＊

    //ジャンプ処理
    Ojisan.prototype.updateJump = function() {
        //ジャンプ
        if(keyb.ABUTTON) {
            if(this.jump == 0) {
                jumpSound.currentTime = 0; //連続再生
                jumpSound.play();
                this.anim = ANIME_JUMP;
                this.jump = 1;
            }
            if(this.jump < 15) this.vy = -(64 - this.jump) ;
        }
        if(this.jump) this.jump++; 
    };

    //横方向の移動
    Ojisan.prototype.updateWalkSub = function(dir) {
        //最高速まで加速
        if(dir == 0 && this.vx < MAX_SPEED) this.vx ++;
        if(dir == 1 && this.vx > -MAX_SPEED) this.vx --;
        //ジャンプしてない時
        if(!this.jump) {
            //立ちポーズだった時はカウンタリセット
            if(this.anim == ANIME_STAND) this.acou = 0;
            //アニメを歩きアニメ
            this.anim = ANIME_WALK;
            //方向を設定
            this.dirc = dir;
            //逆方向の時はブレーキをかける
            if(dir == 0 && this.vx < 0) this.vx++;
            if(dir == 1 && this.vx > 0) this.vx--;
            //逆に強い加速の時はブレーキアニメ
            if(dir == 1 && this.vx > 8 ||
                dir == 0 && this.vx < -8)
                this.anim = ANIME_BRAKE;
        }
    };

    //歩く処理
    Ojisan.prototype.updateWalk = function() {
        //横移動
        if(keyb.Left) {
            this.updateWalkSub(1);
        } else if(keyb.Right) {
            this.updateWalkSub(0);
        } else {
            if(!this.jump) {
                if(this.vx > 0) this.vx -= 1;
                if(this.vx < 0) this.vx += 1;
                if(!this.vx) this.anim = ANIME_STAND;
            }
        }
    };

    //ファイアボールの発射
    Ojisan.prototype.shootFireball = function() {
        if(keyb.FBBUTTON && this.type == TYPE_FIRE && this.reload ==0) {
            this.snum =263;
            if(this.dirc) this.snum += 48; //左向きは+48を使う
            this.reload =20;
            fireSound.currentTime = 0; //連続再生
            fireSound.play();
            let direc = this.dirc;
            if(this.dirc == 1) {direc = -1;} else {direc = 1;}
            fireball.push(new Fireball(112, this.x>>4, this.y>>4, direc, ITEM_FIREB));
                setTimeout(() => {
                    keyb.FBBUTTON = false;
                }, 300);
        }
    };

//＊＊＊アニメーション界隈＊＊＊
    //スプライトを変える処理
    Ojisan.prototype.updateAnim = function() {
        //スプライトの決定
        switch(this.anim) {
            case ANIME_STAND:
                this.snum = 0;
                break;
            case ANIME_WALK:
                this.snum = 2 + ((this.acou / 6) % 3); //3で割る0,1,2
                break;
            case ANIME_JUMP:
                this.snum = 6;
                break;
            case ANIME_BRAKE:
                this.snum = 5;
                break;
            case ANIME_FLAG:
                this.snum = 8;
                break;
        }
        //ちっちゃいおじさんの時は+32
        if(this.type == TYPE_MINI) {
            this.snum += 32;
            if(this.dirc) {
                this.snum += 48; //左向きは+48を使う
            }
        }
        //ちっちゃいおじさんの時は+0
        if(this.type == TYPE_BIG) {
            this.snum += 0;
            if(this.dirc) {
                this.snum += 48; //左向きは+48を使う
            }
        }
         //ファイアおじさんの時は+256
        if(this.type == TYPE_FIRE) {
            if(keyb.FBBUTTON){
                this.snum += 263;
            } else {
                this.snum += 256;}
            if(this.dirc) {
                this.snum += 48; //左向きは+48を使う
            }
        }
    };

//＊＊＊ゲームオーバー・ゴール界隈＊＊＊
    //ゲームオーバー判定
    Ojisan.prototype.checkGameOver = function() {
        if(this.y > GROUND_LEVEL || lifePoint < 0) { //崖に落ちたら、ライフ0でisDead
            this.isDead = true;
            wahSound.play();    
            this.y = 1000;
            this.vy -= 300;
            if(lifePoint < 0) lifePoint = 0;
        }
    };

    //ゴールシークエンス
    Ojisan.prototype.updateGoal = function() {
        this.acou++; // 安全のためアニメカウンタ進める（歩きアニメ用）
        switch (this.goalState) {
            case GOAL_GRAB: // 0: 旗を掴む（初期状態）
                this.vx = 0;
                this.vy = 0;
                this.anim = ANIME_FLAG;
                this.goalTimer = 0; // 次は落下へ遷移（即時 or 少し待つなら > 0 に）
                this.goalState = GOAL_FALL;
                break;

            case GOAL_FALL: // 1: 旗から落下（内部単位に合わせた落下）
                if (!this.clearPlayed) {   // ← 1回だけ！
                    flagSound.play();
                    this.clearPlayed = true;
                }
                this.anim = ANIME_FLAG;
                this.vy = GOAL_GRAVITY << 4; // 落下は内部単位（<<4）で行う
                this.y += this.vy;

                // goalGroundY は flag 側で (fallLevel << 4) をセットしている前提
                if (typeof this.goalGroundY === "number" && this.y >= this.goalGroundY) {
                    this.y = this.goalGroundY;
                    this.vy = 0;
                    this.goalTimer = 0;
                    this.acou = 0;
                    this.goalState = GOAL_WALK;
                }
                break;
 
            case GOAL_WALK: // 2: 自動歩行で城へ（ここで入口判定・床判定を行う）
                this.anim = ANIME_WALK;
                this.vx = 20; // 速度は内部単位に合わせて調整（例: 32 = 2px/frame if units differ）
                this.x += this.vx;

                let lx = ((this.x + this.vx)>>4);
                let ly = ((this.y + this.vy)>>4);
                let p = this.type == TYPE_MINI?16+8:9;
                
                if(field.isBlock(lx + 15, ly + p)  || //右側のチェック
                    (this.type == TYPE_BIG && (
                        field.isBlock(lx + 15, ly + 15) ||
                        field.isBlock(lx + 15, ly + 24)))) { 
                            this.anim = ANIME_STAND;
                            this.vx = 0;
                            this.x -= 0;
                            //this.goalTimer++;
                            this.goalState = GOAL_ABSORB;
                }
                break;
            
            case GOAL_ABSORB: // 3: 吸い込みアニメ（縮小＋透明化）
                this.anim = ANIME_STAND;
                this.goalTimer++;
                this.x += 10;  // 吸い込みの動き（少し右上へ、縮小、透明化）
                this.y -= 2;
                this.scale = Math.max(0, (this.scale || 1) - 0.03);
                this.alpha = Math.max(0, (this.alpha || 1) - 0.03);

                if (!this.goalAnchor) {
                    this.goalAnchor = {x: this.x >> 4, y: this.y >> 4};
                }

                if (this.scale <= 0 || this.alpha <= 0 || this.goalTimer > 60) {
                   this.clearPlayed = false;
                   this.goalState = GOAL_END;
                break;
                }
            
            case GOAL_END: //4: ゴール完了フラグ
                this.gameclear = true;
                if (!this.clearPlayed) {   // ← 1回だけ！
                    bgmSound.pause();
                    goalSound.pause();
                    clearSound.play();
                    this.clearPlayed = true;
                }
                // 花火10回終わったらスコアUPへ移行
                if (this.fireworkCount >= 7 && this.goalTimer > 60) {
                    //hanabi.forEach(h => h.kill = true);
                    this.goalState = SCORE_UP;  // ★ここで遷移！
                    this.scoreCount = 0;        // カウンタ初期化
                    break;
                }
                //スコアで花火切り替え
                if(score >= ENDING_BRANCH_S) {
                    this.proc_hanabi_SS();
                } else if(score < ENDING_BRANCH_S && score >= ENDING_BRANCH) {
                    this.proc_hanabi_S();
                } else {
                    this.proc_hanabi_A();
                }
                this.goalTimer++;
                break;
            case SCORE_UP:  // 1フレームごとに10点加算
                score += 40;
                this.scoreCount++;
                if (this.scoreCount % 5 === 0) { // 音が鳴りすぎないように間引き
                    scoreSound.play();
                }   
                if (this.scoreCount >= 100) {  // 合計点到達したら終了
                    scoreSound.pause();
                    this.goalState = SCORE_END;  // ★次の終了ステートへ
                }
                break;
            case SCORE_END:
                if (!this.ojisanButtonShown && this.goalAnchor && SCORE_END) {
                    showOjisanButton(
                        this.goalAnchor.x + 220, // 右方向（花火3発目相当）
                        this.goalAnchor.y - 100  // 上方向
                    );
                    this.ojisanButtonShown = true;
                }
                break;
        }
        this.updateAnim(); // ゴール中もアニメ自動更新は必須（ミニ/ビッグ/ファイア対応）
    };

    //花火演出
    Ojisan.prototype.proc_hanabi_SS = function(){
        let t = this.goalTimer % 60; // 70fで1セット繰り返し 70
        if (this.fireworkCount < 6) {
        if (t === 10) {
            hanabi.push(new Hanabi_S((this.x>>4) - 40, (this.y>>4) - 100, 0, 0,ITEM_HANABI ));
            hanabiSound.play();
        }
        if (t === 20) {
            hanabi.push(new Hanabi_S((this.x>>4), (this.y>>4) - 120, 0, 0, ITEM_HANABI));
            hanabiSound.play();           
        }
        if (t === 30) {
            hanabi.push(new Hanabi_S((this.x>>4) + 40, (this.y>>4) - 110, 0, 0, ITEM_HANABI));
            hanabiSound.play();
        }
        if (t === 59) {
            hanabiSound.pause();
            this.fireworkCount++;
        }
        }
        //Sを3セット出したあと // S終了判定・SS条件・タイミング調整
        if (this.fireworkCount === 6 && t === 40) {
                hanabi.push(new Hanabi_SS((this.x>>4) - 60, (this.y>>4) - 100, 0, 0, ITEM_HANABI));
                hanabi.push(new Hanabi_SS((this.x>>4) - 30, (this.y>>4) - 120, 0, 0, ITEM_HANABI));
                hanabi.push(new Hanabi_SS((this.x>>4), (this.y>>4) - 140, 0, 0, ITEM_HANABI));
                hanabi.push(new Hanabi_SS((this.x>>4) + 30, (this.y>>4) - 120, 0, 0, ITEM_HANABI));
                hanabi.push(new Hanabi_SS((this.x>>4) + 60, (this.y>>4) - 100, 0, 0, ITEM_HANABI));
                hanabiSound.play();
                this.fireworkCount++; // ← 二度と出さないために進める
                this.goalTimer = 0;
        }
    };

    Ojisan.prototype.proc_hanabi_S = function(){
        let t = this.goalTimer % 60; // 60fで1セット繰り返し
        if (this.fireworkCount < 6) {
        if (t === 10) {
            hanabi.push(new Hanabi_S((this.x>>4) - 40, (this.y>>4) - 100, 0, 0,ITEM_HANABI ));
            hanabiSound.play();
        }
        if (t === 20) {
            hanabi.push(new Hanabi_S((this.x>>4), (this.y>>4) - 120, 0, 0, ITEM_HANABI));
            hanabiSound.play();           
        }
        if (t === 30) {
            hanabi.push(new Hanabi_S((this.x>>4) + 40, (this.y>>4) - 110, 0, 0, ITEM_HANABI));
            hanabiSound.play();
        }
        if (t === 59) {
            hanabiSound.pause();
            this.fireworkCount++;
        }
        }
    };

    Ojisan.prototype.proc_hanabi_A = function(){
        let t = this.goalTimer % 60; // 60fで1セット繰り返し
        if (t === 10) {
            hanabi.push(new Hanabi_A(206, (this.x>>4), (this.y>>4) - 120, 0, 0, ITEM_HANABI));
            hanabiSound.play();           
        }
        if (t === 59) {
            hanabiSound.pause();
            this.fireworkCount++;
        }
    };

