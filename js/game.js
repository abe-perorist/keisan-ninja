class Game {
    constructor() {
        this.score = 0;
        this.questionCount = 0;
        this.timeLimit = 5; // 各問題の制限時間（秒）
        this.totalTimeLimit = 60; // 全体の制限時間（秒）
        this.timer = null;
        this.totalTimer = null;
        this.isPlaying = false;
        this.currentOperator = null;

        // DOM要素
        this.gameContainer = document.querySelector('.game-container');
        this.questionElement = document.querySelector('.question');
        this.scoreElement = document.querySelector('.score');
        this.rankElement = document.querySelector('.rank');
        this.answerContainer = document.querySelector('.answer-container');
        this.startButton = document.querySelector('.answer-btn');

        // 音声の初期化
        this.sounds = {
            correct: new Audio('sounds/correct.mp3'),
            incorrect: new Audio('sounds/incorrect.mp3'),
            start: new Audio('sounds/start.mp3'),
            end: new Audio('sounds/end.mp3')
        };

        // 音声のプリロード
        Object.values(this.sounds).forEach(sound => {
            sound.load();
        });

        // 演算子ごとのハイスコアの初期化
        this.highScores = {
            '+': this.loadHighScore('addition'),
            '-': this.loadHighScore('subtraction'),
            '×': this.loadHighScore('multiplication'),
            '÷': this.loadHighScore('division')
        };

        // 演算子選択画面の初期化
        this.initOperatorSelection();
    }

    initOperatorSelection() {
        // 演算子選択画面の作成
        const operatorContainer = document.createElement('div');
        operatorContainer.className = 'operator-selection';
        operatorContainer.innerHTML = `
            <h2>計算の種類を選んでください</h2>
            <div class="operator-buttons">
                <button class="operator-btn" data-operator="+">足し算</button>
                <button class="operator-btn" data-operator="-">引き算</button>
                <button class="operator-btn" data-operator="×">掛け算</button>
                <button class="operator-btn" data-operator="÷">割り算</button>
            </div>
            <div class="high-scores">
                <h3>ハイスコア</h3>
                <div class="high-score-list">
                    <p>足し算: <span class="high-score" data-operator="+">${this.highScores['+']}</span>点</p>
                    <p>引き算: <span class="high-score" data-operator="-">${this.highScores['-']}</span>点</p>
                    <p>掛け算: <span class="high-score" data-operator="×">${this.highScores['×']}</span>点</p>
                    <p>割り算: <span class="high-score" data-operator="÷">${this.highScores['÷']}</span>点</p>
                </div>
            </div>
        `;

        // 演算子ボタンのイベントリスナー
        operatorContainer.querySelectorAll('.operator-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.currentOperator = button.dataset.operator;
                this.startGame();
                operatorContainer.style.display = 'none';
            });
        });

        // ゲームコンテナに追加
        this.gameContainer.insertBefore(operatorContainer, this.gameContainer.firstChild);

        // 初期状態ではゲーム部分を非表示
        this.questionElement.parentElement.style.display = 'none';
        this.answerContainer.style.display = 'none';
    }

    loadHighScore(operator) {
        const savedScore = localStorage.getItem(`keisanNinjaHighScore_${operator}`);
        return savedScore ? parseInt(savedScore, 10) : 0;
    }

    saveHighScore(operator, score) {
        localStorage.setItem(`keisanNinjaHighScore_${operator}`, score.toString());
    }

    startGame() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.score = 0;
        this.questionCount = 0;
        this.updateScore();
        this.updateRank();
        
        // スタート音を再生
        this.sounds.start.play();
        
        // ゲーム部分を表示
        this.questionElement.parentElement.style.display = 'block';
        this.answerContainer.style.display = 'block';
        
        // スタートボタンを非表示
        this.startButton.style.display = 'none';
        
        // 終了時のボタンを非表示
        this.answerContainer.innerHTML = '';
        
        // 選択肢コンテナを表示
        this.choicesContainer = document.createElement('div');
        this.choicesContainer.className = 'choices-container';
        this.answerContainer.appendChild(this.choicesContainer);
        
        // 全体のタイマー開始
        this.startTotalTimer();
        
        // 最初の問題を表示
        this.showNextQuestion();
    }

    showNextQuestion() {
        if (!this.isPlaying) return;
        
        if (this.questionCount >= 10) {
            this.endGame();
            return;
        }
        
        const question = this.generateQuestion();
        this.questionElement.textContent = question.text;
        
        // 選択肢を生成
        const choices = this.generateChoices(question.answer);
        this.choicesContainer.innerHTML = '';
        
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'answer-btn';
            button.textContent = choice;
            button.addEventListener('click', () => this.checkAnswer(choice, question.answer));
            this.choicesContainer.appendChild(button);
        });
        
        // タイマーをリセット
        this.startTimer();
        
        this.questionCount++;
    }

    generateQuestion() {
        let num1, num2, answer;
        const difficulty = Math.min(Math.floor(this.score / 10), 3);
        const maxNumber = 10 + (difficulty * 5);

        switch (this.currentOperator) {
            case '+':
                num1 = Math.floor(Math.random() * maxNumber) + 1;
                num2 = Math.floor(Math.random() * maxNumber) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * maxNumber) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                break;
            case '×':
                num1 = Math.floor(Math.random() * Math.min(maxNumber, 10)) + 1;
                num2 = Math.floor(Math.random() * Math.min(maxNumber, 10)) + 1;
                answer = num1 * num2;
                break;
            case '÷':
                answer = Math.floor(Math.random() * Math.min(maxNumber, 10)) + 1;
                num2 = Math.floor(Math.random() * Math.min(maxNumber, 10)) + 1;
                num1 = answer * num2;
                break;
        }

        return {
            text: `${num1} ${this.currentOperator} ${num2} = ?`,
            answer: answer
        };
    }

    generateChoices(correctAnswer) {
        const choices = new Set([correctAnswer]);
        while (choices.size < 3) {
            const offset = Math.floor(Math.random() * 5) + 1;
            const sign = Math.random() < 0.5 ? 1 : -1;
            choices.add(correctAnswer + (offset * sign));
        }
        return Array.from(choices).sort(() => Math.random() - 0.5);
    }

    checkAnswer(selected, correct) {
        if (selected === correct) {
            this.score += 10;
            this.updateScore();
            this.playCorrectSound();
            // 正解アニメーション
            this.questionElement.classList.add('correct');
            setTimeout(() => {
                this.questionElement.classList.remove('correct');
            }, 500);
        } else {
            this.playIncorrectSound();
            // 不正解アニメーション
            this.questionElement.classList.add('incorrect');
            setTimeout(() => {
                this.questionElement.classList.remove('incorrect');
            }, 500);
        }

        // 次の問題へ
        this.showNextQuestion();
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        
        // ハイスコアの更新
        if (this.score > this.highScores[this.currentOperator]) {
            this.highScores[this.currentOperator] = this.score;
            this.saveHighScore(this.currentOperator, this.score);
            
            // ハイスコア表示の更新
            const highScoreElement = document.querySelector(`.high-score[data-operator="${this.currentOperator}"]`);
            if (highScoreElement) {
                highScoreElement.textContent = this.score;
                highScoreElement.classList.add('updated');
                setTimeout(() => {
                    highScoreElement.classList.remove('updated');
                }, 1000);
            }
        }
    }

    updateRank() {
        let rank = '見習い';
        if (this.score >= 50) rank = '上忍';
        else if (this.score >= 30) rank = '中忍';
        else if (this.score >= 10) rank = '下忍';
        
        this.rankElement.textContent = rank;
    }

    startTimer() {
        if (this.timer) clearTimeout(this.timer);
        
        this.timer = setTimeout(() => {
            this.playIncorrectSound();
            this.showNextQuestion();
        }, this.timeLimit * 1000);
    }

    startTotalTimer() {
        if (this.totalTimer) clearTimeout(this.totalTimer);
        
        this.totalTimer = setTimeout(() => {
            this.endGame();
        }, this.totalTimeLimit * 1000);
    }

    endGame() {
        this.isPlaying = false;
        clearTimeout(this.timer);
        clearTimeout(this.totalTimer);
        
        // 終了音を再生
        this.sounds.end.play();
        
        // ハイスコア更新時のメッセージ
        let endMessage = `ゲーム終了！\nスコア: ${this.score}点`;
        if (this.score >= this.highScores[this.currentOperator]) {
            endMessage += '\n🎉 ハイスコア更新！';
        }
        
        this.questionElement.textContent = endMessage;
        
        // 選択肢を非表示
        this.choicesContainer.style.display = 'none';
        
        // 終了時のボタン表示
        this.answerContainer.innerHTML = `
            <button type="button" class="answer-btn restart-btn">もう一度挑戦</button>
            <button type="button" class="answer-btn title-btn">タイトルに戻る</button>
        `;

        // ボタンのイベントリスナー
        this.answerContainer.querySelector('.restart-btn').addEventListener('click', () => this.startGame());
        this.answerContainer.querySelector('.title-btn').addEventListener('click', () => this.showTitle());
    }

    showTitle() {
        // ゲーム部分を非表示
        this.questionElement.parentElement.style.display = 'none';
        this.answerContainer.style.display = 'none';
        
        // スタートボタンを再表示
        this.startButton.style.display = 'block';
        
        // 演算子選択画面を表示
        document.querySelector('.operator-selection').style.display = 'block';
    }

    playCorrectSound() {
        this.sounds.correct.currentTime = 0;
        this.sounds.correct.play();
    }

    playIncorrectSound() {
        this.sounds.incorrect.currentTime = 0;
        this.sounds.incorrect.play();
    }
}

// ゲームの初期化
document.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 