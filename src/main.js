//
//メインループ
//
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

let can = document.getElementById("can");
let con = can.getContext("2d");

vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;

can.width = SCREEN_SIZE_W * 2;
can.height = SCREEN_SIZE_H * 2;

con.mozimageSmoothingEnabled = false;
con.msimageSmoothingEnabled = false;
con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;

//フレームレート維持
let frameCount = 0;
let startTime;

let chImg = new Image();
chImg.src ="image/spritemario.png";

//コイン画像用の変数を宣言⭐︎
let coinImage = null;
let faceImage = null;

//キーボード
let keyb = {};

//おじさんを作る
let ojisan = new Ojisan;

//フィールドを作る
let field = new Field();

//オブジェクトの配列
let block = [];
let item = [];
let kuribo = [];
let togezo = [];
let coin = [];
let fireball = [];
let nokonoko = [];
let jyugem = [];
let flags = [];
let hanabi = [];
let hammerBros = [];
let hammer = [];
let hammerBrosFlip = [];

//スコア等表示オブジェクト
let score = 0;
let coinc = 0;
let scorepop = [];
//let lifePoint = 4;

//ゲームステート
let gameState = GAME_START;
//let gameState = GAME_PLAYING;
let gameOverImage = null;
let isGoalNear = false;

//タイマー
let timeLeft = 300;

//メインループ
function mainLoop() {
    if(gameState === GAME_PLAY) {
        let nowTime = performance.now();
        let nowFrame = (nowTime - startTime) / GAME_FPS;

        if(nowFrame > frameCount) {
            let c = 0;
            while(nowFrame > frameCount) {
                frameCount++;
                //更新処理
                update();
                if(++c >= 4)break;
            }
            //描画処理
            draw();
        }
        if (!ojisan.isGoal) {
            const elapsed = nowTime - startTime; //タイマーカウント
            const newTime = 300 - Math.floor(elapsed / 1000); 
            if (newTime >= 0) {
                timeLeft = newTime;
            } else { //タイムオーバーでゲームオーバー
                timeLeft = 0;
                triggerGameOver();
            }
            if(ojisan.lifePoint <= 0 || ojisan.isDead) {
                triggerGameOver();
            }
        }

    } else if (gameState === GAME_OVER) {
        drawGameOverImage();
    }

    //ゴールサウンドへの切替
    const STAGE_WIDTH = (FIELD_SIZE_W * 16) << 4; 
    if (ojisan.x > STAGE_WIDTH * 0.5 && !isGoalNear) {
        startGoalMusicFade();
        isGoalNear = true;
    }
    updateFaceBtnPosition();
    requestAnimationFrame(mainLoop);
}

//更新処理
function update() {

    //マップの更新
    field.update();

    //アイテムの更新
    updateObj(block);
    updateObj(item);
    updateObj(kuribo);
    updateObj(togezo);
    updateObj(coin);
    updateObj(fireball);
    updateObj(nokonoko);
    updateObj(jyugem);
    updateObj(scorepop);
    updateObj(flags);
    updateObj(hanabi);
    updateObj(hammerBros);
    updateObj(hammer);
    updateObj(hammerBrosFlip);

    //おじさんの更新
    ojisan.update();
}

