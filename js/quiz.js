class Quiz {

    constructor() {

        this.currentQuestionIndex = 0;
        this.questions = [];
        this.userAnswers = [];

        this.standardPoints = 0;
        this.bonusPoints = 0;

        this.timePerQuestion = 15;
        this.timeRemaining = this.timePerQuestion;

        this.timerInterval = null;
    }

    loadQuestions(categoryId, data) {

        const category = data.categories.find(
            c => c.id === categoryId
        );

        if (!category) return false;

        this.questions = Utils.getRandomQuestions(
            category.questions,
            15
        );

        this.questions.forEach(question => {
            question.answers =
                Utils.shuffleArray(question.answers);
        });

        this.currentCategory = category.name;

        this.userAnswers =
            new Array(this.questions.length).fill(null);

        return true;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    getBonusPoints() {

        if (this.timeRemaining >= 14) return 5;
        if (this.timeRemaining === 13) return 4;
        if (this.timeRemaining === 12) return 3;
        if (this.timeRemaining === 11) return 2;
        if (this.timeRemaining === 10) return 1;

        return 0;
    }

    submitAnswer(selectedAnswers) {

        const question =
            this.getCurrentQuestion();

        const result =
            this.checkAnswer(
                question,
                selectedAnswers
            );

        const timeSpent =
            this.timePerQuestion -
            this.timeRemaining;

        let bonus = 0;

        if (result.isPerfect) {

            bonus =
                this.getBonusPoints();

            this.bonusPoints += bonus;
        }

        this.standardPoints += result.points;

        this.userAnswers[
            this.currentQuestionIndex
        ] = {

            questionId: question.id,

            selected: selectedAnswers,

            correct: result.isPerfect,

            points: result.points,

            timeSpent,

            bonus
        };

        return result.isPerfect;
    }

    checkAnswer(question, selectedAnswers) {

        // SINGLE CHOICE
        if (question.type === "single") {

            const answer =
                question.answers[
                    selectedAnswers[0]
                ];

            const isCorrect =
                answer &&
                answer.correct;

            return {
                isPerfect: isCorrect,
                points: isCorrect ? 10 : 0
            };
        }

        // MULTIPLE CHOICE
        if (question.type === "multiple") {

            const correctIndexes =
                question.answers
                    .map(
                        (answer, index) =>
                            answer.correct
                                ? index
                                : -1
                    )
                    .filter(
                        index =>
                            index !== -1
                    );

            const totalCorrect =
                correctIndexes.length;

            let correctSelected = 0;
            let wrongSelected = 0;

            selectedAnswers.forEach(index => {

                if (
                    question.answers[index]
                        ?.correct
                ) {

                    correctSelected++;

                } else {

                    wrongSelected++;
                }
            });

            let points =
                (
                    (
                        correctSelected -
                        wrongSelected
                    ) /
                    totalCorrect
                ) * 10;

            points =
                Math.max(0, points);

            points =
                Number(
                    points.toFixed(2)
                );

            const isPerfect =

                selectedAnswers.length ===
                totalCorrect &&

                selectedAnswers.every(
                    index =>
                        correctIndexes.includes(
                            index
                        )
                );

            return {
                isPerfect,
                points
            };
        }

        return {
            isPerfect: false,
            points: 0
        };
    }

    nextQuestion() {

        if (
            this.currentQuestionIndex <
            this.questions.length - 1
        ) {

            this.currentQuestionIndex++;

            this.timeRemaining =
                this.timePerQuestion;

            return true;
        }

        this.currentQuestionIndex++;

        return false;
    }

    startTimer(
        updateCallback,
        timeoutCallback
    ) {

        this.stopTimer();

        this.timeRemaining =
            this.timePerQuestion;

        updateCallback(
            this.timeRemaining
        );

        this.timerInterval =
            setInterval(() => {

                this.timeRemaining--;

                updateCallback(
                    this.timeRemaining
                );

                if (
                    this.timeRemaining <= 0
                ) {

                    this.stopTimer();

                    timeoutCallback();
                }

            }, 1000);
    }

    stopTimer() {

        if (
            this.timerInterval
        ) {

            clearInterval(
                this.timerInterval
            );

            this.timerInterval = null;
        }
    }

    getCorrectCount() {

        return this.userAnswers.filter(
            answer =>
                answer &&
                answer.correct
        ).length;
    }

    getResults() {

        const correctCount =
            this.getCorrectCount();

        return {

            correctCount,

            totalQuestions:
                this.questions.length,

            achievementPercentage:
                Utils.calculateAchievementPercentage(
                    correctCount,
                    this.questions.length
                ),

            standardPoints:
                Number(
                    this.standardPoints.toFixed(2)
                ),

            bonusPoints:
                this.bonusPoints,

            totalPoints:
                Number(
                    (
                        this.standardPoints +
                        this.bonusPoints
                    ).toFixed(2)
                ),

            answers:
                this.userAnswers
        };
    }
}
