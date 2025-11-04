/**
 * Cricket Business Rules and Calculations
 * Cricket Scorer Pro - v3.5.0
 *
 * This file contains all cricket-specific business logic:
 * - Wicket calculations
 * - Innings end detection
 * - Match completion rules
 * - Score calculations
 */

/**
 * Calculate maximum wickets for a team based on player count
 * A team is "all out" when wickets = (total players - 1)
 *
 * @param {Array} players - Array of player names
 * @returns {number} Maximum wickets before all out
 *
 * Examples:
 * - 11 players → 10 wickets
 * - 7 players → 6 wickets
 * - 5 players → 4 wickets
 */
function calculateMaxWickets(players) {
    const totalPlayers = players.filter(p => p && p.trim() !== '').length;
    return totalPlayers > 0 ? totalPlayers - 1 : 10; // Default to 10 if no players
}

/**
 * Check if team is all out
 *
 * @param {number} wickets - Current wickets
 * @param {number} maxWickets - Maximum wickets for this team
 * @returns {boolean} True if all out
 */
function isAllOut(wickets, maxWickets) {
    return wickets >= maxWickets;
}

/**
 * Check if overs are complete
 *
 * @param {number} overs - Current overs
 * @param {number} totalOvers - Total overs allocated
 * @returns {boolean} True if overs complete
 */
function areOversComplete(overs, totalOvers) {
    return overs >= totalOvers;
}

/**
 * Check if target is chased (2nd innings only)
 *
 * @param {number} innings - Current innings (1 or 2)
 * @param {number} runs - Current runs
 * @param {number} target - Target to chase
 * @returns {boolean} True if target chased
 */
function isTargetChased(innings, runs, target) {
    return innings === 2 && target && runs >= target;
}

/**
 * Calculate wickets remaining
 *
 * @param {number} maxWickets - Maximum wickets for team
 * @param {number} currentWickets - Current wickets fallen
 * @returns {number} Wickets remaining
 */
function calculateWicketsRemaining(maxWickets, currentWickets) {
    return maxWickets - currentWickets;
}

/**
 * Calculate balls remaining in innings
 *
 * @param {number} totalOvers - Total overs allocated
 * @param {number} currentOvers - Current overs bowled
 * @param {number} currentBalls - Current balls in over (0-5)
 * @returns {number} Balls remaining
 */
function calculateBallsRemaining(totalOvers, currentOvers, currentBalls) {
    const totalBalls = totalOvers * 6;
    const ballsBowled = (currentOvers * 6) + currentBalls;
    return totalBalls - ballsBowled;
}

/**
 * Calculate runs difference
 *
 * @param {number} runs1 - First team runs
 * @param {number} runs2 - Second team runs
 * @returns {number} Absolute difference
 */
function calculateRunsDifference(runs1, runs2) {
    return Math.abs(runs1 - runs2);
}

/**
 * Determine match result
 *
 * @param {Object} innings1Data - First innings data
 * @param {Object} innings2Data - Second innings data
 * @param {string} team1Name - First team name
 * @param {string} team2Name - Second team name
 * @param {string} battingTeam - Current batting team ('team1' or 'team2')
 * @param {Array} team1Players - Team 1 players
 * @param {Array} team2Players - Team 2 players
 * @returns {string} Match result text
 */
function getMatchResult(innings1Data, innings2Data, team1Name, team2Name, battingTeam, team1Players, team2Players) {
    if (!innings1Data || !innings2Data) return '';

    // Determine which team batted second and calculate their max wickets
    const team2BattingPlayers = (battingTeam === 'team2' ? team2Players : team1Players).filter(p => p.trim() !== '');
    const team2MaxWickets = team2BattingPlayers.length > 0 ? team2BattingPlayers.length - 1 : 10;

    if (innings2Data.runs > innings1Data.runs) {
        const wicketsRemaining = team2MaxWickets - innings2Data.wickets;
        const winningTeam = battingTeam === 'team2' ? team2Name : team1Name;
        return `${winningTeam} won by ${wicketsRemaining} wicket${wicketsRemaining !== 1 ? 's' : ''}`;
    } else if (innings2Data.runs < innings1Data.runs) {
        const runsDiff = innings1Data.runs - innings2Data.runs;
        const winningTeam = battingTeam === 'team1' ? team2Name : team1Name;
        return `${winningTeam} won by ${runsDiff} run${runsDiff !== 1 ? 's' : ''}`;
    } else {
        return 'Match Tied';
    }
}

/**
 * Calculate batting average
 *
 * @param {number} runs - Total runs scored
 * @param {number} innings - Total innings
 * @param {number} notOuts - Times not out
 * @returns {string} Batting average
 */
function calculateBattingAverage(runs, innings, notOuts) {
    const outs = innings - notOuts;
    if (outs <= 0) return 'N/A';
    return (runs / outs).toFixed(2);
}

/**
 * Calculate strike rate
 *
 * @param {number} runs - Total runs scored
 * @param {number} balls - Total balls faced
 * @returns {string} Strike rate
 */
function calculateStrikeRate(runs, balls) {
    if (balls <= 0) return '0.00';
    return ((runs / balls) * 100).toFixed(2);
}

/**
 * Calculate bowling average
 *
 * @param {number} runsConceded - Total runs conceded
 * @param {number} wickets - Total wickets taken
 * @returns {string} Bowling average
 */
function calculateBowlingAverage(runsConceded, wickets) {
    if (wickets <= 0) return 'N/A';
    return (runsConceded / wickets).toFixed(2);
}

/**
 * Calculate economy rate
 *
 * @param {number} runsConceded - Total runs conceded
 * @param {number} ballsBowled - Total balls bowled
 * @returns {string} Economy rate (runs per over)
 */
function calculateEconomyRate(runsConceded, ballsBowled) {
    if (ballsBowled <= 0) return '0.00';
    return ((runsConceded / (ballsBowled / 6))).toFixed(2);
}

/**
 * Format overs display (e.g., 15.3 for 15 overs 3 balls)
 *
 * @param {number} overs - Complete overs
 * @param {number} balls - Balls in current over (0-5)
 * @returns {string} Formatted overs (e.g., "15.3")
 */
function formatOvers(overs, balls) {
    return `${overs}.${balls}`;
}

/**
 * Convert balls to overs (e.g., 93 balls → 15.3 overs)
 *
 * @param {number} totalBalls - Total balls bowled
 * @returns {string} Formatted overs
 */
function ballsToOvers(totalBalls) {
    const overs = Math.floor(totalBalls / 6);
    const balls = totalBalls % 6;
    return `${overs}.${balls}`;
}

// Export for use in other scripts (if using modules)
// For now, these are globally available
