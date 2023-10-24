require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addEmptyField, addField, createErrorEmbed } = require('../../utils/embed');
const crScrap = require('../../../scrap/cr');

const CR_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1676111869/gamiverse/cr/cr_nltoty.png';
const ARENA_IMAGES = {
    Tutorial: {
        name: 'Training Camp',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112645/gamiverse/cr/arena/Training_Camp_xr4sqf.png'
    },
    'Arena 1': {
        name: 'Goblin Stadium',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112645/gamiverse/cr/arena/Goblin_Stadium_d1ilq3.png'
    },
    'Arena 2': {
        name: 'Bone Pit',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112645/gamiverse/cr/arena/Bone_Pit_vzbpyq.png'
    },
    'Arena 3': {
        name: 'Barbarian Bowl',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112645/gamiverse/cr/arena/Barbarian_Bowl_ddsbpw.png'
    },
    'Arena 4': {
        name: 'Spell Valley',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112645/gamiverse/cr/arena/Spell_Valley_riaxzn.png'
    },
    'Arena 5': {
        name: "Builder's Workshop",
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112645/gamiverse/cr/arena/Builder_27s_Workshop_nwsbyk.png'
    },
    'Arena 6': {
        name: "P.E.K.K.A's Playhouse",
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112834/gamiverse/cr/arena/P.E.K.K.A._27s_Playhouse_u8wyg1.png'
    },
    'Arena 7': {
        name: 'Royal Arena',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112834/gamiverse/cr/arena/Royal_Arena_vfpjsq.png'
    },
    'Arena 8': {
        name: 'Frozen Peak',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112834/gamiverse/cr/arena/Frozen_Peak_jpnrkz.png'
    },
    'Arena 9': {
        name: 'Jungle Arena',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112834/gamiverse/cr/arena/Jungle_Arena_yzue7g.png'
    },
    'Arena 10': {
        name: 'Hog Mountain',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676112834/gamiverse/cr/arena/Hog_Mountain_cdygsl.png'
    },
    'Arena 11': {
        name: 'Electro Valley',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676113018/gamiverse/cr/arena/Electro_Valley_o9lzdj.png'
    },
    'Arena 12': {
        name: 'Spooky Town',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676113018/gamiverse/cr/arena/Spooky_Town_vdrtkx.png'
    },
    'Arena 13': {
        name: "Rascal's Hideout",
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676113018/gamiverse/cr/arena/Rascal27s_Hideout_toysx4.png'
    },
    'Arena 14': {
        name: 'Serenity Peak',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676113018/gamiverse/cr/arena/Serenity_Peak_qtp3ep.png'
    },
    'Arena 15': {
        name: "Miner's Mine",
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676113018/gamiverse/cr/arena/Miner27s_Mine_wqvlb4.png'
    },
    'Arena 16': {
        name: "Executioner's Kitchen",
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676113180/gamiverse/cr/arena/Executioner27s_Kitchen_eqrbix.png'
    },
    'Arena 17': {
        name: 'Royal Crypt',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676113180/gamiverse/cr/arena/Royal_Crypt_sx6uj0.png'
    },
    'Arena 18': {
        name: 'Silent Sanctuary',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676113180/gamiverse/cr/arena/Silent_Sanctuary_tiomzl.png'
    },
    'Arena 19': {
        name: 'Dragon Spa',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676113180/gamiverse/cr/arena/Dragon_Spa_l4hca5.png'
    },
    'Arena 20': {
        name: 'Boot Camp',
        image: ''
    },
    'Arena 21': {
        name: 'Clash Fest',
        image: ''
    },
    'Arena 22': {
        name: 'PANCAKES!',
        image: ''
    },
    'Arena 23': {
        name: 'Legendary Arena',
        image: 'https://res.cloudinary.com/dko04cygp/image/upload/v1676113180/gamiverse/cr/arena/Legendary_Arena_oenbzh.png'
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cr')
        .setDescription('Get player stats from Clash Royale')
        .addStringOption(option => option.setName('tag').setDescription('The player tag (without #)').setRequired(true)),
    async execute(interaction) {
        try {
            const argTag = interaction.options.getString('tag').trim().toUpperCase();
            const response = await crScrap(`https://royaleapi.com/player/${argTag}/`);

            if (!response.success) {
                let embed = new EmbedBuilder();
                const errorType = response.error;

                if (errorType.includes('503')) {
                    embed = createErrorEmbed(CR_THUMBNAIL, 'Clash Royale is under maintenance', 'Clash Royale');
                }

                if (errorType.includes('404')) {
                    embed = createErrorEmbed(
                        CR_THUMBNAIL,
                        `Sorry, we couldn't find a player with the tag \`#${argTag}\`. Please check that you have entered the correct tag and try again`,
                        'Clash Royale'
                    );
                }

                return await interaction.reply({ embeds: [embed] });
            }

            const player = response.player;
            const embed = new EmbedBuilder()
                .setColor('#54E2D6')
                .setTitle(`${player.expLevel} | ${player.name} | ${player.tag}`)
                .setThumbnail(CR_THUMBNAIL)
                .addFields(
                    addField('Arena', `${player.arena ? `${player.arena.level} ${player.arena.name ? player.arena.name : ARENA_IMAGES[player.arena.level].name}` : 'Arena 0 Training Camp'}`, {
                        sticker: ':classical_building:'
                    }),
                    addField('Clan', player.clan && player.clan.name !== 'Not in Clan' ? `${player.clan.name} ${player.clan.tag}` : 'None', {
                        sticker: ':shield:'
                    }),
                    addEmptyField(),
                    addField('Cards Found', player.cardsFound, {
                        sticker: ':black_joker:'
                    }),
                    addField('Total Donation', player.totalDonations, {
                        sticker: ':gift:'
                    }),
                    addField('Joined Since', `${player.accountAge} ago`, {
                        sticker: ':black_joker:'
                    }),
                    addEmptyField(),
                    addField('Trophies', player.trophies, {
                        sticker: ':trophy:'
                    }),
                    addField('Best Trophies', player.bestTrophies, {
                        sticker: ':trophy:'
                    }),
                    addField('Path of Legends Trophies', player.pathOfLegendsTrophies, {
                        sticker: ':medal:'
                    }),
                    addEmptyField(),
                    addField('Battle Count', player.ladderChallenge.totalGamesPlayed, {
                        sticker: ':crossed_swords:'
                    }),
                    addField('1V1 Draws', player.ladderChallenge.oneVOneDraws, {
                        sticker: ':crossed_swords:'
                    }),
                    addField('Wins', player.ladderChallenge.wins.count, {
                        sticker: ':crossed_swords:'
                    }),
                    addField('Losses', player.ladderChallenge.loses.count, {
                        sticker: ':x:'
                    }),
                    addField('Three Crown Wins', player.ladderChallenge.threeCrownWins, {
                        sticker: ':crown:'
                    })
                )
                .setImage(player.arena.image)
                .setFooter({ text: 'Clash Royale' });

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
            const embed = createErrorEmbed(
                CR_THUMBNAIL,
                ['This error can be caused by:', '1. Internal server error', '2. Server is under maintenance', 'Please contact the developer if the error persists.'].join('\n'),
                'Clash Royale'
            );

            await interaction.reply({ embeds: [embed] });
        }
    }
};