//描画処理
function draw() {
    vcon.fillStyle = "#66AAFF"; //#66AAFF
    vcon.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H);

    for (const h of hammer) {h.draw();}
    
    //マップを表示
    field.draw();

    //アイテムを表示
    drawObj(block);
    drawObj(item);
    drawObj(kuribo);
    drawObj(togezo);
    drawObj(coin);
    drawObj(fireball);
    drawObj(nokonoko);
    drawObj(jyugem);
    drawObj(scorepop);
    drawObj(flags);
    drawObj(hanabi);
    drawObj(hammerBros);
    drawObj(hammer);
    drawObj(hammerBrosFlip);

    //おじさんを表示
    ojisan.draw();

    //仮想画面から実画面へ拡大転送
    con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H,
                  0, 0, SCREEN_SIZE_W * 2, SCREEN_SIZE_H * 2);
    //スコア情報
    const fomattedScore = fomatScore(score);
    con.font = '20px "Press Start 2P", monospace';
    con.fillStyle = "white"; 
    con.fillText("OJISAN", 30, 30);
    con.fillText(fomattedScore, 20, 50);
    con.fillText("WORLD", 310, 30);
    con.fillText("1-1", 320, 50);
    con.fillText("TIME", 430, 30);
    const formattedTime = String(timeLeft).padStart(3, '0');
    con.fillText(formattedTime, 440, 50); 
    
    if (coinImage) { // 画像が読み込まれていれば描画する
        con.drawImage(coinImage, 147, 34, 16, 18);
    }
    con.fillText("x " + coinc, 171, 50);
   
    if (faceImage) { // 画像が読み込まれていれば描画する
        con.drawImage(faceImage, 143, 11, 24, 24);
    }
    con.fillText("x " + ojisan.lifePoint, 171, 30);
}

function drawSprite(snum, x, y) {
    let sx = (snum & 15) << 4;
    let sy = (snum >> 4) << 4;
    vcon.drawImage(chImg, sx, sy, 16, 16, x, y, 16, 16);
}

function drawObj(obj) {
    //スプライトのブロックを表示
    for(let i = 0; i < obj.length; i++)
        obj[i].draw();
}

function updateObj(obj) {
    //スプライトのブロックを更新
    for(let i = obj.length - 1; i >= 0; i--) {
        obj[i].update();
        if(obj[i].kill) obj.splice(i, 1);
    }
}

//スコアを6桁表示
function fomatScore(score) {
    const isNegative = score < 0;
    const absoluteScore = Math.abs(score);
    const paddedNumber = String(absoluteScore). padStart(6, '0');
    let formatted;
    if(isNegative) {
        formatted = `-${paddedNumber}`;
    } else {
        formatted = ` ${paddedNumber}`;
    }
    return formatted;
}

function isBlock(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= FIELD_SIZE_W || ty >= FIELD_SIZE_H) return true;
    const t = fieldData[ty * FIELD_SIZE_W + tx];
    return (
        (t >= 1 && t <= 99) ||     // 地面系
        (t >= 140 && t <= 149) ||  // 土管
        (t >= 160 && t <= 169)     // 固いブロック
    );
}

function findPole() {
    let best = null;
    for (let i = 0; i < fieldData.length; i++) {
        if (fieldData[i] === 500) {
            let x = i % FIELD_SIZE_W;
            let y = Math.floor(i / FIELD_SIZE_W);
            if (!best || x < best.x) {   // 一番左（x が最小）の500 を採用
                best = { x, y };
            }
        }
    }
    return best;
}

function createFlag() {
    flags.length = 0;
    const pole = findPole();
    if (!pole) return;
    const fx = pole.x - 1;   // ← タイル座標で左
    const fy = pole.y;
    flags.push(new Flag(fx, fy));
}

function findBlock() {
    let best = null;
    for (let i = 0; i < fieldData.length; i++) {
        if (fieldData[i] === 372) {
            let x = i % FIELD_SIZE_W;
            let y = Math.floor(i / FIELD_SIZE_W);
            if (!best || x < best.x) {   // 一番左（x が最小）の500 を採用
                best = { x, y };
            }
        }
    }
    return best;
}

function createHammerBros() {
    hammerBros.length = 0;
    const Block = findBlock();
    if (!Block) return;
    const ha1x = Block.x; //タイル座標の上
    const ha1y = Block.y - 1;
    const ha2x = Block.x + 7;
    const ha2y = Block.y - 5;
    hammerBros.push(new HammerBros(134, ha1x, ha1y, 7, 0, ITEM_HAMMERBROS));
    hammerBros.push(new HammerBros(134, ha2x, ha2y, 7, 0, ITEM_HAMMERBROS)); 
}

