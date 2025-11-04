/**
 * Player Statistics Management
 * Cricket Scorer Pro - v3.5.0
 *
 * This file handles all player statistics functionality:
 * - Updating player stats in Firestore
 * - Fetching player stats
 * - Calculating derived statistics (averages, strike rates, etc.)
 */

/**
 * Update player statistics in Firestore after a match
 * Aggregates cumulative stats for each player
 *
 * @param {Object} matchData - Complete match data
 * @param {Object} user - Firebase auth user object
 * @param {Object} db - Firestore database instance
 * @returns {Promise<void>}
 */
async function updatePlayerStatsInFirestore(matchData, user, db) {
    if (!user || !db) {
        console.log('⚠️ Skipping player stats update - no user or database');
        return;
    }

    try {
        console.log('📊 Updating player statistics...');
        const playersToUpdate = new Set();

        // Collect all players who participated (batted or bowled)
        // Get batting stats from both innings
        if (matchData.batsmanStats) {
            Object.keys(matchData.batsmanStats).forEach(index => {
                const playerName = matchData.team1Players?.[index] || matchData.team2Players?.[index];
                if (playerName && playerName.trim()) {
                    playersToUpdate.add(playerName.trim());
                }
            });
        }

        if (matchData.innings1Data?.batsmanStats) {
            Object.keys(matchData.innings1Data.batsmanStats).forEach(index => {
                const playerName = matchData.team1Players?.[index] || matchData.team2Players?.[index];
                if (playerName && playerName.trim()) {
                    playersToUpdate.add(playerName.trim());
                }
            });
        }

        if (matchData.innings2Data?.batsmanStats) {
            Object.keys(matchData.innings2Data.batsmanStats).forEach(index => {
                const playerName = matchData.team1Players?.[index] || matchData.team2Players?.[index];
                if (playerName && playerName.trim()) {
                    playersToUpdate.add(playerName.trim());
                }
            });
        }

        // Get bowling stats
        if (matchData.bowlerStats) {
            Object.keys(matchData.bowlerStats).forEach(index => {
                const playerName = matchData.team1Players?.[index] || matchData.team2Players?.[index];
                if (playerName && playerName.trim()) {
                    playersToUpdate.add(playerName.trim());
                }
            });
        }

        if (matchData.innings1Data?.bowlerStats) {
            Object.keys(matchData.innings1Data.bowlerStats).forEach(index => {
                const playerName = matchData.team1Players?.[index] || matchData.team2Players?.[index];
                if (playerName && playerName.trim()) {
                    playersToUpdate.add(playerName.trim());
                }
            });
        }

        if (matchData.innings2Data?.bowlerStats) {
            Object.keys(matchData.innings2Data.bowlerStats).forEach(index => {
                const playerName = matchData.team1Players?.[index] || matchData.team2Players?.[index];
                if (playerName && playerName.trim()) {
                    playersToUpdate.add(playerName.trim());
                }
            });
        }

        console.log(`Found ${playersToUpdate.size} players to update`);

        // Update each player's stats
        for (const playerName of playersToUpdate) {
            const playerRef = db.collection('playerStats').doc(`${user.uid}_${playerName}`);
            const playerDoc = await playerRef.get();

            // Get existing stats or initialize
            const existingStats = playerDoc.exists ? playerDoc.data() : {
                userId: user.uid,
                playerName: playerName,
                totalMatches: 0,
                totalInnings: 0,
                totalRuns: 0,
                totalBalls: 0,
                highScore: 0,
                notOuts: 0,
                fours: 0,
                sixes: 0,
                wickets: 0,
                runsConceded: 0,
                ballsBowled: 0
            };

            // Aggregate stats from this match
            let matchInnings = 0;
            let matchRuns = 0;
            let matchBalls = 0;
            let matchFours = 0;
            let matchSixes = 0;
            let matchNotOut = false;
            let matchHighScore = 0;

            // Check current innings
            const findPlayerIndex = (players) => players.findIndex(p => p && p.trim() === playerName);

            let playerIndex = findPlayerIndex(matchData.team1Players || []);
            if (playerIndex === -1) playerIndex = findPlayerIndex(matchData.team2Players || []);

            if (playerIndex !== -1) {
                // Current innings batting
                const batStats = matchData.batsmanStats?.[playerIndex];
                if (batStats && batStats.balls > 0) {
                    matchInnings++;
                    matchRuns += batStats.runs || 0;
                    matchBalls += batStats.balls || 0;
                    matchFours += batStats.fours || 0;
                    matchSixes += batStats.sixes || 0;
                    if (batStats.status !== 'out') matchNotOut = true;
                    matchHighScore = Math.max(matchHighScore, batStats.runs || 0);
                }
            }

            // Check innings 1 data
            if (matchData.innings1Data?.batsmanStats) {
                playerIndex = findPlayerIndex(matchData.battingTeam === 'team1' ? matchData.team1Players : matchData.team2Players);
                if (playerIndex !== -1) {
                    const batStats = matchData.innings1Data.batsmanStats[playerIndex];
                    if (batStats && batStats.balls > 0) {
                        matchInnings++;
                        matchRuns += batStats.runs || 0;
                        matchBalls += batStats.balls || 0;
                        matchFours += batStats.fours || 0;
                        matchSixes += batStats.sixes || 0;
                        if (batStats.status !== 'out') matchNotOut = true;
                        matchHighScore = Math.max(matchHighScore, batStats.runs || 0);
                    }
                }
            }

            // Aggregate bowling stats
            let matchWickets = 0;
            let matchRunsConceded = 0;
            let matchBallsBowled = 0;

            // Current innings bowling
            if (matchData.bowlerStats?.[playerIndex]) {
                const bowlStats = matchData.bowlerStats[playerIndex];
                matchWickets += bowlStats.wickets || 0;
                matchRunsConceded += bowlStats.runs || 0;
                matchBallsBowled += ((bowlStats.overs || 0) * 6) + (bowlStats.balls || 0);
            }

            // Previous innings bowling
            if (matchData.innings1Data?.bowlerStats?.[playerIndex]) {
                const bowlStats = matchData.innings1Data.bowlerStats[playerIndex];
                matchWickets += bowlStats.wickets || 0;
                matchRunsConceded += bowlStats.runs || 0;
                matchBallsBowled += ((bowlStats.overs || 0) * 6) + (bowlStats.balls || 0);
            }

            // Update cumulative stats
            const updatedStats = {
                userId: user.uid,
                playerName: playerName,
                totalMatches: existingStats.totalMatches + 1,
                totalInnings: existingStats.totalInnings + matchInnings,
                totalRuns: existingStats.totalRuns + matchRuns,
                totalBalls: existingStats.totalBalls + matchBalls,
                highScore: Math.max(existingStats.highScore, matchHighScore),
                notOuts: existingStats.notOuts + (matchNotOut ? 1 : 0),
                fours: existingStats.fours + matchFours,
                sixes: existingStats.sixes + matchSixes,
                wickets: existingStats.wickets + matchWickets,
                runsConceded: existingStats.runsConceded + matchRunsConceded,
                ballsBowled: existingStats.ballsBowled + matchBallsBowled,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            };

            await playerRef.set(updatedStats);
            console.log(`✅ Updated stats for ${playerName}`);
        }

        console.log('✅ All player stats updated successfully');
    } catch (error) {
        console.error('❌ Error updating player stats:', error);
        throw error;
    }
}

