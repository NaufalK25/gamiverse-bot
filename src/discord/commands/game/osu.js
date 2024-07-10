const { EmbedBuilder, SlashCommandBuilder, time, TimestampStyles } = require('discord.js');
const { addEmptyField, addField, createErrorEmbed, addTitleOnlyField, addEmptyInlineField } = require('../../utils/embed');
const { nodeFetch } = require('../../../utils/general');

const OSU_THUMBNAIL = 'https://res.cloudinary.com/dko04cygp/image/upload/v1720585320/gamiverse/osu/rxgid1i399jc4quyzvzy.png';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('osu')
        .setDescription('Get player stats from osu!')
        .addStringOption(option => option.setName('id').setDescription('The player id').setRequired(true)),
    async execute(interaction) {
        try {
            const argId = interaction.options.getString('id').trim();
            const reqInit = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.OSU_ACCESS_TOKEN}`
                }
            };
            const player = await nodeFetch(`https://osu.ppy.sh/api/v2/users/${argId}`, reqInit);

            if (player.error === null) {
                const embed = createErrorEmbed(OSU_THUMBNAIL, `Sorry, we couldn't find a player with the id \`${argId}\`. Please check that you have entered the correct id and try again`, 'osu!');
                return await interaction.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor('#F663A5')
                .setTitle(`Lv ${player.statistics.level.current} | ${player.username} (${player.id}) ${':heart_decoration:'.repeat(player.support_level)}`)
                .setURL(`https://osu.ppy.sh/users/${player.id}`)
                .setThumbnail(OSU_THUMBNAIL)
                .addFields(
                    addField('Country', player.country.name, {
                        sticker: `:flag_${player.country.code.toLowerCase()}:`
                    }),
                    player.statistics.global_rank !== null ?
                    addField('Global Rank', player.statistics.global_rank, {
                        sticker: `:trophy:`
                    }) : addEmptyInlineField(),
                    addEmptyField(),
                    addField('Play Count', player.statistics.play_count, {
                        sticker: ':medal:'
                    }),
                    addField('Accuracy', `${player.statistics.hit_accuracy.toFixed(2)}%`, {
                        sticker: ':dart:'
                    }),
                    addField('Max Combo', `${player.statistics.maximum_combo}x`, {
                        sticker: ':chains:'
                    }),
                    addEmptyField(),
                    addTitleOnlyField('Grade'),
                    addField('SSH', player.statistics.grade_counts.ssh, {
                        sticker: ''
                    }),
                    addField('SS', player.statistics.grade_counts.ss, {
                        sticker: ''
                    }),
                    addField('SH', player.statistics.grade_counts.sh, {
                        sticker: ''
                    }),
                    addField('S', player.statistics.grade_counts.s, {
                        sticker: ''
                    }),
                    addField('A', player.statistics.grade_counts.a, {
                        sticker: ''
                    }),
                    addEmptyField(),
                    addField('Join On', time(Math.round(new Date(player.join_date).getTime() / 1000), TimestampStyles.RelativeTime), {
                        highlight: false,
                        sticker: ':calendar:'
                    }),
                    player.last_visit !== null
                        ? addField('Last Visit', time(Math.round(new Date(player.last_visit).getTime() / 1000), TimestampStyles.RelativeTime), {
                              highlight: false,
                              sticker: ':calendar:'
                          })
                        : addEmptyInlineField()
                )
                .setImage(player.avatar_url)
                .setFooter({ text: 'osu!' });

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            const embed = createErrorEmbed(
                OSU_THUMBNAIL,
                ['This error can be caused by:', '1. Rate limit exceeded', '2. Internal server error', '3. Server is under maintenance', 'Please contact the developer if the error persists.'].join(
                    '\n'
                ),
                'osu!'
            );

            await interaction.reply({ embeds: [embed] });
        }
    }
};
