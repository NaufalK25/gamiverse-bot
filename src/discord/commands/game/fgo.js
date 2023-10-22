const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addEmptyField, addField, addTitleOnlyField, createErrorEmbed, sendEmbedWithPagination } = require('../../utils/embed');
const fgoScrap = require('../../../scrap/fgo');

const FGO_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1697880408/gamiverse/fgo/fgo.png';
const SERVER = [
    { name: 'JP', value: 'jp' },
    { name: 'NA', value: 'na' }
];

const createServantEmbedField = (title, servant) => {
    const servantFields = [];
    const classPositionStickers = {
        All: ':snowflake:',
        Saber: ':crossed_swords:',
        Archer: ':bow_and_arrow:',
        Lancer: ':closed_umbrella:',
        Rider: ':racehorse:',
        Caster: ':book:',
        Assassin: ':dagger:',
        Berserker: ':boom:',
        Extra: ':jigsaw:'
    };

    if (servant.name) {
        servantFields.push(
            addField('Class Position', servant.classPosition, {
                sticker: classPositionStickers[servant.classPosition]
            }),
            addTitleOnlyField(`${servant.name} (Lv. ${servant.lv})`),
            addField('Skill', `${servant.skill.first}/${servant.skill.second}/${servant.skill.third}`, {
                sticker: ':crossed_swords:'
            }),
            addField('NP Lv', servant.np, {
                sticker: ':arrow_double_up:'
            }),
            addEmptyField(),
            addField('HP', servant.hp, {
                sticker: ':heavy_plus_sign:'
            }),
            addField('ATK', servant.atk, {
                sticker: ':crossed_swords:'
            })
        );

        if (servant.ce.name) {
            servantFields.push(
                addEmptyField(),
                addTitleOnlyField('Craft Essence'),
                addTitleOnlyField(`${servant.ce.name} (Lv. ${servant.ce.lv})${servant.ce.mlb ? ' | MLB' : ''}`),
                addField('HP', servant.ce.hp, {
                    sticker: ':heavy_plus_sign:'
                }),
                addField('ATK', servant.ce.atk, {
                    sticker: ':crossed_swords:'
                })
            );
        }
    }

    let fields = [addTitleOnlyField(title)];
    if (servantFields) {
        fields = [...fields, ...servantFields];
    }

    return fields;
};

const createFGOEmbed = (master, { title = '', data = {}, page = {} } = {}) => {
    let footerText = 'FGO';
    const embed = new EmbedBuilder().setColor('#4A65BE').setTitle(`${master.server} | ${master.name} (Lv. ${master.lv}) | ${master.userId}`).setDescription(master.tagline).setThumbnail(FGO_THUMBNAIL);

    if (data && data.name) {
        const fields = createServantEmbedField(title, data);
        footerText += ` | Page ${page.current} of ${page.total}`;
        embed.setURL(`https://rayshift.io/${master.server.toLowerCase()}/${master.userId}`).addFields(...fields);
    }

    embed.setFooter({ text: footerText });
    return embed;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fgo')
        .setDescription('Get naster stats from Fate/Grand Order')
        .addStringOption(option =>
            option
                .setName('server')
                .setDescription('The server that the master is playing on')
                .setChoices(...SERVER)
                .setRequired(true)
        )
        .addIntegerOption(option => option.setName('userid').setDescription('The user id of the master').setMinValue(100000000).setMaxValue(999999999).setRequired(true)),
    async execute(interaction) {
        try {
            const argServer = interaction.options.getString('server');
            const argUserId = interaction.options.getInteger('userid');
            const response = await fgoScrap(`https://rayshift.io/${argServer}/${argUserId}`);

            const master = response.master;
            const embeds = [];
            let idx = 1;
            let totalPage = Object.keys(master.decks).reduce((acc, cur) => {
                return acc + master.decks[cur].filter(servant => servant.name).length;
            }, 0);

            if (!response.success) {
                const embed = createErrorEmbed(
                    FGO_THUMBNAIL,
                    `Sorry, we couldn't find a \`${argServer.toUpperCase()}\` master with user id \`${argUserId}\`. Please check that you have entered the correct server and user id and try again`,
                    'FGO'
                );

                await interaction.reply({ embeds: [embed] });
            }

            for (const deck in master.decks) {
                for (const servant of master.decks[deck]) {
                    if (servant.name) {
                        embeds.push(createFGOEmbed(master, { title: deck, data: servant, page: { current: idx, total: totalPage } }));
                        idx++;
                    }
                }
            }

            await interaction.deferReply();
            return await sendEmbedWithPagination(interaction, embeds);
        } catch (err) {
            console.log(err);
            const embed = createErrorEmbed(
                FGO_THUMBNAIL,
                ['This error can be caused by:', '1. Internal server error', '2. Server is under maintenance', 'Please contact the developer if the error persists.'].join('\n'),
                'FGO'
            );

            await interaction.reply({ embeds: [embed] });
        }
    }
};
