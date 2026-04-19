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

        this.sounds = {
            correct: new Audio('sounds/correct.mp3'),
            incorrect: new Audio('sounds/incorrect.mp3'),
            start: new Audio('sounds/start.mp3'),
            end: new Audio('sounds/end.mp3'),
        };
        Object.values(this.sounds).forEach(s => s.load());

        this.highScores = {
            '+': this.loadHighScore('addition'),
            '-': this.loadHighScore('subtraction'),
            '×': this.loadHighScore('multiplication'),
            '÷': this.loadHighScore('division'),
            special: this.loadHighScore('special'),
        };

        this.renderModeSelect();
    }

    loadHighScore(key) {
        return parseInt(localStorage.getItem(`keisanNinjaHighScore_${key}`), 10) || 0;
    }

    saveHighScore(operator, score) {
        const keys = { '+': 'addition', '-': 'subtraction', '×': 'multiplication', '÷': 'division', special: 'special' };
        localStorage.setItem(`keisanNinjaHighScore_${keys[operator]}`, score.toString());
    }

    getRankInfo(score) {
        if (score >= 140) return { name: '上忍', emoji: '🥷', color: '#e74c3c' };
        if (score >= 100) return { name: '中忍', emoji: '⚔️', color: '#f39c12' };
        if (score >= 50)  return { name: '下忍', emoji: '🌟', color: '#3498db' };
        return { name: '見習い', emoji: '🌱', color: '#2ecc71' };
    }

    renderModeSelect() {
        const modes = [
            { op: '+', label: '足し算', symbol: '＋', color: '#27ae60' },
            { op: '-', label: '引き算', symbol: '－', color: '#2980b9' },
            { op: '×', label: '掛け算', symbol: '✕', color: '#e67e22' },
            { op: '÷', label: '割り算', symbol: '÷', color: '#8e44ad' },
        ];
        const hsLabels = { '+': '足し算', '-': '引き算', '×': '掛け算', '÷': '割り算', special: 'スペシャル' };

        this.app.innerHTML = `
            <div class="screen mode-select-screen">
                <div class="title-area">
                    <div class="title-logo">🥷</div>
                    <h1 class="game-title">計算忍者</h1>
                </div>
                <div class="mode-grid">
                    ${modes.map(m => `
                        <button class="mode-btn" data-op="${m.op}" style="--c:${m.color}">
                            <span class="mode-symbol">${m.symbol}</span>
                            <span class="mode-label">${m.label}</span>
                        </button>
                    `).join('')}
                </div>
                <button class="special-mode-btn" data-op="special">✨ スペシャル</button>
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
        this.totalTimeLeft = this.totalTimeLimit;
        this.isPlaying = true;
        this.sounds.start.play().catch(() => {});
        this.renderGameScreen();
        this.startTotalTimer();
        this.showNextQuestion();
    }

    renderGameScreen() {
        const maxQ = this.currentOperator === 'special' ? 45 : 15;
        this.app.innerHTML = `
            <div class="screen game-screen">
                <div class="game-header">
                    <div class="stat-box">
                        <span class="stat-label">スコア</span>
                        <span class="stat-value gold" id="scoreVal">0</span>
                    </div>
                    <div class="stat-box center">
                        <span class="stat-label" id="qProgress">1 / ${maxQ}</span>
                    </div>
                    <div class="stat-box right">
                        <span class="stat-label">残り</span>
                        <span class="stat-value blue" id="timerVal">60</span><span class="stat-unit">秒</span>
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
        const maxQ = this.currentOperator === 'special' ? 45 : 15;

        if (this.questionCount >= maxQ) {
            this.endGame();
            return;
        }

        const q = this.generateQuestion();
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
        const difficulty = Math.min(Math.floor(this.score / 20), 5);
        const maxNums = [10, 20, 35, 50, 75, 100];
        const maxMuls = [9,  9,   9, 12, 12,  15];
        const maxNum = maxNums[difficulty];
        const maxMul = maxMuls[difficulty];
        let num1, num2, answer, op;

        if (this.currentOperator === 'special') {
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
            bar.classList.add('running');
        }
        this.questionTimer = setTimeout(() => {
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

        const rank = this.getRankInfo(this.score);
        const isRecord = this.score > 0 && this.score >= this.highScores[this.currentOperator];

        this.app.innerHTML = `
            <div class="screen result-screen">
                <div class="rank-emoji">${rank.emoji}</div>
                <div class="rank-name" style="color:${rank.color}">${rank.name}</div>
                <div class="score-label">スコア</div>
                <div class="final-score">${this.score}<small>点</small></div>
                ${isRecord ? '<div class="new-record">🎉 ハイスコア更新！</div>' : ''}
                <div class="result-btns">
                    <button class="rbtn rbtn-retry">もう一度</button>
                    <button class="rbtn rbtn-back">もどる</button>
                </div>
            </div>
        `;

        this.app.querySelector('.rbtn-retry').addEventListener('click', () => this.startGame());
        this.app.querySelector('.rbtn-back').addEventListener('click', () => this.renderModeSelect());
    }
}

document.addEventListener('DOMContentLoaded', () => new Game());
