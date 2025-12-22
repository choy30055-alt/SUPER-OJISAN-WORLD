//
//花火のクラス
//
class Hanabi_A {
    constructor(sp, x, y, vx, vy, tp) {
        this.x = x<<4;
        this.y = y<<4;
        this.ay = 0;
        this.w = 16;
        this.h = 16;
        this.vx = vx;
        this.vy = vy;
        this.sp = sp;
        this.sz = 16;
        this.anim = 0;
        this.snum = 0;
        this.kill = false;
        this.count = 0;
        this.acou = 0; 
        this.tp = tp;
    }   
    //更新処理
    update() {
        if(this.kill) return;
        this.acou++;  //アニメ用のカウンタ
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
        let s = 16;
        vcon.drawImage(chImg, sx, sy, 16, s, px, py, 16, 16);
    }
    updateAnim() {
        //アニメスプライトの決定
        this.sp = 203 + ((this.acou / 10) % 5); //3で割ると0,1,2
    }
}

class Hanabi_S { 
constructor(x, y, vx, vy, tp) {    
    this.x = x << 4;
    this.y = y << 4;
    this.vx = vx; 
    this.vy = vy;
    this.tp = tp;
    //this.color = color;
    this.state = 0;       // 0:上昇, 1:爆発
    this.kill = false;
    this.trail = [];
    this.particles = [];
}
    update() {
        if (this.kill) return;

        // --- 上昇 ---
        if (this.state === 0) {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.3;

            this.trail.push({ x: this.x, y: this.y, a: 1 });
            if (this.trail.length > 20) this.trail.shift();
            for (let t of this.trail) t.a -= 0.05;

            if (this.vy >= 0) {
                this.state = 1;
                this.explodeBig();
                this.explodeCore();
            }
            return;
        }
        // --- 爆発 ---
        let alive = false;

        for (let p of this.particles) {
            if (p.life > 0) alive = true;
            // ★ 色変化：外円だけ超チカチカ
            if (!p.sparkle) {
                // 外円：毎フレームランダム
                p.color = p.palette[(Math.random() * p.palette.length) | 0];
            } else {
                // 中心コア：ゆっくり変化
                if (p.life % 6 === 0) {
                    p.color = p.palette[(Math.random() * p.palette.length) | 0];
                }
            }
            // 物理
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.vy += p.gravity;
            p.life--;
        }
        if (!alive) this.kill = true;
    }
    draw() {
        if (this.kill) return;
        // --- 上昇 ---
        if (this.state === 0) {
            vcon.save();
            vcon.globalCompositeOperation = "lighter";
            for (let t of this.trail) {
                vcon.globalAlpha = t.a;
                vcon.fillStyle = this.color;
                vcon.beginPath();
                vcon.arc((t.x >> 4) - field.scx + 8, (t.y >> 4) - field.scy + 8, 0.5, 0, Math.PI * 2);
                vcon.fill();
            }
            vcon.restore();
            return;
        }
        // --- 外円（星みたいに煌めく粒） ---
        for (let p of this.particles) {
            if (p.life <= 0 || p.sparkle) continue;
            // ベースの明るさ（寿命）
            const base = Math.min(1, p.life / 70);
            // ランダムな瞬き（毎フレーム揺らぐ）
            const flicker = 0.6 + Math.random() * 0.9;
            // たまに強く光るフラッシュ
            const flash = (Math.random() < 0.12) ? 2.5 : 1.0;
            vcon.save();
            vcon.globalAlpha = base * flicker * flash * 1.6;
            vcon.fillStyle = p.color;
            vcon.beginPath();
            vcon.arc((p.x >> 4) - field.scx + 8, (p.y >> 4) - field.scy + 8, 1.0, 0, Math.PI * 2); //円サイズ
            vcon.fill();
            vcon.restore();
        }
        // --- 外円（星みたいに煌めく粒） ---
        for (let p of this.particles) {
            if (p.life <= 0 || p.sparkle) continue;
            // ベースの明るさ（寿命）
            const base = Math.min(1, p.life / 50);
            // ランダムな瞬き（毎フレーム揺らぐ）
            const flicker = 0.6 + Math.random() * 0.9;
            // たまに強く光るフラッシュ
            const flash = (Math.random() < 0.12) ? 2.5 : 1.0;
            vcon.save();
            vcon.globalAlpha = base * flicker * flash * 1.6;
            vcon.fillStyle = p.color;
            vcon.beginPath();
            vcon.arc((p.x >> 4) - field.scx + 8, (p.y >> 4) - field.scy + 8, 1.5, 0, Math.PI * 2 //円サイズ
            );
            vcon.fill();
            vcon.restore();
        }
        // --- 中心コア（発光） ---
        vcon.save();
        vcon.globalCompositeOperation = "lighter";
        for (let p of this.particles) {
            if (p.life <= 0 || !p.sparkle) continue;
            vcon.save();
            vcon.globalAlpha = (p.life / 40) * 4.0;
            vcon.fillStyle = p.color;
            vcon.beginPath();
            vcon.arc((p.x >> 4) - field.scx + 8,(p.y >> 4) - field.scy + 8, 1.0, 0, Math.PI * 2); //円サイズ
            vcon.fill();
            vcon.restore();
        }
        vcon.restore();
    }
    // 外円：キラキラ・チカチカ
    explodeBig() {
        const NUM = 300;
        const COLORS = [
            "red","yellow","cyan","lime","orange","pink",
            "purple","white","blue","magenta","gold",
            "deeppink","aqua","chartreuse","hotpink","dodgerblue","springgreen",
            "fuchsia","greenyellow","turquoise","violet"
        ];

        for (let i = 0; i < NUM; i++) {
            const angle = (i / NUM) * Math.PI * 2;
            const speed = 30 + Math.random() * 40;

            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 60 + Math.random() * 80,
                gravity: 0.35,
                sparkle: false,
                palette: COLORS,
                color: COLORS[i % COLORS.length]
            });
        }
    }
    // 中心コア
    explodeCore() {
        const NUM = 200;
        const COLORS = [
            "red","yellow","cyan","lime","orange","pink",
            "purple","white","blue","magenta","gold",
            "deeppink","aqua","chartreuse","hotpink","dodgerblue","springgreen",
            "fuchsia","greenyellow","turquoise","violet"
        ];

        for (let i = 0; i < NUM; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 8 + Math.random() * 10;

            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 40 + Math.random() * 25,
                gravity: 0.45,
                sparkle: true,
                palette: COLORS,
                color: COLORS[i % COLORS.length]
            });
        }
    }
}

