export function saveScore(name, score) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    leaderboard.push({ name, score });

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

export function loadNickname() {
    return localStorage.getItem('nickname');
}
