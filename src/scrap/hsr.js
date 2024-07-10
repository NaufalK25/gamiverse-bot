const axios = require('axios');
const cheerio = require('cheerio');

const getCharaName = charaId => {
    // list of charaId -> https://github.com/EnkaNetwork/API-docs/blob/master/store/hsr/honker_avatars.json
    // image -> https://enka.network/ui/hsr/SpriteOutput/AvatarRoundIcon/${charaId}.png
    const CHARA_NAME = {
        1001: 'March 7th',
        1002: 'Dan Heng',
        1003: 'Himeko',
        1004: 'Welt',
        1005: 'Kafka',
        1006: 'Silver Wolf',
        1008: 'Arlan',
        1009: 'Asta',
        1013: 'Herta',
        1101: 'Bronya',
        1102: 'Seele',
        1103: 'Serval',
        1104: 'Gepard',
        1105: 'Natasha',
        1106: 'Pela',
        1107: 'Clara',
        1108: 'Sampo',
        1109: 'Hook',
        1110: 'Lynx',
        1111: 'Luka',
        1112: 'Topaz and Numby',
        1201: 'Qingque',
        1202: 'Tingyun',
        1203: 'Luocha',
        1204: 'Jing Yuan',
        1205: 'Blade',
        1206: 'Sushang',
        1207: 'Yukong',
        1208: 'Fu Xuan',
        1209: 'Yanqing',
        1210: 'Guinaifen',
        1211: 'Bailu',
        1212: 'Jingliu',
        1213: 'Dan Heng - Imbibitor Lunae',
        1214: 'Xueyi',
        1215: 'Hanya',
        1217: 'Huohuo',
        1301: 'Gallagher',
        1302: 'Argenti',
        1303: 'Ruan Mei',
        1304: 'Aventurine',
        1305: 'Dr. Ratio',
        1306: 'Sparkle',
        1307: 'Black Swan',
        1308: 'Acheron',
        1309: 'Robin',
        1310: 'Firefly',
        1312: 'Misha',
        1314: 'Jade',
        1315: 'Boothill',
        8001: 'Caelus (Trailblazer the Destruction)',
        8002: 'Stelle (Trailblazer the Destruction)',
        8003: 'Caelus (Trailblazer the Preservation)',
        8004: 'Stelle (Traibilizer the Preservation)',
        8005: '',
        8006: '',
        200101: 'March 7th: Welcome',
        200102: 'Dan Heng: Welcome',
        200103: 'Himeko: Welcome',
        200104: 'Welt: Welcome',
        200105: 'Caelus: Welcome',
        200106: 'Stelle: Welcome',
        200107: 'Kafka: Dinner Party',
        200108: 'Blade: Dinner Party',
        200109: 'Jing Yuan: In Leisure',
        200110: 'Fu Xuan: In Leisure',
        200111: 'Bronya: Celebration',
        200112: 'Gepard: Celebration',
        202001: 'Wubbaboo',
        202002: 'Trash Can',
        202003: 'Junjun',
        202004: 'Peppy',
        202005: 'Diting',
        202006: 'Wanted Poster',
        202007: 'Chef Pom-Pom',
        UI_Message_Contacts_Anonymous: 'None'
    };

    return CHARA_NAME[charaId] || charaId;
};

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
        const avatarCharacter = getCharaName(avatarImage.split('/').at(-1).replace('.png', ''));

        const name = details.find('h1').text();
        const [tl, eq] = details.find('div.ar').text().split('  ');
        const signature = details.find('div.signature').text() || '-';
        const totalAchievments = stats.find('div.achievements span').text();
        const simulatedUniverse = stats.find('div.su span').text();
        const memoryOfChaos = stats.children().length > 2 ? stats.find('div.moc span').text() : '0';

        const characterList = content
            .find('div.CharacterList')
            .children()
            .map(function () {
                const charaId = $(this).find('div.avatar figure').attr('style')?.split('/').at(-1).replace('.png)', '');
                const level = $(this).find('div.avatar span').text();
                return { name: getCharaName(charaId), level };
            })
            .toArray()
            .filter(character => !!character.name);

        return {
            success: true,
            trailblazer: {
                name,
                uid: url.split('/').at(-2),
                tl: tl.split(' ').at(-1),
                eq: eq.split(' ').at(-1),
                signature,
                avatar: {
                    image: `https://enka.network/${avatarImage}`,
                    character: avatarCharacter
                },
                totalAchievments,
                simulatedUniverse: simulatedUniverse ? simulatedUniverse : '0',
                memoryOfChaos,
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