class Hanabi_SS {
    constructor(x, y, vx, vy, tp, color = "gold") {  
        this.x = x << 4;
        this.y = y << 4;
        this.vx = vx;
        this.vy = vy;
        this.tp = tp;
        this.color = color;
        this.state = 0;       // 0:上昇, 1:ナイアガラ
        this.kill = false;
        this.trail = [];
        this.particles = [];
    }
    update() {
        if (this.kill) return;

        // --- 上昇 ---
        if (this.state === 0) {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.3;

            this.trail.push({ x: this.x, y: this.y, a: 1 });
            if (this.trail.length > 20) this.trail.shift();
            for (let t of this.trail) t.a -= 0.05;

            if (this.vy >= 0) {
                this.state = 1;
                this.explodeNiagara();
            }
            return;
        }
        // --- ナイアガラ ---
        let alive = false;

        for (let p of this.particles) {
            if (p.life > 0) alive = true;
            if (p.life <= 0) continue;

            p.px = p.x;
            p.py = p.y;
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;
            p.gravity += p.growG;

            // ★キラキラ派生（初期だけ・上限あり）
            if (!p.sparkle && p.life > 40 && this.particles.length < 1400) {
                if (Math.random() < 0.22) {
                    this.particles.push({
                        x: p.x,
                        y: p.y,
                        px: p.x,
                        py: p.y,
                        vx: (Math.random() - 0.5) * 5,
                        vy: (Math.random() - 0.2) * 5,
                        drag: 0.88,
                        gravity: 0.22,
                        growG: 0,
                        life: 12 + (Math.random() * 12 | 0),
                        sparkle: true,
                        size: 0.2 + Math.random() * 0.7,
                        palette: p.sparkPalette,
                        color: p.sparkPalette[(Math.random() * p.sparkPalette.length) | 0]
                    });
                }
            }
            // 色ゆらぎ
            if ((p.life & 7) === 0) {
                p.color = p.palette[(Math.random() * p.palette.length) | 0];
            }
            p.life--;
        }
        if (!alive) this.kill = true;
    }
    draw() {
        if (this.kill) return;

        // --- 上昇 ---
        if (this.state === 0) {
            vcon.save();
            vcon.globalCompositeOperation = "lighter";
            for (let t of this.trail) {
                vcon.globalAlpha = t.a;
                vcon.fillStyle = this.color;
                vcon.beginPath();
                vcon.arc((t.x >> 4) - field.scx + 8, (t.y >> 4) - field.scy + 8, 0.6, 0, Math.PI * 2);
                vcon.fill();
            }
            vcon.restore();
            return;
        }

        // --- 主粒（しだれ柳） ---
        vcon.save();
        vcon.globalCompositeOperation = "source-over";

        for (let p of this.particles) {
            if (p.life <= 0 || p.sparkle) continue;

            const base = Math.min(1, p.life / 140);
            const flicker = 0.8 + Math.random() * 0.4;

            vcon.globalAlpha = base * flicker;
            vcon.strokeStyle = p.color;
            vcon.lineWidth = 1.4; // ★枝を太めに
            vcon.beginPath();
            vcon.moveTo((p.px >> 4) - field.scx + 8, (p.py >> 4) - field.scy + 8);
            vcon.lineTo((p.x  >> 4) - field.scx + 8, (p.y  >> 4) - field.scy + 8);
            vcon.stroke();
            vcon.fillStyle = p.color;
            vcon.beginPath();
            vcon.arc((p.x >> 4) - field.scx + 8, (p.y >> 4) - field.scy + 8, p.size, 0, Math.PI * 2);
            vcon.fill();
        }
        vcon.restore();
        // --- キラキラ（白飛び抑制） ---
        vcon.save();
        vcon.globalCompositeOperation = "lighter";

        for (let p of this.particles) {
            if (p.life <= 0 || !p.sparkle) continue;

            const base = Math.min(1, p.life / 18);
            const flicker = 0.2 + Math.random() * 0.6;
            const flash = (Math.random() < 0.08) ? 1.6 : 1.0;

            vcon.globalAlpha = base * flicker * flash;
            vcon.fillStyle = p.color;
            vcon.beginPath();
            vcon.arc((p.x >> 4) - field.scx + 8, (p.y >> 4) - field.scy + 8, p.size, 0, Math.PI * 2);
            vcon.fill();
        }
        vcon.restore();
    }
    // --- ナイアガラ生成（3発同時・一度きり想定） ---
    explodeNiagara() {
        const NUM = 300; // ★3発同時の安全上限
        const COLORS = [
            "gold", "goldenrod", "khaki",
            "moccasin", "orange", "darkorange", "lemonchiffon"
        ];
        const SPARK_COLORS = [
            "lightyellow", "lemonchiffon", "gold", "khaki", "moccasin"
        ];
        for (let i = 0; i < NUM; i++) {
            const angle = (i / NUM) * Math.PI * 2;
            const speed = 20 + Math.random() * 20;

            this.particles.push({
                x: this.x,
                y: this.y,
                px: this.x,
                py: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed * 0.85,

                drag: 0.97,
                gravity: 0.05,
                growG: 0.002,

                life: 140 + (Math.random() * 140 | 0),
                sparkle: false,
                palette: COLORS,
                sparkPalette: SPARK_COLORS,
                color: COLORS[i % COLORS.length],

                size: 0.8 + Math.random() * 0.7
            });
        }
    }
}

