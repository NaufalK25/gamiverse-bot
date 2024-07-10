const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addEmptyField, addField, addTitleOnlyField, createErrorEmbed } = require('../../utils/embed');
const hsrScrap = require('../../../scrap/hsr');

const HSR_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1698387699/gamiverse/hsr/hsr.png';
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
        .setName('hsr')
        .setDescription('Get trailblazer stats from Honkai Star Rail')
        .addStringOption(option => option.setName('uid').setDescription('The trailblazer UID (9 characters long)').setMinLength(9).setMaxLength(9).setRequired(true)),
    async execute(interaction) {
        try {
            const argUID = interaction.options.getString('uid');
            const response = await hsrScrap(`https://enka.network/hsr/${argUID}/`);

            if (!response.success) {
                let embed = new EmbedBuilder();
                const errorType = response.error;

                if (errorType.includes('400')) {
                    embed = createErrorEmbed(
                        HSR_THUMBNAIL,
                        `You have entered the invalid UID\`${argUID}\`, the valid UID must consist of **9** digit number that start with **1**, **2**, **5**, **6**, **7**, **8**, or **9**. Please check that you have entered the correct UID and try again`,
                        'Honkai Star Rail'
                    );
                }

                if (errorType.includes('404')) {
                    embed = createErrorEmbed(
                        HSR_THUMBNAIL,
                        `Sorry, we couldn't find a trailblazer with the UID\`${argUID.toUpperCase()}\`. Please check that you have entered the correct UID and try again`,
                        'Honkai Star Rail'
                    );
                }

                return await interaction.reply({ embeds: [embed] });
            }

            const trailblazer = response.trailblazer;

            const serverCode = +trailblazer.uid.split('')[0];
            const fields = [
                addField('Server', SERVER[serverCode], {
                    sticker: `:earth_${serverCode === 6 ? 'americas' : serverCode === 7 ? 'africa' : 'asia'}:`
                }),
                addField('Avatar', trailblazer.avatar.character, {
                    sticker: ':bust_in_silhouette:'
                }),
                addField('Equilibrium Level', trailblazer.eq, {
                    sticker: ':globe_with_meridians:'
                }),
                addField('Total Achievement', trailblazer.totalAchievments || 0, {
                    sticker: ':trophy:'
                }),
                addField('Simulated Universe', trailblazer.simulatedUniverse, {
                    sticker: ':milky_way:'
                }),
                addField('Memory of Chaos', trailblazer.memoryOfChaos, {
                    sticker: ':thought_balloon:'
                })
            ];

            if (trailblazer.characterList.length > 0) {
                fields.push(
                    addEmptyField(),
                    addTitleOnlyField('Character List'),
                    ...trailblazer.characterList.map(character =>
                        addField(character.name, `Lv. ${character.level}`, {
                            sticker: ':arrow_double_up:'
                        })
                    )
                );
            }

            const embed = new EmbedBuilder()
                .setColor('#FFFDF4')
                .setTitle(`${trailblazer.uid} | ${trailblazer.name} | TL ${trailblazer.tl}`)
                .setDescription(`*${trailblazer.signature}*`)
                .setURL(`https://enka.network/hsr/${trailblazer.uid}/`)
                .addFields(...fields)
                .setThumbnail(HSR_THUMBNAIL)
                .setImage(trailblazer.avatar.image)
                .setFooter({ text: 'Honkai Star Rail' });

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            const embed = createErrorEmbed(
                HSR_THUMBNAIL,
                ['This error can be caused by:', '1. Internal server error', '2. Server is under maintenance', 'Please contact the developer if the error persists.'].join('\n'),
                'Honkai Star Rail'
            );

            await interaction.reply({ embeds: [embed] });
        }
    }
};