//キーボードが押されたときに呼ばれる
document.addEventListener('keydown', (e) => {
    if(e.key == 'ArrowLeft') keyb.Left = true;
    if(e.key == 'ArrowRight') keyb.Right = true;
    if(e.key == 'z') keyb.BBUTTON = true;
    if(e.key == 'x') keyb.ABUTTON = true;
    /*if(e.key == 'x') {
        //block.push(new Block(368, 5, 5));
    }*/  
    if(e.key == 'a') field.scx--;
    if(e.key == 's') field.scx++;
    if(e.key == 'c') keyb.FBBUTTON = true;
})

//キーボードが離されたときに呼ばれる
document.addEventListener('keyup', (e) => {
    if(e.key == 'ArrowLeft') keyb.Left = false;
    if(e.key == 'ArrowRight') keyb.Right = false;
    if(e.key == 'z') keyb.BBUTTON = false;
    if(e.key == 'x') keyb.ABUTTON = false;
    //if(e.key == 'c') keyb.FBBUTTON = false;
})

const leftb = document.getElementById("LeftB");
const rightb = document.getElementById("RightB");
const abtn = document.getElementById("Abtn");
const bbtn = document.getElementById("Bbtn");
//タッチされたときに呼ばれる
leftb.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyb.Left = true;
})
rightb.addEventListener('touchstart', (e) => {
    e.preventDefault();
    keyb.Right = true;
})
abtn.addEventListener('touchstart', (e) => {
    e.preventDefault();  
    keyb.ABUTTON = true;
})
bbtn.addEventListener('touchstart', (e) => {
    e.preventDefault();  
    keyb.FBBUTTON = true;
})

//タッチが離されたときに呼ばれる
leftb.addEventListener('touchend', (e) => {
    keyb.Left = false; 
    e.preventDefault(); return false;
})
rightb.addEventListener('touchend', (e) => {
    keyb.Right = false;
    e.preventDefault(); return false;
})
abtn.addEventListener('touchend', (e) => {
    keyb.ABUTTON = false;
    e.preventDefault(); return false;
})
/*bbtn.addEventListener('touchend', (e) => {
    e.preventDefault();  
    keyb.FBBUTTON = false;
})*/

//敵の配置
function enemyDraw() {
    kuribo.push(new Kuribo(163, 16, 0, 12, 0, ITEM_KURIBO));
    kuribo.push(new Kuribo(163, 24, 0, 12, 0, ITEM_KURIBO));
    kuribo.push(new Kuribo(163, 40, 0, 12, 0, ITEM_KURIBO));
    kuribo.push(new Kuribo(163, 54, 0, 12, 0, ITEM_KURIBO));
    kuribo.push(new Kuribo(163, 63, 0, 12, 0, ITEM_KURIBO));
    kuribo.push(new Kuribo(163, 78, 0, 12, 0, ITEM_KURIBO));
    kuribo.push(new Kuribo(163, 102, 0, 12, 0, ITEM_KURIBO));
    kuribo.push(new Kuribo(163, 160, 0, 12, 0, ITEM_KURIBO));
    kuribo.push(new Kuribo(163, 162, 0, 12, 0, ITEM_KURIBO));
    nokonoko.push(new Nokonoko(163, 14, 0, 8, 0, ITEM_NOKONOKO));
    nokonoko.push(new Nokonoko(163, 32, 0, 8, 0, ITEM_NOKONOKO));
    nokonoko.push(new Nokonoko(163, 48, 0, 8, 0, ITEM_NOKONOKO));
    nokonoko.push(new Nokonoko(163, 60, 0, 8, 0, ITEM_NOKONOKO));
    nokonoko.push(new Nokonoko(163, 78, 0, 8, 0, ITEM_NOKONOKO));
    nokonoko.push(new Nokonoko(163, 96, 0, 8, 0, ITEM_NOKONOKO));
    nokonoko.push(new Nokonoko(163, 112, 0, 8, 0, ITEM_NOKONOKO));
    nokonoko.push(new Nokonoko(163, 128, 0, 8, 0, ITEM_NOKONOKO));
    nokonoko.push(new Nokonoko(163, 160, 0, 8, 0, ITEM_NOKONOKO));
    nokonoko.push(new Nokonoko(163, 162, 0, 8, 0, ITEM_NOKONOKO));
    jyugem.push(new Jyugem(107, 1, 1, 11, 0, ITEM_JYUGEM));
    jyugem.push(new Jyugem(107, 40, 2, 11, 0, ITEM_JYUGEM));
    jyugem.push(new Jyugem(107, 80, 3, 11, 0, ITEM_JYUGEM));
    jyugem.push(new Jyugem(107, 100, 4, 11, 0, ITEM_JYUGEM));
    jyugem.push(new Jyugem(107, 100, 1, -11, 0, ITEM_JYUGEM));
    jyugem.push(new Jyugem(107, 130, 2, -11, 0, ITEM_JYUGEM));
    jyugem.push(new Jyugem(107, 160, 3, -11, 0, ITEM_JYUGEM));
    jyugem.push(new Jyugem(107, 188, 4, -11, 0, ITEM_JYUGEM));
}