//カラーリスト
/*"gold", "goldenrod", "yellow", "lightyellow", "khaki",
  "moccasin", "orange", "darkorange", "lemonchiffon", // 金色系

  "hotpink", "deeppink", "fuchsia", "magenta", "pink", "lightpink",
  "mediumvioletred", "palevioletred"    // ピンク系

  "hotpink", "deeppink", "fuchsia", "magenta",
  "lime", "chartreuse", "greenyellow", "yellow", "gold",
  "springgreen", "aqua", "turquoise",
  "dodgerblue", "cyan", "violet"

  "red","yellow","cyan","lime","orange","pink",
  "purple","white","blue","magenta","gold",
  "deeppink","aqua","chartreuse","hotpink","dodgerblue","springgreen",
  "fuchsia","greenyellow","turquoise","violet"

  "chartreuse", "lime", "springgreen", "mediumspringgreen",
  "lightgreen", "#66ff00", "#00ffaa" //グリーン系

  "deeppink", "hotpink", "magenta", "crimson", "orangered",
    "#ff0044", "#ff3366" //赤ピンク系　*/

/*const RED_SET = [
  "crimson", "red", "orangered",
  "deeppink", "hotpink", "#ff3366"
];

const GREEN_SET = [
  "lime", "limegreen", "springgreen",
  "mediumspringgreen", "#00ff88"
];

const GOLD_SET = [
  "gold", "goldenrod", "yellow",
  "khaki", "moccasin", "orange"
];

const SILVER_SET = [
  "white", "whitesmoke", "gainsboro",
  "silver", "lightgray"
];

const BLUE_SET = [
  "deepskyblue", "dodgerblue",
  "royalblue", "cyan", "#66ccff"
];

const PURPLE_SET = [
  "violet", "purple", "magenta",
  "mediumpurple", "#cc66ff"
]; */
