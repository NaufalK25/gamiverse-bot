const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async url => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const container = $('div#page_content');

        const errorContainer = container.find('div.negative');
        if (errorContainer.length > 0) {
            const errorHeader = errorContainer.find('div').text();
            const errorMessage = errorContainer.find('p').text().trim();
            return {
                success: false,
                error: errorHeader,
                message: errorMessage
            };
        }

        const searchContainer = container.find('div.player_search_results__container');
        if (searchContainer.length > 0) {
            return {
                success: false,
                error: `Player tag #${url.split('/').at(-2)} not found (404)`
            };
        }

        const headerContainer = container.find('div.player_profile__header_segment');
        const topHeaderContainer = headerContainer.find('div.p_header_container div.p_head_item');
        const bottomHeaderContainer = headerContainer.find('div.player__profile_header_container');
        const leagueContainer = bottomHeaderContainer.find('div').first();
        const clanContainer = bottomHeaderContainer.find('div.player_aux_info div').first();

        const arenaImage = headerContainer.children().first().find('img').attr('src');
        const playerName = topHeaderContainer.find('h1').text().trim();
        const playerTag = topHeaderContainer.find('h2').text();
        const [trophy, bestTrophy, _] = leagueContainer.find('div:nth-child(2)').text().split(' ');
        const arenaLevel = leagueContainer.find('div:nth-child(3)').text().trim();
        const arenaName = leagueContainer.children().length > 3 ? leagueContainer.find('div').last().text().trim() : '';
        const pathOfLegendsTrophy = bottomHeaderContainer.children().length > 3 ? bottomHeaderContainer.find('div.league_info_container div').last().text().trim() : '0';
        const clanBadge = clanContainer.children().first().find('img').attr('src');
        const clanName = clanContainer.find('div.ui.header.item').text().trim();
        const clanRole = clanContainer.children().length === 3 ? clanContainer.find('div').last().text().trim() : 'Not in Clan';
        let clanTag = '';

        if (clanName !== 'Not in Clan') {
            clanTag = `#${clanContainer.find('div.ui.header.item a').attr('href').split('/').at(-1)}`;
        }

        const statsContainer = container.find('div#stats div.ui.attached.padded.segment div.ui.stackable.two.column.divided.relaxed.grid');

        let pathOfLegends = {};
        let pathOfLegendsStatsContainer = null;
        let battleStatsContainer = statsContainer.children().first().find('div');
        let challengeStatsContainer = statsContainer.find('div:nth-child(2) div table tbody');
        const miscStatsContainer = statsContainer.children().last().find('div table tbody');

        if (statsContainer.children().length > 3) {
            pathOfLegendsStatsContainer = statsContainer.children().first().find('div table tbody');
            battleStatsContainer = statsContainer.find('div:nth-child(2) div');
            challengeStatsContainer = statsContainer.find('div:nth-child(3) div table tbody');

            const bestSeasonRank = pathOfLegendsStatsContainer.find('tr:nth-child(2) td.right').text().trim();
            const bestSeasonLeague = pathOfLegendsStatsContainer.find('tr:nth-child(3) td.right').text().trim();
            const bestSeasonRatings = pathOfLegendsStatsContainer.find('tr:nth-child(4) td.right').text().trim();
            const currentSeasonLeague = pathOfLegendsStatsContainer.find('tr:nth-child(6) td.right').text().trim();
            const currentSeasonTrophies = pathOfLegendsStatsContainer.find('tr:nth-child(7) td.right').text().trim();
            const lastSeasonRank = pathOfLegendsStatsContainer.find('tr:nth-child(9) td.right').text().trim();
            const lastSeasonLeague = pathOfLegendsStatsContainer.find('tr:nth-child(10) td.right').text().trim();
            const lastSeasonTrophies = pathOfLegendsStatsContainer.find('tr:nth-child(11) td.right').text().trim();
            const bestLegacyLadderSeasonRank = pathOfLegendsStatsContainer.find('tr:nth-child(13) td.right').text().trim();
            const bestLegacyLadderSeasonTrophies = pathOfLegendsStatsContainer.find('tr:last-child td.right').text().trim();

            pathOfLegends = {
                bestSeason: {
                    rank: bestSeasonRank,
                    league: bestSeasonLeague,
                    ratings: bestSeasonRatings
                },
                currentSeason: {
                    league: currentSeasonLeague,
                    trophies: currentSeasonTrophies
                },
                lastSeason: {
                    rank: lastSeasonRank,
                    league: lastSeasonLeague,
                    trophies: lastSeasonTrophies
                },
                bestLegacyLadderSeason: {
                    rank: bestLegacyLadderSeasonRank,
                    trophies: bestLegacyLadderSeasonTrophies.replace(',', '')
                }
            };
        }
        const topBattleStatsContainer = battleStatsContainer.find('table').first();
        const middleBattleStatsContainer = battleStatsContainer.find('table:nth-child(4) tbody');
        const bottomBattleStatsContainer = battleStatsContainer.children().last().find('tbody');

        const clanCardsCollected = topBattleStatsContainer.find('tr:nth-child(2) td.right').text();
        const warDaysWin = topBattleStatsContainer.find('tr:last-child td.right').text();
        const ladderChallangeWinsCount = middleBattleStatsContainer.find('tr:first-child td:nth-child(2)').text();
        const ladderChallangeWinsPercentage = middleBattleStatsContainer.find('tr:first-child td').last().text();
        const ladderChallangeLosesCount = middleBattleStatsContainer.find('tr:last-child td:nth-child(2)').text();
        const ladderChallangeLosesPercentage = middleBattleStatsContainer.find('tr:last-child td').last().text();
        const oneVOneDraws = bottomBattleStatsContainer.find('tr:first-child td.right').text().trim();
        const totalGamesPlayed = bottomBattleStatsContainer.find('tr:nth-child(2) td.right').text();
        const threeCrownWins = bottomBattleStatsContainer.find('tr:nth-child(3) td.right').text();
        const ladderChallengeTimeSpent = bottomBattleStatsContainer.find('tr:nth-child(5) td.right').text();
        const tournamentsTimeSpent = bottomBattleStatsContainer.find('tr:nth-child(6) td.right').text();
        const totalTimeSpent = bottomBattleStatsContainer.find('tr:last-child td.right').text();

        const challengeMaxWins = challengeStatsContainer.find('tr:nth-child(2) td.right').text();
        const challengeCardsWon = challengeStatsContainer.find('tr:nth-child(3) td.right').text();
        const challengeClassicChallenge12Wins = challengeStatsContainer.find('tr:nth-child(4) td.right').text().trim();
        const challengeGrandChallenge12Wins = challengeStatsContainer.find('tr:nth-child(5) td.right').text().trim();
        const tournamentTotalGamesPlayed = challengeStatsContainer.find('tr:nth-child(7) td.right').text();
        const tournamentCardsWon = challengeStatsContainer.find('tr:nth-child(8) td.right').text();
        const tournamentCardsPerBattle = challengeStatsContainer.find('tr:last-child td.right').text();

        const expLevel = miscStatsContainer.find('tr:first-child td.right').text().trim().split(' ').at(-1);
        const [cardsFound, totalCardsFound] = miscStatsContainer
            .find('tr:nth-child(2) td.right')
            .text()
            .split('/')
            .map(cardFound => cardFound.trim());
        const totalDonations = miscStatsContainer.find('tr:nth-child(3) td.right').text();
        const accountAge = miscStatsContainer.find('tr:nth-child(4) td.right').text().trim();
        const gamesPlayedPerDay = miscStatsContainer.find('tr:last-child td.right').text().trim();

        return {
            success: true,
            player: {
                name: playerName,
                tag: playerTag,
                expLevel,
                trophies: trophy.trim(),
                bestTrophies: bestTrophy.replace('/', '').trim(),
                pathOfLegendsTrophies: pathOfLegendsTrophy,
                cardsFound: `${cardsFound}/${totalCardsFound}`,
                totalDonations: totalDonations.replace(',', ''),
                accountAge,
                gamesPlayedPerDay,
                arena: {
                    level: arenaLevel,
                    name: arenaName,
                    image: arenaImage
                },
                ladderChallenge: {
                    wins: {
                        count: ladderChallangeWinsCount.replace(',', ''),
                        percentage: ladderChallangeWinsPercentage
                    },
                    loses: {
                        count: ladderChallangeLosesCount.replace(',', ''),
                        percentage: ladderChallangeLosesPercentage
                    },
                    oneVOneDraws: oneVOneDraws.replace(',', ''),
                    totalGamesPlayed: totalGamesPlayed.replace(',', ''),
                    threeCrownWins: threeCrownWins.replace(',', ''),
                    ladderChallengeTimeSpent,
                    tournamentsTimeSpent,
                    totalTimeSpent
                },
                challenges: {
                    maxWins: challengeMaxWins,
                    cardsWon: challengeCardsWon.replace(',', ''),
                    classicChallenge12Wins: challengeClassicChallenge12Wins,
                    grandChallenge12Wins: challengeGrandChallenge12Wins
                },
                tournaments: {
                    totalGamesPlayed: tournamentTotalGamesPlayed.replace(',', ''),
                    cardsWon: tournamentCardsWon.replace(',', ''),
                    cardsPerBattle: tournamentCardsPerBattle
                },
                pathOfLegends,
                clan: {
                    name: clanName,
                    tag: clanTag,
                    role: clanRole || '',
                    badge: clanBadge,
                    wars: {
                        totalCardsCollected: clanCardsCollected.replace(',', ''),
                        warDaysWin
                    }
                }
            }
        };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
};
