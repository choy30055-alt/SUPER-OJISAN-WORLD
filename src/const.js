//
//定数の定義
//
//効果音関係
const bgmSound = new Audio("./audio/mrobgm.mp3");
const startSound1 = new Audio("./audio/mrohaha.mp3");
const startSound2 = new Audio("./audio/mroherego.mp3");
const jumpSound = new Audio("./audio/mrojump.mp3");
const blbSound = new Audio("./audio/mroblb.mp3");
const itemSound = new Audio("./audio/mroitem.mp3");
const yafuSound = new Audio("./audio/mroyafuu.mp3");
const pupSound = new Audio("./audio/mropup.mp3");
const lvdSound = new Audio("./audio/mrolvd.mp3");
const wahSound = new Audio("./audio/mrowao.mp3");
const waSound = new Audio("./audio/mrowaah.mp3");
const fumuSound = new Audio("./audio/mropeko.mp3");
const yaSound = new Audio("./audio/mroya.mp3");
const hahaSound = new Audio("./audio/mrohaha.mp3");
const coinSound = new Audio("./audio/mrocoin.mp3");
const miyaSound = new Audio("./audio/mromiya.mp3");
const fireSound = new Audio("./audio/mrofireball.mp3");
const firehitSound = new Audio("./audio/mroharetu.mp3");
const jyugemSound = new Audio("./audio/jyugem.mp3");
const gameoverSound = new Audio("./audio/mrogameover.mp3");
const goalSound = new Audio("./audio/fanfare.mp3");
const clearSound = new Audio("./audio/mrogameclear.mp3");
const flagSound = new Audio("./audio/mroflag.mp3");
const hanabiSound = new Audio("./audio/hanabi4.mp3");
const scoreSound = new Audio("./audio/mroroulette.mp3");
const hammerSound = new Audio("./audio/mrobyun.mp3");
const hambrsSound = new Audio("./audio/mrohambrs.mp3");

const GAME_FPS = 1000 / 60;  //FPS
const SCREEN_SIZE_W = 256;
const SCREEN_SIZE_H = 224;

//一画面当たりのブロックの数
const MAP_SIZE_W = SCREEN_SIZE_W / 16;
const MAP_SIZE_H = SCREEN_SIZE_H / 16;

//マップデータのブロック数
const FIELD_SIZE_W = 256;
const FIELD_SIZE_H = 14;

//おじさん関係
const ANIME_STAND = 1;
const ANIME_WALK = 2;
const ANIME_BRAKE = 4;
const ANIME_JUMP = 8;
const ANIME_FIRE = 16;
const ANIME_FLAG = 18;

const TYPE_MINI = 1;
const TYPE_BIG = 2;
const TYPE_FIRE = 3;

const GAME_START = 0;
const GAME_PLAY = 1;
const GAME_OVER = 2;
const GAME_CLEAR = 3;

//重力・移動
const GRAVITY = 4;
const GOAL_GRAVITY = 1; //ゴール時
const AIR_RESIST = 64;
const MAX_SPEED = 32;

//地面
const GROUND_LEVEL = 2820;  //2820 2720

//スコア関係
const SCORE_COIN = 100;
const SCORE_ITEM = 1000;
const SCORE_BLOCK = 50;
const SCORE_KURIBO = 100;
const SCORE_NOKONOKO = 100;
const SCORE_TOGEZO = 100;

//アイテム関係
const ITEM_KINO = 1;
const ITEM_KUSA = 2;
const ITEM_KURIBO = 3;
const ITEM_STAR = 4;
const ITEM_TOGEZO =5;
const ITEM_COIN = 6;
const ITEM_FIREB = 7;
const ITEM_FIRE = 8;
const ITEM_STOMPKURI = 9;
const ITEM_EXPL = 10;
const ITEM_NOKONOKO = 11;
const ITEM_URNOKONOKO = 12;
const ITEM_JYUGEM = 13;
const ITEM_FLAG = 14;
const ITEM_HANABI = 15;
const ITEM_HAMMERBROS = 16;
const ITEM_HAMMER = 17;

//ブロック関係
const BL_NORMAL_A = 371;
const BL_NORMAL_B = 373;
const BL_NORMAL_C = 374;
const BL_NORMAL_D = 372;
const BL_HATENA_A = 368;
const BL_HATENA_B = 496;
const BL_TRANSP_A = 499;
const BL_POLE = 500;
//const BL_FLAG_A = 493;
//const BL_CASTLE = 475;
//const BL_CASTLE_GATE = 491;
//const FLAG_SPRITE = 493;

const GOAL_GRAB   = 0;   // 旗を掴む
const GOAL_FALL   = 1;   // 一緒に落下
const GOAL_WALK   = 2;   // 城に向かって歩く
const GOAL_ABSORB = 3;   // 吸い込み開始
const GOAL_END    = 4;   // 完全吸い込み
const SCORE_UP    = 5;    //ゴールスコア
const SCORE_END   = 6;    //ゴールスコアアップ終了
const ENDING_BRANCH = 100; //エンディング切替スコア
const ENDING_BRANCH_S = 200; //エンディング切替スコア

//スプライトの基本クラス
class Sprite {
    constructor(sp, x, y, vx, vy) {
        this.sp = sp;
        this.x = x<<8;
        this.y = y<<8;
        this.ay = 0; 
        this.w =16;
        this.h =16;
        this.vx = vx;
        this.vy = vy;
        this.sz = 0;
        this.kill = false;
        this.count = 0;
    }

    //更新処理
    update() {
        if(this.vy < AIR_RESIST) this.vy += GRAVITY; //重力空気抵抗
        this.x += this.vx;
        this.y += this.vy;
        if((this.y>>4) > FIELD_SIZE_H * 16) this.kill = true;
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
            bottom1 >= top2);
    }

}

