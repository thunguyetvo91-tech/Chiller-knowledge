class Utils {

    static shuffleArray(array) {

        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {

            const j = Math.floor(
                Math.random() * (i + 1)
            );

            [shuffled[i], shuffled[j]] = [
                shuffled[j],
                shuffled[i]
            ];
        }

        return shuffled;
    }

    static getRandomQuestions(
        questions,
        count
    ) {

        return this.shuffleArray(
            questions
        ).slice(
            0,
            Math.min(
                count,
                questions.length
            )
        );
    }

    static formatTime(seconds) {

        const minutes =
            Math.floor(seconds / 60);

        return (
            minutes +
            ":" +
            (seconds % 60)
                .toString()
                .padStart(2, "0")
        );
    }

    static getStoredScores() {

        const scores =
            localStorage.getItem(
                "chillerLeaderboard"
            );

        return scores
            ? JSON.parse(scores)
            : [];
    }

    static saveScore(score) {

        const scores =
            this.getStoredScores();

        scores.push(score);

        scores.sort(
            (a, b) =>
                b.totalPoints -
                a.totalPoints
        );

        localStorage.setItem(
            "chillerLeaderboard",
            JSON.stringify(
                scores.slice(0, 100)
            )
        );
    }

    static getTopScores(
        limit = 10
    ) {

        return this
            .getStoredScores()
            .slice(0, limit);
    }

    static generateBonusPoints(
        timeRemaining
    ) {

        if (timeRemaining >= 14)
            return 5;

        if (timeRemaining === 13)
            return 4;

        if (timeRemaining === 12)
            return 3;

        if (timeRemaining === 11)
            return 2;

        if (timeRemaining === 10)
            return 1;

        return 0;
    }

    static calculateAchievementPercentage(
        correct,
        total
    ) {

        return Math.round(
            (correct / total) * 100
        );
    }
}
