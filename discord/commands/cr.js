require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { addField, addEmptyField, createErrorEmbed, nodeFetch } = require('../helpers');

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
            const player = await nodeFetch(`https://api.clashroyale.com/v1/players/%23${argTag}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.CR_TOKEN}`
                }
            });

            if (player.reason === 'notFound') {
                const embed = createErrorEmbed(
                    CR_THUMBNAIL,
                    `Sorry, we couldn't find a player with the tag \`${argTag}\`. Please check that you have entered the correct tag and try again`,
                    'Clash Royale'
                );
                return interaction.reply({ embeds: [embed] });
            }

            if (player.reason === 'accessDenied.invalidIp') {
                const notAllowedIP = player.message.split(' ').at(-1);
                const embed = createErrorEmbed(
                    CR_THUMBNAIL,
                    `Sorry, the server IP address is not allowed: ${notAllowedIP}. Please contact the developer to add this IP address to the list of allowed IP addresses.`,
                    'Clash Royale'
                );
                return interaction.reply({ embeds: [embed] });
            }

            if (player.reason) {
                const embed = createErrorEmbed(CR_THUMBNAIL, `${player.rason}: ${player.message}`, 'Clash Royale');
                return interaction.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor('#54E2D6')
                .setTitle(`${player.expLevel} | ${player.name} | ${player.tag}`)
                .setThumbnail(CR_THUMBNAIL)
                .addFields(
                    addField('Arena', `${player.arena ? player.arena.name : 'Arena 0'} ${ARENA_IMAGES[player.arena ? player.arena.name : 'Tutorial'].name}`, {
                        sticker: ':classical_building:'
                    }),
                    addField('Clan', player.clan ? `${player.clan.name} ${player.clan.tag}` : 'None', {
                        sticker: ':shield:'
                    }),
                    addEmptyField(),
                    addField('Total Donation', player.totalDonations, {
                        sticker: ':gift:'
                    }),
                    addField('Trophies', player.trophies, {
                        sticker: ':trophy:'
                    }),
                    addField('Best Trophies', player.bestTrophies, {
                        sticker: ':trophy:'
                    }),
                    addEmptyField(),
                    addField('Battle Count', player.battleCount, {
                        sticker: ':crossed_swords:'
                    }),
                    addField('Wins', player.wins, {
                        sticker: ':crossed_swords:'
                    }),
                    addField('Losses', player.losses, {
                        sticker: ':x:'
                    }),
                    addField('Three Crown Wins', player.threeCrownWins, {
                        sticker: ':crown:'
                    })
                )
                .setImage(ARENA_IMAGES[player.arena ? player.arena.name : 'Tutorial'].image)
                .setFooter({ text: 'Clash Royale' });

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            const embed = createErrorEmbed(
                CR_THUMBNAIL,
                [
                    'This error can be caused by:',
                    '1. API token expired',
                    '2. Invalid API token',
                    '3. Rate limit exceeded',
                    '4. Internal server error',
                    '5. Server is under maintenance',
                    'Please contact the developer if the error persists.'
                ].join('\n'),
                'Clash Royale'
            );

            interaction.reply({ embeds: [embed] });
        }
    }
};
