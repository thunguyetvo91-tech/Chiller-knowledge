class App {

    constructor() {

        this.quiz = new Quiz();
        this.questionsData = null;
        this.playerName = "";

        this.isQuizActive = false;

        this.feedbackTimeout = null;
    }

    async init() {

        await this.loadQuestions();

        this.showWelcome();
    }

    async loadQuestions() {

        try {

            const response =
                await fetch(
                    "data/questions.json"
                );

            this.questionsData =
                await response.json();

        } catch (error) {

            console.error(
                "Error:",
                error
            );

            alert(
                "Failed to load questions"
            );
        }
    }

    showScreen(screenId) {

        document
            .querySelectorAll(".screen")
            .forEach(screen =>
                screen.classList.remove(
                    "active"
                )
            );

        document
            .getElementById(screenId)
            .classList.add("active");
    }

    showWelcome() {

        Leaderboard
            .displayLeaderboardPreview(
                "leaderboardPreview"
            );

        this.showScreen(
            "welcomeScreen"
        );

        document
            .getElementById(
                "playerName"
            ).value = "";

        document
            .getElementById(
                "playerName"
            ).focus();
    }

    startGame() {

        const name =
            document
                .getElementById(
                    "playerName"
                )
                .value
                .trim();

        if (!name) {

            alert(
                "Enter your name"
            );

            return;
        }

        this.playerName = name;

        this.showCategories();
    }

    showCategories() {

        const grid =
            document.getElementById(
                "categoryGrid"
            );

        grid.innerHTML = "";

        this.questionsData.categories
            .forEach(category => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "category-card";

                card.innerHTML = `
                    <div class="icon">${category.icon}</div>
                    <div class="title">${category.name}</div>
                    <div>${category.questions.length} Q</div>
                `;

                card.onclick = () =>
                    this.startQuiz(
                        category.id
                    );

                grid.appendChild(card);
            });

        this.showScreen(
            "categoryScreen"
        );
    }

    startQuiz(categoryId) {

        this.isQuizActive = true;

        if (
            this.feedbackTimeout
        ) {

            clearTimeout(
                this.feedbackTimeout
            );

            this.feedbackTimeout = null;
        }

        this.quiz = new Quiz();

        if (
            this.quiz.loadQuestions(
                categoryId,
                this.questionsData
            )
        ) {

            document.getElementById(
                "standardPoints"
            ).textContent = "0";

            document.getElementById(
                "bonusPoints"
            ).textContent = "0";

            this.showScreen(
                "quizScreen"
            );

            this.displayQuestion();

            this.quiz.startTimer(
                time =>
                    this.updateTimer(
                        time
                    ),
                () =>
                    this.timeExpired()
            );
        }
    }

    displayQuestion() {

        const question =
            this.quiz.getCurrentQuestion();

        const current =
            this.quiz
                .currentQuestionIndex + 1;

        document.getElementById(
            "questionCounter"
        ).textContent =
            `Q ${current}/10`;

        document.getElementById(
            "progressFill"
        ).style.width =
            `${current * 10}%`;

        document.getElementById(
            "questionText"
        ).textContent =
            question.question;

        const container =
            document.getElementById(
                "answerOptions"
            );

        container.innerHTML = "";

        const inputType =
            question.type === "single"
                ? "radio"
                : "checkbox";

        const groupName =
            `answer-${question.id}`;

        question.answers.forEach(
            (answer, index) => {

                const label =
                    document.createElement(
                        "label"
                    );

                label.className =
                    "answer-option";

                const input =
                    document.createElement(
                        "input"
                    );

                input.type =
                    inputType;

                input.name =
                    groupName;

                input.value =
                    index;

                const text =
                    document.createElement(
                        "span"
                    );

                text.textContent =
                    answer.text;

                label.appendChild(
                    input
                );

                label.appendChild(
                    text
                );

                label.onclick =
                    () =>
                        this.onAnswerSelected();

                container.appendChild(
                    label
                );
            });
    }

    onAnswerSelected() {

        if (
            !this.isQuizActive
        ) return;

        const question =
            this.quiz
                .getCurrentQuestion();

        const groupName =
            `answer-${question.id}`;

        const selected =
            Array.from(
                document.querySelectorAll(
                    `input[name="${groupName}"]:checked`
                )
            ).map(
                item =>
                    parseInt(
                        item.value
                    )
            );

        if (
            question.type === "single"
        ) {

            if (
                selected.length === 1
            ) {
                this.submitAnswer(
                    selected
                );
            }

        } else {

            if (
                selected.length > 0
            ) {
                this.submitAnswer(
                    selected
                );
            }
        }
    }

    submitAnswer(selectedAnswers) {

        if (
            !this.isQuizActive
        ) return;

        this.quiz.stopTimer();

        this.quiz.submitAnswer(
            selectedAnswers
        );

        document.getElementById(
            "standardPoints"
        ).textContent =
            this.quiz.standardPoints
                .toFixed(2);

        document.getElementById(
            "bonusPoints"
        ).textContent =
            this.quiz.bonusPoints;

        this.showFeedback();

        if (
            this.feedbackTimeout
        ) {

            clearTimeout(
                this.feedbackTimeout
            );
        }

        this.feedbackTimeout =
            setTimeout(() => {

                if (
                    !this.isQuizActive
                ) return;

                if (
                    this.quiz.nextQuestion()
                ) {

                    this.displayQuestion();

                    this.quiz.startTimer(
                        time =>
                            this.updateTimer(
                                time
                            ),
                        () =>
                            this.timeExpired()
                    );

                } else {

                    this.quizComplete();
                }

            }, 1500);
    }

    showFeedback() {

        const question =
            this.quiz
                .getCurrentQuestion();

        const inputs =
            document.querySelectorAll(
                `input[name="answer-${question.id}"]`
            );

        inputs.forEach(
            (input, index) => {

                const option =
                    input.parentElement;

                option.classList.add(
                    "disabled"
                );

                if (
                    question.answers[
                        index
                    ].correct
                ) {

                    option.classList.add(
                        "correct"
                    );

                } else if (
                    input.checked
                ) {

                    option.classList.add(
                        "incorrect"
                    );
                }
            });
    }

    updateTimer(time) {

        const timer =
            document.getElementById(
                "timerDisplay"
            );

        timer.textContent = time;

        if (time <= 3) {

            timer.classList.add(
                "warning"
            );

        } else {

            timer.classList.remove(
                "warning"
            );
        }
    }

    timeExpired() {

        if (
            !this.isQuizActive
        ) return;

        if (
            this.quiz.nextQuestion()
        ) {

            this.displayQuestion();

            this.quiz.startTimer(
                time =>
                    this.updateTimer(
                        time
                    ),
                () =>
                    this.timeExpired()
            );

        } else {

            this.quizComplete();
        }
    }

    quizComplete() {

        this.isQuizActive = false;

        this.quiz.stopTimer();

        if (
            this.feedbackTimeout
        ) {

            clearTimeout(
                this.feedbackTimeout
            );

            this.feedbackTimeout = null;
        }

        const results =
            this.quiz.getResults();

        this.saveResults(
            results
        );
    }

    saveResults(results) {

        Utils.saveScore({

            playerName:
                this.playerName,

            totalPoints:
                results.totalPoints,

            standardPoints:
                results.standardPoints,

            bonusPoints:
                results.bonusPoints,

            correctCount:
                results.correctCount,

            achievementPercentage:
                results.achievementPercentage,

            timestamp:
                new Date()
                    .toISOString()
        });

        this.displayResults(
            results
        );
    }

    displayResults(results) {

        document.getElementById(
            "totalCorrect"
        ).textContent =
            `${results.correctCount}/10`;

        document.getElementById(
            "achievementPercentage"
        ).textContent =
            `${results.achievementPercentage}%`;

        document.getElementById(
            "totalPoints"
        ).textContent =
            results.totalPoints;

        document.getElementById(
            "resultStandard"
        ).textContent =
            results.standardPoints;

        document.getElementById(
            "resultBonus"
        ).textContent =
            results.bonusPoints;

        this.showScreen(
            "resultsScreen"
        );
    }

    showExitConfirm() {

        document
            .getElementById(
                "exitModal"
            )
            .classList.remove(
                "hidden"
            );
    }

    closeExitModal() {

        document
            .getElementById(
                "exitModal"
            )
            .classList.add(
                "hidden"
            );
    }

    exitQuiz() {

        this.isQuizActive = false;

        this.quiz.stopTimer();

        if (
            this.feedbackTimeout
        ) {

            clearTimeout(
                this.feedbackTimeout
            );

            this.feedbackTimeout = null;
        }

        this.closeExitModal();

        this.quizComplete();
    }

    playAgain() {

        this.isQuizActive = false;

        this.quiz.stopTimer();

        if (
            this.feedbackTimeout
        ) {

            clearTimeout(
                this.feedbackTimeout
            );

            this.feedbackTimeout = null;
        }

        this.showCategories();
    }

    viewLeaderboard() {

        Leaderboard.displayLeaderboard(
            "leaderboardBody"
        );

        this.showScreen(
            "leaderboardScreen"
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.app =
            new App();

        app.init();
    }
);
