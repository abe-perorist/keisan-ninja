import {
    REWARD_ITEMS,
    GACHA_PRICES,
    getOwnedItemIds,
    getEquippedItemId,
    setEquippedItemId,
    getItemById,
    pullSingleGacha,
    pullMultipleGacha,
} from './rewards.js';

class Game {
    constructor() {
        this.score = 0;
        this.questionCount = 0;
        this.timeLimit = 5;
        this.totalTimeLimit = 60;
        this.totalTimeLeft = 60;
        this.questionTimer = null;
        this.totalTimerInterval = null;
        this.isPlaying = false;
        this.currentOperator = null;
        this.app = document.getElementById('app');

        this.totalStars = parseInt(localStorage.getItem('keisanNinjaTotalStars'), 10) || 0;
        this.equippedItem = getItemById(getEquippedItemId());

        this.audioCtx = null;
        this.sounds = {
            correct: new Audio('sounds/correct.mp3'),
            incorrect: new Audio('sounds/incorrect.mp3'),
            start: new Audio('sounds/start.mp3'),
            end: new Audio('sounds/end.mp3'),
        };
        Object.values(this.sounds).forEach(s => s.load());

        this.storyScrollsList = [
            { rank: '見習い', emoji: '🌱', title: '風の巻物', text: '忍者の道場へようこそ！📜 ここからはじめての修行が始まる。基本の計算術をしっかり身につけるのじゃ！' },
            { rank: '下忍', emoji: '🌟', title: '地の巻物', text: '最初の試練を乗り越えた！🌟 村人たちがお前の才能を認め始めた。計算の手裏剣をさらに磨き続けよ！' },
            { rank: '中忍', emoji: '⚔️', title: '水の巻物', text: '数字の真の戦士！⚔️ より難しい任務を任されるようになった。速さと正確さがお前の最強の武器だ。' },
            { rank: '上忍', emoji: '🥷', title: '火の巻物', text: '見事だ、精鋭の忍者よ！🥷 影の里はお前の素早い計算を頼りにしている。さらなる高みへ、奥義を極めよ。' },
            { rank: '超忍', emoji: '⚡', title: '雷の巻物', text: '信じられない！その速さはまるで稲妻だ！⚡ お前は通常の限界を超え、超忍の境地へと達した。' },
            { rank: '計算仙人', emoji: '🔮', title: '空の巻物', text: '宇宙の秘密を解き明かしたのじゃ。🔮 数学の古代巻物がお前の叡智に頭を垂れている。' },
            { rank: '計算神', emoji: '👑', title: '天の巻物', text: 'これが最終章。👑 お前は計算神だ！すべての数字がお前の意思に従う。その伝説は永遠に語り継がれるであろう。📜' }
        ];

        this.unlockedScrolls = this.loadUnlockedScrolls();

        this.highScores = {
            'intro-add': this.loadHighScore('intro-add'),
            'intro-sub': this.loadHighScore('intro-sub'),
            'intro-add-blank': this.loadHighScore('intro-add-blank'),
            'intro-sub-blank': this.loadHighScore('intro-sub-blank'),
            '+': this.loadHighScore('addition'),
            '-': this.loadHighScore('subtraction'),
            '×': this.loadHighScore('multiplication'),
            '÷': this.loadHighScore('division'),
            special: this.loadHighScore('special'),
            hyper: this.loadHighScore('hyper'),
            master: this.loadHighScore('master'),
        };

        this.renderModeSelect();
    }

    loadHighScore(key) {
        return parseInt(localStorage.getItem(`keisanNinjaHighScore_${key}`), 10) || 0;
    }

    loadFailedProblems() {
        try {
            return JSON.parse(localStorage.getItem('keisanNinjaFailedProblems')) || [];
        } catch {
            return [];
        }
    }

    saveFailedProblem(q) {
        let failed = this.loadFailedProblems();
        if (!failed.some(f => f.text === q.text)) {
            failed.push(q);
            if (failed.length > 200) failed.shift();
            localStorage.setItem('keisanNinjaFailedProblems', JSON.stringify(failed));
        }
    }

    removeFailedProblem(q) {
        let failed = this.loadFailedProblems();
        failed = failed.filter(f => f.text !== q.text);
        localStorage.setItem('keisanNinjaFailedProblems', JSON.stringify(failed));
    }