/**
 * Fetch all player statistics for the current user
 *
 * @param {Object} user - Firebase auth user object
 * @param {Object} db - Firestore database instance
 * @returns {Promise<Array>} Array of player stats with calculated metrics
 */
async function fetchPlayerStats(user, db) {
    if (!user || !db) {
        console.log('⚠️ Cannot fetch player stats - no user or database');
        return [];
    }

    try {
        console.log('📊 Fetching player statistics...');
        const snapshot = await db.collection('playerStats')
            .where('userId', '==', user.uid)
            .get();

        const stats = [];
        snapshot.forEach(doc => {
            const data = doc.data();

            // Calculate derived statistics
            const innings = data.totalInnings || 0;
            const outs = innings - (data.notOuts || 0);
            const battingAvg = outs > 0 ? (data.totalRuns / outs).toFixed(2) : 'N/A';
            const strikeRate = data.totalBalls > 0 ? ((data.totalRuns / data.totalBalls) * 100).toFixed(2) : '0.00';
            const bowlingAvg = data.wickets > 0 ? (data.runsConceded / data.wickets).toFixed(2) : 'N/A';
            const economy = data.ballsBowled > 0 ? ((data.runsConceded / (data.ballsBowled / 6))).toFixed(2) : '0.00';

            stats.push({
                id: doc.id,
                ...data,
                battingAvg,
                strikeRate,
                bowlingAvg,
                economy
            });
        });

        // Sort by total runs (highest first)
        stats.sort((a, b) => (b.totalRuns || 0) - (a.totalRuns || 0));

        console.log(`✅ Loaded stats for ${stats.length} players`);
        return stats;
    } catch (error) {
        console.error('❌ Error fetching player stats:', error);
        throw error;
    }
}
