window.onload = function() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const tableBody = document.getElementById('leaderboard-body');
    
    leaderboard.sort((a, b) => b.score - a.score);
    tableBody.innerHTML = '';

    let isInTop5 = false;
    const currentNickname = localStorage.getItem('nickname');

    leaderboard.slice(0, 10).forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><p>${player.name}</p></td>
            <td>${player.score}</td>
        `;
        tableBody.appendChild(row);

        if (index < 5 && currentNickname === player.name) {
            isInTop5 = true;
        }
    });

    if (isInTop5) {
        alert(`${currentNickname}, та leaderboard-ийн эхний 5-т орсон байна! 🎉`);
    }
};
