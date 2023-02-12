require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField } = require('../helpers');

const COC_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1676100894/gamiverse/coc/coc_jhd8vb.png';
const TOWN_HALL_IMAGES = {
    1: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676036102/gamiverse/coc/town-hall/Town_Hall1_bmzjqn.png',
    2: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037146/gamiverse/coc/town-hall/Town_Hall2_hwokdx.png',
    3: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037146/gamiverse/coc/town-hall/Town_Hall3_zz4n2b.png',
    4: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037146/gamiverse/coc/town-hall/Town_Hall4_q81f6r.png',
    5: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037146/gamiverse/coc/town-hall/Town_Hall5_nwyjkj.png',
    6: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037146/gamiverse/coc/town-hall/Town_Hall6_gjdjl0.png',
    7: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037146/gamiverse/coc/town-hall/Town_Hall7_quvhgy.png',
    8: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037147/gamiverse/coc/town-hall/Town_Hall8_jovqan.png',
    9: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037147/gamiverse/coc/town-hall/Town_Hall9_ijupao.png',
    10: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037147/gamiverse/coc/town-hall/Town_Hall10_zhdhrb.png',
    11: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037147/gamiverse/coc/town-hall/Town_Hall11_wq1kb5.png',
    12: {
        0: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037861/gamiverse/coc/town-hall/Town_Hall12-1_j3zo40.png',
        1: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037861/gamiverse/coc/town-hall/Giga_Tesla1_pzswsc.png',
        2: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037861/gamiverse/coc/town-hall/Giga_Tesla2_qnlnj5.png',
        3: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037861/gamiverse/coc/town-hall/Giga_Tesla3_coywds.png',
        4: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037861/gamiverse/coc/town-hall/Giga_Tesla4_ulomp6.png',
        5: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676037861/gamiverse/coc/town-hall/Giga_Tesla5_mdmeid.png'
    },
    13: {
        0: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038252/gamiverse/coc/town-hall/Town_Hall13-1_ry02np.png',
        1: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038252/gamiverse/coc/town-hall/Giga_Inferno1_xaepp4.png',
        2: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038252/gamiverse/coc/town-hall/Giga_Inferno2_v2f6nj.png',
        3: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038252/gamiverse/coc/town-hall/Giga_Inferno3_oalf4a.png',
        4: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038252/gamiverse/coc/town-hall/Giga_Inferno4_szu9on.png',
        5: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038252/gamiverse/coc/town-hall/Giga_Inferno5_n3d1dx.png'
    },
    14: {
        0: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038518/gamiverse/coc/town-hall/Town_Hall14-1_bdmjo0.png',
        1: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038518/gamiverse/coc/town-hall/Giga_Inferno14-1_lvajkx.png',
        2: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038518/gamiverse/coc/town-hall/Giga_Inferno14-2_nbj3mq.png',
        3: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038518/gamiverse/coc/town-hall/Giga_Inferno14-3_frfo3p.png',
        4: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038518/gamiverse/coc/town-hall/Giga_Inferno14-4_fekiwg.png',
        5: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038518/gamiverse/coc/town-hall/Giga_Inferno14-5_yenr7z.png'
    },
    15: {
        0: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038721/gamiverse/coc/town-hall/Town_Hall15-1_bsvxif.png',
        1: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038721/gamiverse/coc/town-hall/Giga_Inferno15-1_ltqamr.png',
        2: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038721/gamiverse/coc/town-hall/Giga_Inferno15-2_krf3va.png',
        3: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038721/gamiverse/coc/town-hall/Giga_Inferno15-3_unfdsk.png',
        4: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038721/gamiverse/coc/town-hall/Giga_Inferno15-4_l1jvjv.png',
        5: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676038721/gamiverse/coc/town-hall/Giga_Inferno15-5_deadwh.png'
    }
};

const getTHImage = (thLevel, thWeaponLevel) => {
    return thLevel < 12 ? TOWN_HALL_IMAGES[thLevel] : !thWeaponLevel || thWeaponLevel === 0 ? TOWN_HALL_IMAGES[thLevel][0] : TOWN_HALL_IMAGES[thLevel][thWeaponLevel];
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coc')
        .setDescription('Get the player profile from Clash of Clans')
        .addStringOption(option => option.setName('tag').setDescription('The player tag (without #)').setRequired(true)),
    async execute(interaction) {
        try {
            const argTag = interaction.options.getString('tag').trim().toUpperCase();
            const res = await fetch(`https://api.clashofclans.com/v1/players/%23${argTag}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.COC_TOKEN}`
                }
            });
            const player = await res.json();

            if (player.reason === 'notFound') {
                const embed = new EmbedBuilder()
                    .setColor('#FFCCCC')
                    .setTitle('Error')
                    .setThumbnail(COC_THUMBNAIL)
                    .setDescription(`Player with tag \`#${argTag}\` doesn't exist`)
                    .setFooter({ text: 'Clash of Clans' });

                return interaction.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor('#FFF85C')
                .setTitle(`${player.expLevel} | ${player.name} | ${player.tag}`)
                .setThumbnail(COC_THUMBNAIL)
                .addFields(
                    addField('Town Hall', player.townHallLevel),
                    addField('Clan', player.clan ? `${player.clan.name}\n${player.clan.tag}` : 'None'),
                    addField('\u200B', '\u200B', false, { highlight: false }),
                    addField('League', player.league ? player.league.name : 'None'),
                    addField('Trophies', player.trophies),
                    addField('War Stars', player.warStars)
                )
                .setImage(getTHImage(player.townHallLevel, player.townHallWeaponLevel ? player.townHallWeaponLevel : 0))
                .setFooter({ text: 'Clash of Clans' });

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            const embed = new EmbedBuilder()
                .setColor('#FFCCCC')
                .setTitle('Error')
                .setThumbnail(COC_THUMBNAIL)
                .setDescription(
                    [
                        'This error can be caused by:',
                        '1. API token expired',
                        '2. Invalid API token',
                        '3. Rate limit exceeded',
                        '4. Internal server error',
                        '5. Server is under maintenance',
                        'Please contact the developer if the error persists.'
                    ].join('\n')
                )
                .setFooter({ text: 'Clash of Clans' });

            interaction.reply({ embeds: [embed] });
        }
    }
};
