const axios = require('axios');
const cheerio = require('cheerio');

const getCharaName = rawCharaName => {
    const CHARA_NAME = {
        // Traveler
        PlayerBoy: 'Aether',
        PlayerGirl: 'Lumine',

        // Mondstadt
        Ambor: 'Amber',
        AmborCostumeWic: 'Amber',
        BarbaraCostumeSummertime: 'Barbara',
        DilucCostumeFlamme: 'Diluc',
        Feiyan: 'Yanfei',
        FischlCostumeHighness: 'Fischl',
        KaeyaCostumeDancer: 'Kaeya',
        KleeCostumeWitch: 'Klee',
        LisaCostumeStudentin: 'Lisa',
        MonaCostumeWic: 'Mona',
        Noel: 'Noelle',
        Qin: 'Jean',
        QinCostumeSea: 'Jean',
        QinCostumeWic: 'Jean',
        RosariaCostumeWic: 'Rosaria',

        // Liyue
        Baizhuer: 'Baizu',
        Hutao: 'Hu Tao',
        KeqingCostumeFeather: 'Keqing',
        NingguangCostumeFloral: 'Ningguang',
        Shougun: 'Raiden Shogun',
        Yae: 'Yae Miko',
        Yunjin: 'Yun Jin',

        // Inazuma
        Ayaka: 'Kamisato Ayaka',
        AyakaCostumeFruhling: 'Kamisato Ayaka',
        Ayato: 'Kamisato Ayato',
        Heizo: 'Shikanoin Heizou',
        Itto: 'Arataki Itto',
        Kazuha: 'Kaedehara Kazuha',
        Kokomi: 'Sangonomiya Kokomi',
        Momoka: 'Kirara',
        Sara: 'Kujou Sara',
        Shinobu: 'Kuki Shinobu',
        Tohma: 'Thoma',

        // Sumeru
        Alhatham: 'Alhaitham',

        // Fontaine
        Linette: 'Lynette',
        Liney: 'Lyney'
    };

    return CHARA_NAME[rawCharaName] || rawCharaName;
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
        let avatarCharacter = getCharaName(avatarImage.split('_').at(-1).replace('.png', ''));

        const name = details.find('h1').text();
        const [ar, wl] = details.find('div.ar').text().split('  ');
        const signature = details.find('div.signature').text() || '-';
        const totalAchievments = stats.find('div.achievements span').text();
        const spiralAbyss = stats.find('div.abyss span').text();

        const characterList = content
            .find('div.CharacterList')
            .children()
            .map(function () {
                const name = $(this).find('div.avatar figure').attr('style')?.split('_').at(-1).replace('.png)', '');
                const level = $(this).find('div.avatar span').text();
                return { name: getCharaName(name), level };
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
                signature,
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