//ゴール直前サウンド切り替え
function startGoalMusicFade() {
    fadeOutBgm(bgmSound, 60); //60フレームでフェード
    fadeInBgm(goalSound, 60);
}

function fadeOutBgm(audio, frames) {
    let volume = audio.volume;
    const step = volume / frames;
    const fade = setInterval(() => {
        volume -= step;
        if(volume <= 0) {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 1;
            clearInterval(fade);
        } else {
            audio.volume = volume;
        }
    }, 1000 / 60);
} 

function fadeInBgm(audio, frames) {
    let volume = 0;
    audio.volume = 0;
    audio.currentTime = 0;
    audio.play();
    const step = 1 / frames;
    const fade = setInterval(() => {
        volume += step;
        if(volume >= 1) {
            audio.volume = 1;
            clearInterval(fade);
        } else {
            audio.volume = volume;
        }
    }, 1000 / 60);
} 

//画像の事前読み込み
function loadImageAssets() {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
        gameOverImage = img;
        gameState = GAME_PLAY;
    }
    img.src = "image/ojigameover.png";
}

//ゲームオーバー画像
function drawGameOverImage() {
    // 画面を一度クリアするか、黒いオーバーレイをかける
    con.fillStyle = "#000000";
    con.fillRect(0, 0, can.width, can.height);

    // ゲームオーバー画像を描画
    if (gameOverImage) {
        const imgW = gameOverImage.width;
        const imgH = gameOverImage.height;
        const drawX = (can.width / 2) - (imgW / 2);
        const drawY = (can.height / 2) - (imgH / 2);
        con.drawImage(gameOverImage, drawX, drawY, imgW, imgH);
    }

    // ゲームオーバー画面のスコアとタイムの描画
    con.font = '30px "Press Start 2P", monospace';
    con.fillStyle = "white";
    con.textAlign = 'center'; // 中央揃えに設定

    const formattedScore = fomatScore(score);
    // 画像の下にスコアを表示
    con.fillText("SCORE:" + formattedScore, can.width / 2, (can.height / 2) + 170); 
    // さらに下にタイムを表示
    const coinct = String(coinc).padStart(6, '0');
    con.fillText("COIN : " + coinct, can.width / 2, (can.height / 2) + 200); 
    con.textAlign = 'left'; // textAlignをデフォルト（左揃え）に戻す
}

//ゲームオーバーのトリガー
function triggerGameOver() {
    if(gameState === GAME_OVER) 
        return;
    gameState = GAME_OVER;
    if(bgmSound) {
        bgmSound.pause();
        bgmSound.currentTime = 0;   
    }
    if(goalSound) {
        goalSound.pause();
        goalSound.currentTime = 0;   
    }
    gameoverSound.play();
    setTimeout(() => {
        window.location.reload(true); // 強制的に再読み込みしてスタートに戻る
    },5000); // 5000ミリ秒 = 5秒
}

