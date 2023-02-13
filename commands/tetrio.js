require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField, addEmptyField, createErrorEmbed, humanizeDate, nodeFetch } = require('../helpers');

const TETRIO_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1676279934/gamiverse/tetrio/tetrio_h3zdkg.png';
const RANK_IMAGES = {
    x: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/x_u8iy5x.png',
    u: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/u_jshtu9.png',
    ss: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/ss_bfersn.png',
    's+': 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/s_tlmjpd.png',
    s: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/s_dhnu81.png',
    's-': 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/s-_ges7lq.png',
    'a+': 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283762/gamiverse/tetrio/rank/a_kb9a1k.png',
    a: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283762/gamiverse/tetrio/rank/a_qg1crs.png',
    'a-': 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283762/gamiverse/tetrio/rank/a-_wymski.png',
    'b+': 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283762/gamiverse/tetrio/rank/b_re76hz.png',
    b: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283762/gamiverse/tetrio/rank/b_xlhda0.png',
    'b-': 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283762/gamiverse/tetrio/rank/b-_f0oc2i.png',
    'c+': 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/c_nwnmpx.png',
    c: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/c_oe1gkf.png',
    'c-': 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/c-_kbxivs.png',
    'd+': 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/d_c7lfp5.png',
    d: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676283763/gamiverse/tetrio/rank/d_tz5lty.png'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tetrio')
        .setDescription('Get the player profile from TETR.io')
        .addStringOption(option => option.setName('username').setDescription('The username of the player').setRequired(true)),
    async execute(interaction) {
        try {
            const argUsername = interaction.options.getString('username').trim().toLowerCase();
            const player = await nodeFetch(`https://ch.tetr.io/api/users/${argUsername}`);

            if (!player.success) {
                const embed = createErrorEmbed(TETRIO_THUMBNAIL, `Player with username \`${argUsername}\` doesn't exist`, 'TETR.io');
                return interaction.reply({ embeds: [embed] });
            }

            const playerStats = player.data.user;

            const embed = new EmbedBuilder()
                .setColor('#7D5FAD')
                .setTitle(playerStats.username)
                .setURL(`https://ch.tetr.io/u/${playerStats.username}`)
                .setThumbnail(TETRIO_THUMBNAIL)
                .addFields(
                    addField('Country', playerStats.country || 'None', {
                        sticker: `:flag_${playerStats.country.toLowerCase()}:`
                    }),
                    addField('Member Since', humanizeDate(new Date(playerStats.ts)), {
                        sticker: ':calendar:'
                    }),
                    addEmptyField(),
                    addField('Games Played', playerStats.league.gamesplayed, {
                        sticker: ':video_game:'
                    }),
                    addField('Games Won', playerStats.league.gameswon, {
                        sticker: ':trophy:'
                    }),
                    addEmptyField(),
                    addField('Rank', playerStats.league.rank.toUpperCase(), {
                        sticker: ':medal:'
                    }),
                    addField('Best Rank', playerStats.league.bestrank?.toUpperCase() || playerStats.league.rank.toUpperCase(), {
                        sticker: ':medal:'
                    })
                );

            if (RANK_IMAGES.hasOwnProperty(playerStats.league.rank)) {
                embed.setImage(RANK_IMAGES[playerStats.league.rank]);
            }

            embed.setFooter({ text: 'TETR.io' });

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            const embed = createErrorEmbed(
                TETRIO_THUMBNAIL,
                ['This error can be caused by:', '1. Rate limit exceeded', '2. Internal server error', '3. Server is under maintenance', 'Please contact the developer if the error persists.'].join(
                    '\n'
                ),
                'TETR.io'
            );

            interaction.reply({ embeds: [embed] });
        }
    }
};
