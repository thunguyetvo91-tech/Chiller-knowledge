class Leaderboard {

    static async displayLeaderboard(elementId) {

        const scores =
            await window.FirebaseDB.getTopScores(20);

        const tableBody =
            document.getElementById(elementId);

        if (!scores.length) {

            tableBody.innerHTML =
                '<tr><td colspan="4" style="text-align:center;padding:20px;color:#999;">No scores yet. Be first!</td></tr>';

            return;
        }

        tableBody.innerHTML =
            scores.map((score, index) => `

                <tr>
                    <td>
                        ${
                            index === 0 ? "🥇" :
                            index === 1 ? "🥈" :
                            index === 2 ? "🥉" : "•"
                        }
                        ${index + 1}
                    </td>

                    <td>
                        ${this.escapeHtml(score.playerName)}
                    </td>

                    <td>
                        ${score.totalPoints}
                    </td>

                    <td>
                        ${score.achievementPercentage}%
                    </td>
                </tr>

            `).join("");
    }

    static async displayLeaderboardPreview(elementId) {

        const scores =
            await window.FirebaseDB.getTopScores(5);

        const container =
            document.getElementById(elementId);

        if (!scores.length) {

            container.innerHTML =
                '<div style="color:#999;">No scores yet</div>';

            return;
        }

        container.innerHTML =
            scores.map((score, index) => `

                <div style="display:flex;justify-content:space-between;padding:5px 0;">

                    <span>
                        ${
                            index === 0 ? "🥇" :
                            index === 1 ? "🥈" :
                            index === 2 ? "🥉" : "•"
                        }
                        ${index + 1}.
                        ${this.escapeHtml(score.playerName)}
                    </span>

                    <span>
                        ${score.totalPoints} pts
                    </span>

                </div>

            `).join("");
    }

    static escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }
}
