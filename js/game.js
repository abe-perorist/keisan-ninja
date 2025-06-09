class Game {
    constructor() {
        this.score = 0;
        this.questionCount = 0;
        this.timeLimit = 5; // 各問題の制限時間（秒）
        this.totalTimeLimit = 60; // 全体の制限時間（秒）
        this.timer = null;
        this.totalTimer = null;
        this.isPlaying = false;

        // DOM要素
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

        // イベントリスナー
        this.startButton.addEventListener('click', () => this.startGame());
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
        
        // スタートボタンを非表示（アニメーション付き）
        this.startButton.style.animation = 'fadeOut 0.5s';
        setTimeout(() => {
            this.startButton.style.display = 'none';
        }, 500);
        
        // 全体のタイマー開始
        this.startTotalTimer();
        
        // 最初の問題を表示
        this.showNextQuestion();
    }

    showNextQuestion() {
        if (this.questionCount >= 10) {
            this.endGame();
            return;
        }

        // 問題を生成
        const question = this.generateQuestion();
        this.questionElement.textContent = question.text;
        
        // 回答ボタンを生成
        this.generateAnswerButtons(question);
        
        // 問題のタイマー開始
        this.startQuestionTimer();
        
        this.questionCount++;
    }

    generateQuestion() {
        const operations = ['+', '-'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, answer;

        // 難易度に応じて数値の範囲を調整
        const difficulty = Math.min(Math.floor(this.score / 10), 3);
        const maxNumber = 10 + (difficulty * 5);

        if (operation === '+') {
            num1 = Math.floor(Math.random() * maxNumber) + 1;
            num2 = Math.floor(Math.random() * maxNumber) + 1;
            answer = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * maxNumber) + 1;
            num2 = Math.floor(Math.random() * num1) + 1;
            answer = num1 - num2;
        }

        return {
            text: `${num1} ${operation} ${num2} = ?`,
            answer: answer
        };
    }

    generateAnswerButtons(question) {
        this.answerContainer.innerHTML = '';
        
        // 正解を含む3つの選択肢を生成
        const answers = new Set([question.answer]);
        while (answers.size < 3) {
            const offset = Math.floor(Math.random() * 5) + 1;
            const sign = Math.random() < 0.5 ? 1 : -1;
            answers.add(question.answer + (offset * sign));
        }

        // 選択肢をシャッフル
        const shuffledAnswers = Array.from(answers).sort(() => Math.random() - 0.5);

        // ボタンを生成
        shuffledAnswers.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.addEventListener('click', () => this.checkAnswer(answer, question.answer));
            this.answerContainer.appendChild(button);
        });
    }

    checkAnswer(selected, correct) {
        if (selected === correct) {
            this.score += 10;
            this.updateScore();
            this.updateRank();
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
    }

    updateRank() {
        let rank = '見習い';
        if (this.score >= 50) rank = '上忍';
        else if (this.score >= 30) rank = '中忍';
        else if (this.score >= 10) rank = '下忍';
        
        this.rankElement.textContent = rank;
    }

    startQuestionTimer() {
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
        
        this.questionElement.textContent = `ゲーム終了！\nスコア: ${this.score}点`;
        this.answerContainer.innerHTML = '';
        
        // リスタートボタンを表示（アニメーション付き）
        this.startButton.style.display = 'block';
        this.startButton.textContent = 'もう一度挑戦';
        this.startButton.style.animation = 'fadeIn 0.5s';
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