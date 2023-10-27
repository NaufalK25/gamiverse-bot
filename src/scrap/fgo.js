const axios = require('axios');
const cheerio = require('cheerio');

const POSITION = {
    0: 'All',
    1: 'Saber',
    2: 'Archer',
    3: 'Lancer',
    4: 'Rider',
    5: 'Caster',
    6: 'Assassin',
    7: 'Berserker',
    8: 'Extra'
};

module.exports = async url => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const main = $('main');
        const headerContainer = main.find('div.padding-container.support-master-container div.support-header-left');

        if (headerContainer.length === 0) {
            return {
                success: false,
                error: 'Master Not Found!'
            };
        }

        const masterName = headerContainer.find('h2').text();
        const [server, _, userId] = headerContainer.find('h4').text().split(' ');
        const tagline = headerContainer.find('h5.player-description').text() || 'No Tagline';
        const masterLv = headerContainer.find('div#friend-wrapper div#last-seen div h6').text().trim().split(' ').at(1);

        const decksName = main
            .find('ul.nav.nav-tabs.nav-tab-servants li a')
            .filter(function () {
                return $(this).text().includes('Deck');
            })
            .map(function () {
                return $(this).text();
            })
            .get();
        const decks = decksName.reduce((acc, cur) => {
            acc[cur] = [];
            return acc;
        }, {});

        const servantContainer = main.find('div.bordered-container-servants div.decks div.deck div.support-full-view div.support-main-container');

        servantContainer.find('div.support-container div.svt-card').each(function (idx) {
            const [firstSkill, secondSkill, thirdSkill] = $(this).find('div.bc div.skill-levels.skill-levels-main').text().split(' / ');
            const lv = $(this).find('div.bc.bc-bottom div.servant-level').text().split(' ').at(-1);
            const np = $(this).find('div.bc div.np-level').text();
            const [hp, atk] = $(this)
                .find('div.bc.bc-bottom div.servant-hp-atk span')
                .map(function () {
                    return $(this).text();
                });

            decks[decksName[Math.floor(idx / 9)]].push({
                name: $(this).attr('title'),
                classPosition: POSITION[idx % 9],
                url: $(this).find('a').attr('href'),
                lv,
                hp,
                atk,
                skill: {
                    first: firstSkill,
                    second: secondSkill,
                    third: thirdSkill
                },
                np
            });
        });

        servantContainer.find('div.ce-container div.craft-essence').each(function (idx) {
            const ceContainer = $(this).find('div.craft-essence-inner.craft-essence-inner-wh div.ce-row');
            const [hp, lv] = ceContainer.find('div.ce-row-left').map(function () {
                return $(this).text().split(' ').at(-1);
            });

            const ceContainerBottomRight = ceContainer.find('div.ce-row-right');
            const atk = ceContainerBottomRight.text().split(' ').at(0);
            const mlb = ceContainerBottomRight.find('span.mlb-icon').length > 0;

            decks[decksName[Math.floor(idx / 9)]][idx % 9].ce = {
                name: $(this).attr('title'),
                url: $(this).find('a').attr('href'),
                lv,
                hp,
                atk,
                mlb
            };
        });

        return {
            success: true,
            master: {
                server,
                userId: masterName ? userId.replaceAll(',', '') : userId,
                name: masterName,
                tagline,
                lv: masterLv,
                decks
            }
        };
    } catch (err) {
        return {
            success: false,
            error: 'Internal Server Error!'
        };
    }
};