    loadUnlockedScrolls() {
        try {
            const data = localStorage.getItem('keisanNinjaUnlockedScrolls');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    saveUnlockedScrolls() {
        localStorage.setItem('keisanNinjaUnlockedScrolls', JSON.stringify(this.unlockedScrolls));
    }

    saveHighScore(operator, score) {
        const keys = { 'intro-add': 'intro-add', 'intro-sub': 'intro-sub', 'intro-add-blank': 'intro-add-blank', 'intro-sub-blank': 'intro-sub-blank', '+': 'addition', '-': 'subtraction', '×': 'multiplication', '÷': 'division', special: 'special', hyper: 'hyper', master: 'master' };
        localStorage.setItem(`keisanNinjaHighScore_${keys[operator]}`, score.toString());
    }

    getRankInfo(score, operator) {
        if (operator === 'intro-add' || operator === 'intro-sub' || operator === 'intro-add-blank' || operator === 'intro-sub-blank') {
            if (score >= 90)  return { name: 'けいさんめいじん', emoji: '🌟', color: '#f39c12' };
            if (score >= 60)  return { name: 'けいさんじょうず', emoji: '😊', color: '#27ae60' };
            if (score >= 30)  return { name: 'がんばりや',       emoji: '💪', color: '#3498db' };
            return { name: 'ちょうせんちゅう', emoji: '🌱', color: '#9b59b6' };
        }
        if (operator === 'hyper') {
            if (score >= 180) return { name: '超忍',  emoji: '⚡', color: '#a29bfe' };
            if (score >= 140) return { name: '上忍',  emoji: '🥷', color: '#e74c3c' };
            if (score >= 100) return { name: '中忍',  emoji: '⚔️', color: '#f39c12' };
            if (score >= 50)  return { name: '下忍',  emoji: '🌟', color: '#3498db' };
            return { name: '見習い', emoji: '🌱', color: '#2ecc71' };
        }
        if (operator === 'special') {
            if (score >= 180) return { name: '計算神', emoji: '👑', color: '#f39c12' };
            if (score >= 140) return { name: '計算仙人', emoji: '🔮', color: '#a29bfe' };
            if (score >= 100) return { name: '上忍',   emoji: '🥷', color: '#e74c3c' };
            if (score >= 60)  return { name: '中忍',   emoji: '⚔️', color: '#3498db' };
            if (score >= 30)  return { name: '下忍',   emoji: '🌟', color: '#3498db' };
            return { name: '見習い', emoji: '🌱', color: '#2ecc71' };
        }
        if (operator === 'master') {
            if (score >= 180) return { name: '計算神', emoji: '👑', color: '#f39c12' };
            if (score >= 140) return { name: '計算仙人', emoji: '🔮', color: '#a29bfe' };
            if (score >= 100) return { name: '上忍',   emoji: '🥷', color: '#e74c3c' };
            if (score >= 60)  return { name: '中忍',   emoji: '⚔️', color: '#3498db' };
            return { name: '下忍', emoji: '🌟', color: '#2ecc71' };
        }
        if (score >= 140) return { name: '上忍', emoji: '🥷', color: '#e74c3c' };
        if (score >= 100) return { name: '中忍', emoji: '⚔️', color: '#f39c12' };
        if (score >= 50)  return { name: '下忍', emoji: '🌟', color: '#3498db' };
        return { name: '見習い', emoji: '🌱', color: '#2ecc71' };
    }

    renderModeSelect() {
        this.equippedItem = getItemById(getEquippedItemId());
        const modes = [
            { op: '+', label: '足し算', symbol: '＋', color: '#27ae60' },
            { op: '-', label: '引き算', symbol: '－', color: '#2980b9' },
            { op: '×', label: '掛け算', symbol: '✕', color: '#e67e22' },
            { op: '÷', label: '割り算', symbol: '÷', color: '#8e44ad' },
        ];
        const hsLabels = { 'intro-add': 'にゅうもん＋', 'intro-sub': 'にゅうもん－', 'intro-add-blank': 'にゅうもん＋？', 'intro-sub-blank': 'にゅうもん－？', '+': '足し算', '-': '引き算', '×': '掛け算', '÷': '割り算', special: '特訓', hyper: 'ハイパー', master: 'マスター' };

        this.app.innerHTML = `
            <div class="screen mode-select-screen">
                <div class="home-hud">
                    <div class="hud-equipped" id="hudEquippedBox" title="コレクション・そうび変更">
                        <span class="hud-avatar">${this.equippedItem.emoji}</span>
                        <div class="hud-name-box">
                            <span class="hud-role">相棒忍者</span>
                            <span class="hud-name">${this.equippedItem.name}</span>
                        </div>
                    </div>
                    <div class="hud-stars" id="hudStarsBox">
                        <span class="hud-star-icon">🌟</span>
                        <span>${this.totalStars}</span>
                    </div>
                </div>

                <div class="title-area">
                    <div class="title-logo">${this.equippedItem.emoji}</div>
                    <h1 class="game-title">計算忍者</h1>
                </div>

                <div class="home-nav-grid">
                    <button class="home-nav-btn home-nav-gacha" id="homeBtnGacha">
                        <span>🏪</span>
                        <span>忍 ガチャ</span>
                    </button>
                    <button class="home-nav-btn home-nav-collection" id="homeBtnCollection">
                        <span>📖</span>
                        <span>忍者ずかん</span>
                    </button>
                </div>

                <div class="intro-grid">
                    <button class="intro-mode-btn" data-op="intro-add">
                        <span class="intro-icon">🌸</span>
                        <span class="intro-text">
                            <span class="intro-label">にゅうもん たしざん</span>
                            <span class="intro-desc">a＋b＝？</span>
                        </span>
                    </button>
                    <button class="intro-mode-btn" data-op="intro-sub">
                        <span class="intro-icon">🌼</span>
                        <span class="intro-text">
                            <span class="intro-label">にゅうもん ひきざん</span>
                            <span class="intro-desc">a－b＝？</span>
                        </span>
                    </button>
                    <button class="intro-mode-btn blank-mode" data-op="intro-add-blank">
                        <span class="intro-icon">⭐</span>
                        <span class="intro-text">
                            <span class="intro-label">たしざん（虫食い）</span>
                            <span class="intro-desc">a＋？＝c</span>
                        </span>
                    </button>
                    <button class="intro-mode-btn blank-mode" data-op="intro-sub-blank">
                        <span class="intro-icon">⭐</span>
                        <span class="intro-text">
                            <span class="intro-label">ひきざん（虫食い）</span>
                            <span class="intro-desc">a－？＝c</span>
                        </span>
                    </button>
                </div>
                <div class="mode-grid">
                    ${modes.map(m => `
                        <button class="mode-btn" data-op="${m.op}" style="--c:${m.color}">
                            <span class="mode-symbol">${m.symbol}</span>
                            <span class="mode-label">${m.label}</span>
                        </button>
                    `).join('')}
                </div>
                <button class="special-mode-btn" data-op="special">✨ 特訓</button>
                <button class="hyper-mode-btn" data-op="hyper">
                    <span class="hyper-icon">⚡</span>
                    <span class="hyper-text">
                        <span class="hyper-label">ハイパー</span>
                        <span class="hyper-desc">インド式 × 虫食い算</span>
                    </span>
                </button>
                <button class="master-mode-btn" data-op="master">
                    <span class="master-icon">👑</span>
                    <span class="master-text">
                        <span class="master-label">マスター</span>
                        <span class="master-desc">2桁虫食い × 複合演算</span>
                    </span>
                </button>
                <div class="hs-panel">
                    <p class="hs-heading">ハイスコア</p>
                    <div class="hs-grid">
                        ${Object.entries(this.highScores).map(([op, s]) => `
                            <div class="hs-cell">
                                <span class="hs-name">${hsLabels[op]}</span>
                                <span class="hs-val">${s}<small>点</small></span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.app.querySelector('#homeBtnGacha').addEventListener('click', () => this.renderGachaScreen());
        this.app.querySelector('#homeBtnCollection').addEventListener('click', () => this.renderCollectionScreen());
        this.app.querySelector('#hudEquippedBox').addEventListener('click', () => this.renderCollectionScreen());
        this.app.querySelector('#hudStarsBox').addEventListener('click', () => this.renderGachaScreen());

        this.app.querySelectorAll('[data-op]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentOperator = btn.dataset.op;
                this.startGame();
            });
        });
    }

    startGame() {
        this.score = 0;
        this.questionCount = 0;
        
        if (this.currentOperator === 'special') {
            this.trainingPool = this.loadFailedProblems();
            this.trainingPool.sort(() => Math.random() - 0.5);
            if (this.trainingPool.length > 0) {
                this.sessionMaxQ = Math.min(45, this.trainingPool.length);
            } else {
                this.sessionMaxQ = 45;
            }
        } else {
            this.sessionMaxQ = ['intro-add', 'intro-sub', 'intro-add-blank', 'intro-sub-blank'].includes(this.currentOperator) ? 10 : this.currentOperator === 'hyper' || this.currentOperator === 'master' ? 20 : 15;
        }

        const isIntro = ['intro-add', 'intro-sub', 'intro-add-blank', 'intro-sub-blank'].includes(this.currentOperator);
        this.timeLimit = isIntro ? 30 : this.currentOperator === 'hyper' ? 7 : this.currentOperator === 'master' ? 30 : 5;
        this.totalTimeLeft = isIntro ? 120 : this.totalTimeLimit;
        this.isPlaying = true;
        this.sounds.start.play().catch(() => {});
        this.renderGameScreen();
        this.startTotalTimer();
        this.showNextQuestion();
    }

    renderGameScreen() {
        this.equippedItem = getItemById(getEquippedItemId());
        const maxQ = this.sessionMaxQ;
        const isBlankTheme = ['intro-add-blank', 'intro-sub-blank'].includes(this.currentOperator);
        this.app.innerHTML = `
            <div class="screen game-screen${isBlankTheme ? ' blank-theme' : ''}">
                <div class="game-header">
                    <div class="stat-box" style="flex-direction: row; align-items: center; gap: 8px;">
                        <span class="header-equipped-avatar" title="${this.equippedItem.name}">${this.equippedItem.emoji}</span>
                        <div>
                            <span class="stat-label">スコア</span>
                            <span class="stat-value gold" id="scoreVal">0</span>
                        </div>
                    </div>
                    <div class="stat-box center">
                        <span class="stat-label" id="qProgress">1 / ${maxQ}</span>
                    </div>
                    <div class="stat-box right">
                        <div>
                            <span class="stat-label">残り</span>
                            <span class="stat-value blue" id="timerVal">${this.totalTimeLeft}</span><span class="stat-unit">秒</span>
                        </div>
                    </div>
                </div>
                <div class="q-timer-wrap">
                    <div class="q-timer-bar" id="qTimerBar"></div>
                </div>
                <div class="question-area">
                    <div class="question-text" id="questionText"></div>
                    <div class="feedback" id="feedback"></div>
                </div>
                <div class="choices-area" id="choicesArea"></div>
            </div>
        `;
    }

    showNextQuestion() {
        if (!this.isPlaying) return;
        const maxQ = this.sessionMaxQ;

        if (this.questionCount >= maxQ) {
            this.endGame();
            return;
        }

        const q = this.generateQuestion();
        this.currentQuestion = q;
        const colors = ['#e74c3c', '#f39c12', '#2980b9'];
        const choices = this.generateChoices(q.answer);

        document.getElementById('qProgress').textContent = `${this.questionCount + 1} / ${maxQ}`;
        document.getElementById('questionText').textContent = q.text;

        const fb = document.getElementById('feedback');
        fb.textContent = '';
        fb.className = 'feedback';

        document.getElementById('choicesArea').innerHTML = choices.map((c, i) => `
            <button class="choice-btn" data-val="${c}" style="--cc:${colors[i]}">${c}</button>
        `).join('');

        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => this.checkAnswer(Number(btn.dataset.val), q.answer));
        });

        this.questionCount++;
        this.startQuestionTimer();
    }

    generateQuestion() {
        if (this.currentOperator === 'intro-add') {
            const a = Math.floor(Math.random() * 9) + 1;
            const b = Math.floor(Math.random() * 9) + 1;
            return { text: `${a} ＋ ${b} ＝ ？`, answer: a + b };
        }

        if (this.currentOperator === 'intro-sub') {
            const a = Math.floor(Math.random() * 8) + 2;
            const b = Math.floor(Math.random() * (a - 1)) + 1;
            return { text: `${a} ー ${b} ＝ ？`, answer: a - b };
        }

        if (this.currentOperator === 'intro-add-blank') {
            const a = Math.floor(Math.random() * 9) + 1;
            const b = Math.floor(Math.random() * 9) + 1;
            if (Math.random() < 0.5) {
                return { text: `${a} ＋ ？ ＝ ${a + b}`, answer: b };
            } else {
                return { text: `？ ＋ ${b} ＝ ${a + b}`, answer: a };
            }
        }

        if (this.currentOperator === 'intro-sub-blank') {
            const a = Math.floor(Math.random() * 8) + 2;
            const answer = Math.floor(Math.random() * (a - 1)) + 1;
            return { text: `${a} ー ？ ＝ ${a - answer}`, answer };
        }

        if (this.currentOperator === 'master') {
            const r = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
            if (Math.random() < 0.5) {
                // 2桁の虫食い算
                const t = Math.floor(Math.random() * 4);
                if (t === 0) { const a = r(10,50), b = r(10,50); return { text: `${a} ＋ ？ ＝ ${a+b}`, answer: b }; }
                if (t === 1) { const a = r(10,50), b = r(10,50); return { text: `？ ＋ ${b} ＝ ${a+b}`, answer: a }; }
                if (t === 2) { const a = r(21,80), b = r(10, Math.min(a-1,40)); return { text: `${a} ー ？ ＝ ${a-b}`, answer: b }; }
                const b = r(10,40), c = r(10,40); return { text: `？ ー ${b} ＝ ${c}`, answer: b+c };
            } else {
                // 複合演算（かけ算・わり算優先）
                const t = Math.floor(Math.random() * 4);
                if (t === 0) { const a = r(2,9), b = r(2,9), c = r(1,20); return { text: `${a} × ${b} ＋ ${c} ＝ ？`, answer: a*b+c }; }
                if (t === 1) { const a = r(2,9), b = r(2,9), c = r(1,a*b-1); return { text: `${a} × ${b} ー ${c} ＝ ？`, answer: a*b-c }; }
                if (t === 2) { const a = r(1,20), b = r(2,9), c = r(2,9); return { text: `${a} ＋ ${b} × ${c} ＝ ？`, answer: a+b*c }; }
                const b = r(2,9), q = r(2,9), c = r(1,20); return { text: `${b*q} ÷ ${b} ＋ ${c} ＝ ？`, answer: q+c };
            }
        }

        if (this.currentOperator === 'hyper') {
            if (Math.random() < 0.5) {
                // インド式: 11〜19 × 11〜19
                const num1 = Math.floor(Math.random() * 9) + 11;
                const num2 = Math.floor(Math.random() * 9) + 11;
                return { text: `${num1} × ${num2} ＝ ？`, answer: num1 * num2 };
            } else {
                // 虫食い算: a × ？ ＝ c または ？ × b ＝ c
                const a = Math.floor(Math.random() * 8) + 2;
                const b = Math.floor(Math.random() * 8) + 2;
                if (Math.random() < 0.5) {
                    return { text: `${a} × ？ ＝ ${a * b}`, answer: b };
                } else {
                    return { text: `？ × ${b} ＝ ${a * b}`, answer: a };
                }
            }
        }

        const difficulty = Math.min(Math.floor(this.score / 20), 5);
        const maxNums = [10, 20, 35, 50, 75, 100];
        const maxMuls = [9,  9,   9, 12, 12,  15];
        const maxNum = maxNums[difficulty];
        const maxMul = maxMuls[difficulty];
        let num1, num2, answer, op;

        if (this.currentOperator === 'special') {
            if (this.trainingPool && this.trainingPool.length > 0) {
                return this.trainingPool.pop();
            }
            const ops = ['+', '-', '×', '÷'];
            op = ops[Math.floor(Math.random() * ops.length)];
        } else {
            op = this.currentOperator;
        }

        switch (op) {
            case '+':
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * maxNum) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * maxNum) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                break;
            case '×':
                num1 = Math.floor(Math.random() * maxMul) + 1;
                num2 = Math.floor(Math.random() * maxMul) + 1;
                answer = num1 * num2;
                break;
            case '÷':
                answer = Math.floor(Math.random() * maxMul) + 1;
                num2 = Math.floor(Math.random() * maxMul) + 1;
                num1 = answer * num2;
                break;
        }

        return { text: `${num1} ${op} ${num2} ＝ ？`, answer };
    }

    generateChoices(correct) {
        const set = new Set([correct]);
        const maxOffset = Math.max(5, Math.floor(correct * 0.25));
        let attempts = 0;
        while (set.size < 3 && attempts < 50) {
            attempts++;
            const offset = Math.floor(Math.random() * maxOffset) + 1;
            const val = correct + offset * (Math.random() < 0.5 ? 1 : -1);
            if (val > 0) set.add(val);
        }
        return Array.from(set).sort(() => Math.random() - 0.5);
    }

    checkAnswer(selected, correct) {
        clearTimeout(this.questionTimer);

        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.disabled = true;
            const v = Number(btn.dataset.val);
            if (v === correct) btn.classList.add('btn-correct');
            else if (v === selected && v !== correct) btn.classList.add('btn-wrong');
        });

        const fb = document.getElementById('feedback');
        if (selected === correct) {
            // Remove from failures on success in any mode (or just in special)
            if (this.currentQuestion) this.removeFailedProblem(this.currentQuestion);

            this.score += 10;
            if (this.score > this.highScores[this.currentOperator]) {
                this.highScores[this.currentOperator] = this.score;
                this.saveHighScore(this.currentOperator, this.score);
            }
            const sv = document.getElementById('scoreVal');
            if (sv) {
                sv.textContent = this.score;
                sv.classList.add('pop');
                setTimeout(() => sv.classList.remove('pop'), 400);
            }
            fb.textContent = '⭕ せいかい！';
            fb.className = 'feedback fb-correct';
            this.sounds.correct.currentTime = 0;
            this.sounds.correct.play().catch(() => {});
        } else {
            this.score = Math.max(0, this.score - 10);
            const sv = document.getElementById('scoreVal');
            if (sv) {
                sv.textContent = this.score;
                sv.classList.add('pop');
                setTimeout(() => sv.classList.remove('pop'), 400);
            }
            if (this.currentQuestion) {
                this.saveFailedProblem(this.currentQuestion);
            }
            fb.textContent = '❌ ざんねん';
            fb.className = 'feedback fb-wrong';
            this.sounds.incorrect.currentTime = 0;
            this.sounds.incorrect.play().catch(() => {});
        }

        setTimeout(() => this.showNextQuestion(), 800);
    }

    startQuestionTimer() {
        clearTimeout(this.questionTimer);
        const bar = document.getElementById('qTimerBar');
        if (bar) {
            bar.classList.remove('running');
            void bar.offsetWidth;
            bar.style.animationDuration = `${this.timeLimit}s`;
            bar.classList.add('running');
        }
        this.questionTimer = setTimeout(() => {
            if (this.currentQuestion) {
                this.saveFailedProblem(this.currentQuestion);
            }
            this.sounds.incorrect.currentTime = 0;
            this.sounds.incorrect.play().catch(() => {});
            this.showNextQuestion();
        }, this.timeLimit * 1000);
    }

    startTotalTimer() {
        clearInterval(this.totalTimerInterval);
        this.totalTimerInterval = setInterval(() => {
            this.totalTimeLeft--;
            const el = document.getElementById('timerVal');
            if (el) {
                el.textContent = this.totalTimeLeft;
                if (this.totalTimeLeft <= 10) el.classList.add('timer-warn');
            }
            if (this.totalTimeLeft <= 0) {
                clearInterval(this.totalTimerInterval);
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        clearTimeout(this.questionTimer);
        clearInterval(this.totalTimerInterval);
        this.sounds.end.play().catch(() => {});

        const rank = this.getRankInfo(this.score, this.currentOperator);
        const isRecord = this.score > 0 && this.score >= this.highScores[this.currentOperator];

        const isBlankTheme = ['intro-add-blank', 'intro-sub-blank'].includes(this.currentOperator);

        const earnedStars = Math.floor(this.score / 10);
        this.totalStars += earnedStars;
        localStorage.setItem('keisanNinjaTotalStars', this.totalStars.toString());

        let newScrollUnlocked = null;
        const currentRankIndex = this.storyScrollsList.findIndex(s => s.rank === rank.name);
        if (currentRankIndex !== -1) {
            for (let i = 0; i <= currentRankIndex; i++) {
                const sData = this.storyScrollsList[i];
                if (!this.unlockedScrolls.includes(sData.rank)) {
                    this.unlockedScrolls.push(sData.rank);
                    newScrollUnlocked = sData;
                }
            }
            if (newScrollUnlocked) {
                this.saveUnlockedScrolls();
            }
        }

        this.equippedItem = getItemById(getEquippedItemId());
        this.app.innerHTML = `
            <div class="screen result-screen${isBlankTheme ? ' blank-theme' : ''}">
                <div style="display: flex; align-items: center; gap: 8px; background: var(--surface2); padding: 6px 14px; border-radius: 999px; margin-bottom: 4px;">
                    <span style="font-size: 1.3rem;">${this.equippedItem.emoji}</span>
                    <span style="font-size: 0.85rem; font-weight: bold; color: var(--muted);">相棒: ${this.equippedItem.name}</span>
                </div>
                <div class="rank-emoji">${rank.emoji}</div>
                <div class="rank-name" style="color:${rank.color}">${rank.name}</div>
                <div class="score-label">スコア</div>
                <div class="final-score">${this.score}<small>点</small></div>
                ${isRecord ? '<div class="new-record">🎉 ハイスコア更新！</div>' : ''}
                ${newScrollUnlocked ? '<div class="new-scroll-notice" style="color:var(--gold); font-weight:bold; margin-top:10px;">📜 新しい巻物を手に入れた！</div>' : ''}

                <div class="stars-info" style="margin: 16px 0; padding: 14px; background: var(--surface2); border-radius: 16px; border: 2px solid var(--gold); width: 100%; max-width: 320px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
                    <div style="font-size: 1.15rem; font-weight: bold; color: var(--gold); margin-bottom: 6px;">🌟 今回ゲット: ${earnedStars}個</div>
                    <div style="font-size: 1.15rem; font-weight: bold; color: var(--gold); margin-bottom: 12px;">🌟 トータル: ${this.totalStars}個</div>
                    <div style="display: flex; gap: 8px;">
                        <button class="rbtn store-btn" style="background: var(--gold); color: #000; font-size: 0.95rem; padding: 12px;">🏪 ガチャへ</button>
                        <button class="rbtn result-collection-btn" style="background: linear-gradient(135deg, #8e44ad, #9b59b6); color: #fff; font-size: 0.95rem; padding: 12px;">📖 ずかん</button>
                    </div>
                </div>

                <div class="result-btns" style="flex-direction:column; align-items:center;">
                    <button class="rbtn rbtn-scrolls">📜 巻物を見る</button>
                    <div style="display:flex; gap:12px; width:100%;">
                        <button class="rbtn rbtn-retry">もう一度</button>
                        <button class="rbtn rbtn-back">もどる</button>
                    </div>
                </div>
            </div>
        `;

        this.app.querySelector('.store-btn').addEventListener('click', () => this.renderGachaScreen());
        this.app.querySelector('.result-collection-btn').addEventListener('click', () => this.renderCollectionScreen());
        this.app.querySelector('.rbtn-scrolls').addEventListener('click', () => this.showScrollsModal());
        this.app.querySelector('.rbtn-retry').addEventListener('click', () => this.startGame());
        this.app.querySelector('.rbtn-back').addEventListener('click', () => this.renderModeSelect());

        if (newScrollUnlocked) {
            setTimeout(() => this.showSingleScrollModal(newScrollUnlocked), 500);
        }
    }

    showSingleScrollModal(scrollData) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-title">新しい巻物をアンロック！</div>
                <div class="scroll-entry">
                    <div class="scroll-title">${scrollData.emoji} ${scrollData.title}</div>
                    <div class="scroll-text">${scrollData.text}</div>
                </div>
                <button class="rbtn rbtn-back modal-close-btn">とじる</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('.modal-close-btn').addEventListener('click', () => {
            overlay.remove();
        });
    }

    showScrollsModal() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        let scrollsHtml = '';
        this.storyScrollsList.forEach(s => {
            if (this.unlockedScrolls.includes(s.rank)) {
                scrollsHtml += `
                    <div class="scroll-entry">
                        <div class="scroll-title">${s.emoji} ${s.title}</div>
                        <div class="scroll-text">${s.text}</div>
                    </div>
                `;
            } else {
                scrollsHtml += `
                    <div class="scroll-locked">
                        🔒 条件: 「${s.rank}」に到達する
                    </div>
                `;
            }
        });

        overlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-title">忍者の巻物</div>
                <div class="scrolls-container" style="max-height: 50vh; overflow-y: auto; margin-bottom: 12px; padding-right: 8px;">
                    ${scrollsHtml}
                </div>
                <button class="rbtn rbtn-back modal-close-btn">とじる</button>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('.modal-close-btn').addEventListener('click', () => {
            overlay.remove();
        });
    }

    playTone(frequency, type = 'sine', duration = 0.15, gainVal = 0.2) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!this.audioCtx) this.audioCtx = new AudioCtx();
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        } catch {
            // Audio context not allowed or supported
        }
    }

    playCrankSound() {
        this.playTone(320, 'triangle', 0.1, 0.25);
        setTimeout(() => this.playTone(480, 'triangle', 0.12, 0.2), 120);
    }

    playCapsuleOpenSound(maxRarity = 1) {
        if (maxRarity === 5) {
            // Godly cosmic fanfare
            const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
            notes.forEach((freq, idx) => {
                setTimeout(() => this.playTone(freq, 'square', 0.35, 0.35), idx * 90);
            });
        } else if (maxRarity === 4) {
            // Legend fanfare
            const notes = [440, 554.37, 659.25, 880, 1108.73];
            notes.forEach((freq, idx) => {
                setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.3), idx * 100);
            });
        } else if (maxRarity === 3) {
            // Super rare fanfare
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, idx) => {
                setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.3), idx * 100);
            });
        } else if (maxRarity === 2) {
            // Rare chime
            const notes = [440, 554.37, 659.25];
            notes.forEach((freq, idx) => {
                setTimeout(() => this.playTone(freq, 'sine', 0.2, 0.25), idx * 90);
            });
        } else {
            // Pop sound
            this.playTone(400, 'sine', 0.08, 0.2);
            setTimeout(() => this.playTone(600, 'sine', 0.12, 0.2), 70);
        }
    }

    renderStarStore() {
        this.renderGachaScreen();
    }

    renderGachaScreen() {
        this.app.innerHTML = `
            <div class="screen gacha-screen">
                <div class="gacha-header">
                    <button class="rbtn rbtn-back back-to-mode" style="padding: 10px 18px; font-size: 0.95rem; flex: none;">◀ もどる</button>
                    <div class="hud-stars">
                        <span class="hud-star-icon">🌟</span>
                        <span id="gachaStarCount">${this.totalStars}</span>
                    </div>
                </div>

                <div class="title-area" style="margin-bottom: 0;">
                    <h1 class="game-title" style="font-size: 2.2rem; color: var(--gold); text-shadow: 0 0 20px rgba(243,156,18,0.5);">忍 ガチャ</h1>
                    <p style="font-size: 0.85rem; color: var(--muted); margin-top: 2px;">あつめた星で新しい忍者アバターを手に入れよう！</p>
                </div>

                <div class="gacha-machine-wrap">
                    <div class="gacha-globe">
                        <div class="capsule-group">
                            <span class="capsule-item" style="top: 25px; left: 40px;">🔴</span>
                            <span class="capsule-item" style="top: 50px; right: 35px;">🟡</span>
                            <span class="capsule-item" style="top: 85px; left: 65px;">🔵</span>
                            <span class="capsule-item" style="bottom: 30px; left: 35px;">🟣</span>
                            <span class="capsule-item" style="bottom: 25px; right: 40px;">🟢</span>
                        </div>
                    </div>
                    <div class="gacha-crank-box">
                        <div class="gacha-crank" id="gachaCrank">⚙️</div>
                        <span style="font-size: 0.75rem; color: var(--muted); font-weight: bold;">ハンドルを回そう！</span>
                    </div>
                    <div class="gacha-chute" id="gachaChute">
                        <span id="chuteCapsule" style="display: none;">🎁</span>
                    </div>
                </div>

                <div class="gacha-action-area">
                    <button class="gacha-btn gacha-btn-single" id="btnPullSingle" ${this.totalStars < GACHA_PRICES.SINGLE ? 'disabled' : ''}>
                        <span>🎯 1回まわす</span>
                        <span>🌟 ${GACHA_PRICES.SINGLE}個</span>
                    </button>
                    <button class="gacha-btn gacha-btn-ten" id="btnPullTen" ${this.totalStars < GACHA_PRICES.TEN ? 'disabled' : ''}>
                        <span>🔥 10連ガチャ (10%OFF)</span>
                        <span>🌟 ${GACHA_PRICES.TEN}個</span>
                    </button>
                    <button class="rbtn home-nav-collection" id="btnGoCollection" style="width: 100%; padding: 14px; font-size: 1rem;">
                        📖 忍者コレクションを見る
                    </button>
                </div>

                <div class="gacha-rates-badge">
                    【排出率】 ⭐ ノーマル 50% ｜ ⭐⭐ レア 30% ｜ ⭐⭐⭐ 激レア 14%<br>
                    🌟⭐⭐⭐⭐ 超絶レジェンド 5% ｜ 👑⭐⭐⭐⭐⭐ 神話ゴッド 1%<br>
                    ※すでにもっている忍者がでると、星がボーナスでお返しされます！
                </div>
            </div>
        `;

        this.app.querySelector('.back-to-mode').addEventListener('click', () => this.renderModeSelect());
        this.app.querySelector('#btnGoCollection').addEventListener('click', () => this.renderCollectionScreen());
        this.app.querySelector('#gachaCrank').addEventListener('click', () => {
            if (this.totalStars >= GACHA_PRICES.SINGLE) {
                this.handleGachaPull(1);
            }
        });

        const btnSingle = this.app.querySelector('#btnPullSingle');
        if (btnSingle) {
            btnSingle.addEventListener('click', () => this.handleGachaPull(1));
        }

        const btnTen = this.app.querySelector('#btnPullTen');
        if (btnTen) {
            btnTen.addEventListener('click', () => this.handleGachaPull(10));
        }
    }

    handleGachaPull(count) {
        const cost = count === 10 ? GACHA_PRICES.TEN : GACHA_PRICES.SINGLE * count;
        if (this.totalStars < cost) return;

        // Deduct stars
        this.totalStars -= cost;
        localStorage.setItem('keisanNinjaTotalStars', this.totalStars.toString());

        // Animate crank
        const crank = document.getElementById('gachaCrank');
        const chuteCapsule = document.getElementById('chuteCapsule');
        if (crank) crank.classList.add('spinning');
        this.playCrankSound();

        // Disable buttons during pull
        const btns = this.app.querySelectorAll('.gacha-btn');
        btns.forEach(b => (b.disabled = true));

        setTimeout(() => {
            if (crank) crank.classList.remove('spinning');
            if (chuteCapsule) {
                chuteCapsule.style.display = 'inline-block';
                chuteCapsule.className = 'chute-capsule';
            }
            this.playTone(520, 'sine', 0.15, 0.25);

            setTimeout(() => {
                let outcome;
                if (count === 1) {
                    const single = pullSingleGacha();
                    outcome = { results: [single], totalRefund: single.refundStars };
                } else {
                    outcome = pullMultipleGacha(count);
                }

                // If refund stars occurred, add them back
                if (outcome.totalRefund > 0) {
                    this.totalStars += outcome.totalRefund;
                    localStorage.setItem('keisanNinjaTotalStars', this.totalStars.toString());
                }

                this.showGachaRevealModal(outcome);
            }, 600);
        }, 800);
    }

    showGachaRevealModal(outcome) {
        const { results, totalRefund } = outcome;
        const maxRarity = Math.max(...results.map(r => r.item.rarity));
        this.playCapsuleOpenSound(maxRarity);

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        let contentHtml = '';
        if (results.length === 1) {
            const res = results[0];
            const starEmojis = '⭐'.repeat(res.item.rarity);
            contentHtml = `
                <div class="single-reveal-wrap">
                    <div class="reveal-card rarity-${res.item.rarity}" style="width: 100%; max-width: 260px; padding: 24px 16px;">
                        ${res.isNew ? '<span class="reveal-badge-new">NEW!</span>' : ''}
                        ${res.refundStars > 0 ? `<span class="reveal-badge-refund">重複 +${res.refundStars}🌟</span>` : ''}
                        <div class="reveal-emoji">${res.item.emoji}</div>
                        <div class="reveal-stars">${starEmojis} [${res.item.rarityLabel}]</div>
                        <div class="reveal-item-name" style="font-size: 1.3rem;">${res.item.name}</div>
                        <div class="reveal-tagline">${res.item.tagline}</div>
                    </div>
                </div>
            `;
        } else {
            contentHtml = `
                <div class="reveal-grid">
                    ${results.map(res => `
                        <div class="reveal-card rarity-${res.item.rarity}">
                            ${res.isNew ? '<span class="reveal-badge-new">NEW!</span>' : ''}
                            ${res.refundStars > 0 ? `<span class="reveal-badge-refund">+${res.refundStars}🌟</span>` : ''}
                            <div class="reveal-emoji" style="font-size: 2.2rem;">${res.item.emoji}</div>
                            <div class="reveal-stars" style="font-size: 0.75rem;">${'⭐'.repeat(res.item.rarity)}</div>
                            <div class="reveal-item-name" style="font-size: 0.8rem;">${res.item.name}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        const refundNotice = totalRefund > 0 ? `
            <div style="font-size: 0.95rem; color: var(--gold); font-weight: bold; margin-bottom: 12px; background: rgba(243,156,18,0.15); padding: 8px 14px; border-radius: 12px; border: 1px solid var(--gold);">
                ✨ ダブりボーナス！ 合計 <b>+${totalRefund}個</b> の星をお返ししました！
            </div>
        ` : '';

        overlay.innerHTML = `
            <div class="modal-content reveal-modal">
                <div class="modal-title">🎉 ガチャ結果発表！</div>
                ${contentHtml}
                ${refundNotice}
                <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                    <button class="rbtn rbtn-retry modal-pull-again" style="background: var(--gold); color: #000; width: 100%;">もう一度まわす</button>
                    <button class="rbtn home-nav-collection modal-go-collection" style="width: 100%;">ずかんで確認・そうび</button>
                    <button class="rbtn rbtn-back modal-close-btn" style="width: 100%;">とじる</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector('.modal-close-btn').addEventListener('click', () => {
            overlay.remove();
            this.renderGachaScreen();
        });

        overlay.querySelector('.modal-pull-again').addEventListener('click', () => {
            overlay.remove();
            this.renderGachaScreen();
            if (this.totalStars >= GACHA_PRICES.SINGLE) {
                this.handleGachaPull(1);
            }
        });

        overlay.querySelector('.modal-go-collection').addEventListener('click', () => {
            overlay.remove();
            this.renderCollectionScreen();
        });
    }

    renderCollectionScreen() {
        const ownedIds = getOwnedItemIds();
        const equippedId = getEquippedItemId();
        const totalItemsCount = REWARD_ITEMS.length;
        const ownedCount = ownedIds.length;
        const percent = Math.round((ownedCount / totalItemsCount) * 100);

        this.app.innerHTML = `
            <div class="screen collection-screen">
                <div class="gacha-header">
                    <button class="rbtn rbtn-back back-to-mode" style="padding: 10px 18px; font-size: 0.95rem; flex: none;">◀ もどる</button>
                    <button class="rbtn home-nav-gacha btn-go-gacha" style="padding: 10px 18px; font-size: 0.95rem; flex: none;">🏪 ガチャへ</button>
                </div>

                <div class="title-area" style="margin-bottom: 0;">
                    <h1 class="game-title" style="font-size: 2rem; color: #a29bfe; text-shadow: 0 0 20px rgba(162,155,254,0.5);">📖 忍者ずかん</h1>
                    <p style="font-size: 0.85rem; color: var(--muted); margin-top: 2px;">あつめた忍者をタップして、相棒に設定（そうび）しよう！</p>
                </div>

                <div class="collection-stats-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                        <span style="font-size: 0.95rem; color: var(--text);">コンプリート率</span>
                        <span style="font-size: 1.1rem; color: var(--gold);">${ownedCount} / ${totalItemsCount} (${percent}%)</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${percent}%;"></div>
                    </div>
                </div>

                <div class="collection-grid">
                    ${REWARD_ITEMS.map(item => {
                        const isOwned = ownedIds.includes(item.id);
                        const isEquipped = item.id === equippedId;
                        return `
                            <div class="item-card rarity-${item.rarity}-card ${isEquipped ? 'equipped' : ''} ${!isOwned ? 'locked' : ''}" data-item-id="${item.id}">
                                ${isEquipped ? '<span class="item-card-equipped-badge">そうび中</span>' : ''}
                                <div class="item-card-emoji">${isOwned ? item.emoji : '❓'}</div>
                                <div class="item-card-name">${isOwned ? item.name : '？？？'}</div>
                                <div class="item-card-stars" style="${item.rarity >= 4 ? 'color: #ff9ff3;' : ''}">${'⭐'.repeat(item.rarity)}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        this.app.querySelector('.back-to-mode').addEventListener('click', () => this.renderModeSelect());
        this.app.querySelector('.btn-go-gacha').addEventListener('click', () => this.renderGachaScreen());

        this.app.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = card.dataset.itemId;
                const isOwned = ownedIds.includes(itemId);
                if (isOwned) {
                    this.showItemDetailModal(itemId);
                }
            });
        });
    }

    showItemDetailModal(itemId) {
        const item = getItemById(itemId);
        const equippedId = getEquippedItemId();
        const isEquipped = item.id === equippedId;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const starEmojis = '⭐'.repeat(item.rarity);

        overlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-title">忍者しょうさい</div>
                <div class="detail-modal-card">
                    <div class="detail-emoji">${item.emoji}</div>
                    <div class="detail-rarity">${starEmojis} [${item.rarityLabel}]</div>
                    <div class="detail-title">${item.name}</div>
                    <div class="detail-desc">${item.tagline}</div>
                    <button class="detail-equip-btn ${isEquipped ? 'is-active' : 'not-active'}" id="btnEquipAction">
                        ${isEquipped ? '✅ そうび中' : '🥷 この忍者をそうびする'}
                    </button>
                </div>
                <button class="rbtn rbtn-back modal-close-btn" style="width: 100%;">とじる</button>
            </div>
        `;

        document.body.appendChild(overlay);

        const btnEquip = overlay.querySelector('#btnEquipAction');
        btnEquip.addEventListener('click', () => {
            if (!isEquipped) {
                setEquippedItemId(item.id);
                this.equippedItem = item;
                this.playTone(660, 'triangle', 0.2, 0.25);
                setTimeout(() => this.playTone(880, 'sine', 0.2, 0.25), 100);
            }
            overlay.remove();
            this.renderCollectionScreen();
        });

        overlay.querySelector('.modal-close-btn').addEventListener('click', () => {
            overlay.remove();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new Game());