//ゲームリロード処理
document.getElementById("faceBtn").addEventListener("pointerdown", () => {
    window.location.reload(true);
});
function updateFaceBtnPosition() {
    const faceBtn = document.getElementById("faceBtn");
    const rect = can.getBoundingClientRect();
    // 内部解像度
    const INTERNAL_W = can.width;   // 640
    const INTERNAL_H = can.height;  // 480
    // 顔アイコンの内部座標（描画位置）
    const FACE_X = 143;
    const FACE_Y = 11;
    // 表示時のスケールに合わせて位置を計算
    const fx = rect.left + (FACE_X / INTERNAL_W) * rect.width;
    const fy = rect.top  + (FACE_Y / INTERNAL_H) * rect.height;
    // 顔の大きさ（24×24 を 2倍で描画しているので → 表示はスケールされる）
    const fw = (24 / INTERNAL_W) * rect.width * 2;
    const fh = (24 / INTERNAL_H) * rect.height * 2;
    faceBtn.style.left = fx + "px";
    faceBtn.style.top  = fy + "px";
    faceBtn.style.width = fw + "px";
    faceBtn.style.height = fh + "px";
}

function setupOjisanButton() {
    const overlay = document.getElementById("gameOverlay");
    if (!overlay) return;

    if (!document.getElementById("ojisanBtn")) {
        const obtn = document.createElement("button");
        obtn.id = "ojisanBtn";
        overlay.appendChild(obtn);

        obtn.addEventListener("click", () => {
            location.reload(true);
        });
    }
}

function getOjisanScreenPos() {  // ===== Ojisan UI 用：画面座標取得 =====
    // ojisan は 16倍座標なので px に戻す
    const sx = (ojisan.x >> 4) - field.scx;
    const sy = (ojisan.y >> 4) - field.scy;
    const rect = can.getBoundingClientRect();
    const scaleX = rect.width / can.width;
    const scaleY = rect.height / can.height;
    return {
        x: rect.left + sx * scaleX,
        y: rect.top  + sy * scaleY
    };
}

function showOjisanButton(wx, wy) {
    const btn = document.getElementById("ojisanBtn");
    if (!btn) return;

    const rect = can.getBoundingClientRect();
    const sx = wx - field.scx; // ワールド → 画面（内部座標）
    const sy = wy - field.scy;
    const scaleX = rect.width  / can.width;  // 内部 → CSS
    const scaleY = rect.height / can.height;

    btn.style.left = rect.left + sx * scaleX + "px";
    btn.style.top  = rect.top  + sy * scaleY + "px";
    btn.style.display = "block";

    // ジャンプ演出
    btn.classList.remove("jump");
    void btn.offsetWidth;
    btn.classList.add("jump");
    hahaSound.play();

    // ★ ジャンプが終わったらふわふわ開始
    setTimeout(() => {
        btn.classList.add("float");
    }, 800); // jump の animation 時間と合わせる
}

function gameStart() {  //スタートボタンでゲーム開始
    document.getElementById("mstart").style.visibility = "hidden";   //スタートボタン非表示
    if (gameState !== GAME_START) return;
    startSound1.play();
    startSound1.addEventListener("ended", function(){
        startSound2.play();
    });
    startSound2.addEventListener("ended", function(){
        bgmSound.loop = true;
        bgmSound.play();
    }); 
    const imgCoin = new Image();
    imgCoin.onload = () => {
        coinImage = imgCoin; // 読み込み完了後に変数にセット
    }
    imgCoin.src = "image/coin.png";

    const imgFace = new Image();
    imgFace.onload = () => {
        faceImage = imgFace; // 読み込み完了後に変数にセット
    }
    imgFace.src = "image/ojiface.png";
    
    loadImageAssets();

    startTime = performance.now();
    //アイテムの配置
    ojisan.draw();
    //enemyDraw();
    createFlag();
    createHammerBros();
    setupOjisanButton();
    //メインループ
    mainLoop();
}