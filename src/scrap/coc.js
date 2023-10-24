const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async url => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const container = $('div.container.content div.row div.col-md-9');

        const name = container.find('div.headline.headline-md h2').text().trim();

        if (!name) {
            return {
                success: false,
                error: 'Player Not Found!'
            };
        }

        const middleContainer = container.find('div.row.margin-bottom-10');
        const middleLeftContainer = middleContainer.find('div.col-sm-6.sm-margin-bottom-20 div.service-block-v3.service-block-u');
        const firstLeft = middleLeftContainer.find('div.row.margin-bottom-20').first();
        const secondLeft = middleLeftContainer.find('div.row.margin-bottom-20:nth-child(3)');
        const thirdLeft = middleLeftContainer.find('div.statistics');

        const trophy = firstLeft.find('div.col-xs-6.service-in span.counter').text().trim();
        const thImage = firstLeft.find('div.col-xs-6.text-right.service-in img').attr('src');
        const expLevel = secondLeft.find('div.col-xs-6.text-right.service-in h4.counter').text().trim();
        const bestTrophies = thirdLeft.find('h3 span').text().trim();

        const middleRightContainer = middleContainer.find('div.col-sm-6 div.service-block-v3.service-block-blue div.statistics');
        const builderBattleTrophies = middleRightContainer.find('small').text().split(' ').at(0);
        const bestBuilderBattleTrophies = middleRightContainer.find('h3 span').text();

        const bottomContainer = container.find('div.main-counters.margin-bottom-40');
        const statsFirstRow = bottomContainer.find('div:nth-child(2)');
        const statsSecondRow = bottomContainer.find('div:nth-child(3)');
        const statsThirdRow = bottomContainer.find('div:nth-child(4)');
        const statsFourthRow = bottomContainer.find('div:nth-child(5)');

        const warStars = statsFirstRow.find('div:nth-child(3) span').text();
        const warPreferences = statsFirstRow.find('div:last-child span').text();
        const townHallLevel = statsSecondRow.find('div:first-child span').text();
        const townHallWeaponLevel = statsSecondRow.find('div:nth-child(2) span').text();
        const builderHallLevel = statsSecondRow.find('div:last-child span').text();
        const builderBaseLeague = statsThirdRow.find('div:nth-child(3) span').text();
        const league = statsFourthRow.find('div:first-child span a h4').text().trim();
        const tag = statsFourthRow.find('div:nth-child(2) span').text();

        const clanFirstRow = bottomContainer.find('div:nth-child(13)');
        const clanSecondRow = bottomContainer.find('div:nth-child(14)');

        const clanName = clanFirstRow.find('div:first-child span a').text();
        const clanLogo = clanFirstRow.find('div:last-child span img').attr('src');
        const clanTag = clanSecondRow.find('div:first-child span').text();
        const clanLevel = clanSecondRow.find('div:nth-child(2) span').text();
        const clanCapitalContribution = clanSecondRow.find('div:nth-child(3) span').text();
        const clanRole = clanSecondRow.find('div:last-child span').text();

        const table = container.find('table tbody');
        const totalAttackWins = table.find('tr:nth-child(13) td:nth-child(3)').text();
        const totalDefenseWins = table.find('tr:nth-child(14) td:nth-child(3)').text();
        const totalDonations = table.find('tr:nth-child(15) td:nth-child(3)').text();

        return {
            success: true,
            player: {
                name,
                tag,
                expLevel,
                townHallLevel,
                townHallWeaponLevel,
                builderHallLevel,
                league,
                trophies: +trophy.replaceAll('.', ''),
                bestTrophies,
                builderBaseLeague,
                builderBattleTrophies,
                bestBuilderBattleTrophies,
                warStars,
                warPreferences,
                totalAttackWins,
                totalDefenseWins,
                totalDonations,
                clan: {
                    name: clanName,
                    tag: clanTag,
                    logo: clanLogo,
                    level: clanLevel,
                    role: clanRole,
                    clanCapitalContribution
                },
                thImage: `https://www.coc-stats.net${thImage}`
            }
        };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
};
