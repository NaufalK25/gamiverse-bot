const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addEmptyField, addField, addTitleOnlyField, createErrorEmbed } = require('../../utils/embed');
const genshinScrap = require('../../../scrap/genshin');

const GENSHIN_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1698227465/gamiverse/genshin/genshin.png';
const SERVER = {
    1: 'Celestia - Mainland China',
    2: 'Celestia - Mainland China',
    5: 'Irminsul - Mainland China (Bilibili or Xiaomi channels)',
    6: 'North and South America',
    7: 'Europe',
    8: 'Asia',
    9: 'TW, HK, MO'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('genshin')
        .setDescription('Get traveler stats from Genshin Impact')
        .addStringOption(option => option.setName('uid').setDescription('The traveler UID (9 characters long)').setMinLength(9).setMaxLength(9).setRequired(true)),
    async execute(interaction) {
        try {
            const argUID = interaction.options.getString('uid');
            const response = await genshinScrap(`https://enka.network/u/${argUID}/`);

            if (!response.success) {
                let embed = new EmbedBuilder();
                const errorType = response.error;

                if (errorType.includes('400')) {
                    embed = createErrorEmbed(
                        GENSHIN_THUMBNAIL,
                        `You have entered the invalid UID\`${argUID}\`, the valid UID must consist of **9** digit number that start with **1**, **2**, **5**, **6**, **7**, **8**, or **9**. Please check that you have entered the correct UID and try again`,
                        'Genshin Impact'
                    );
                }

                if (errorType.includes('404')) {
                    embed = createErrorEmbed(
                        GENSHIN_THUMBNAIL,
                        `Sorry, we couldn't find a traveler with the UID\`${argUID.toUpperCase()}\`. Please check that you have entered the correct UID and try again`,
                        'Genshin Impact'
                    );
                }

                return await interaction.reply({ embeds: [embed] });
            }

            const traveler = response.traveler;
            const serverCode = +traveler.uid.split('')[0];
            const fields = [
                addField('Server', SERVER[serverCode], {
                    sticker: `:earth_${serverCode === 6 ? 'americas' : serverCode === 7 ? 'africa' : 'asia'}:`
                }),
                addField('Avatar', traveler.avatar.character, {
                    sticker: ':bust_in_silhouette:'
                }),
                addField('World Level', traveler.wl, {
                    sticker: ':globe_with_meridians:'
                }),
                addField('Total Achievement', traveler.totalAchievments || 0, {
                    sticker: ':trophy:'
                }),
                addField('Spiral Abyss', traveler.spiralAbyss || '?-?', {
                    sticker: ':crossed_swords:'
                })
            ];

            if (traveler.characterList.length > 0) {
                fields.push(
                    addEmptyField(),
                    addTitleOnlyField('Character List'),
                    ...traveler.characterList.map(character =>
                        addField(character.name, `Lv. ${character.level}`, {
                            sticker: ':arrow_double_up:'
                        })
                    )
                );
            }

            const embed = new EmbedBuilder()
                .setColor('#FFFDF4')
                .setTitle(`${traveler.uid} | ${traveler.name} | AR ${traveler.ar}`)
                .setDescription(`*${traveler.signature}*`)
                .setURL(`https://enka.network/u/${traveler.uid}/`)
                .addFields(...fields)
                .setThumbnail(GENSHIN_THUMBNAIL)
                .setImage(traveler.avatar.image)
                .setFooter({ text: 'Genshin Impact' });

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            const embed = createErrorEmbed(
                GENSHIN_THUMBNAIL,
                ['This error can be caused by:', '1. Internal server error', '2. Server is under maintenance', 'Please contact the developer if the error persists.'].join('\n'),
                'Genshin Impact'
            );

            await interaction.reply({ embeds: [embed] });
        }
    }
};
