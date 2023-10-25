const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async url => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const content = $('content');
        const infoBox = content.find('div.info-box div');
        const details = infoBox.find('div.details');
        const stats = infoBox.find('div.stats');

        const avatarImage = infoBox.find('figure img').attr('src');
        let avatarCharacter = avatarImage.split('_').at(-1).replace('.png', '');

        if (avatarCharacter === 'PlayerBoy') avatarCharacter = 'Aether';
        if (avatarCharacter === 'PlayerGirl') avatarCharacter = 'Lumine';

        const name = details.find('h1').text();
        const [ar, wl] = details.find('div.ar').text().split('  ');
        const totalAchievments = stats.find('div.achievements span').text();
        const spiralAbyss = stats.find('div.abyss span').text();

        const characterList = content
            .find('div.CharacterList')
            .children()
            .map(function () {
                const name = $(this).find('div.avatar figure').attr('style')?.split('_').at(-1).replace('.png)', '');

                if (name === 'PlayerBoy') name = 'Aether';
                if (name === 'PlayerGirl') name = 'Lumine';

                const level = $(this).find('div.avatar span').text();
                return { name, level };
            })
            .toArray()
            .filter(character => !!character.name);

        return {
            success: true,
            traveler: {
                name,
                uid: url.split('/').at(-2),
                ar: ar.split(' ').at(-1),
                wl: wl.split(' ').at(-1),
                avatar: {
                    image: `https://enka.network${avatarImage}`,
                    character: avatarCharacter
                },
                totalAchievments,
                spiralAbyss,
                characterList
            }
        };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
};
