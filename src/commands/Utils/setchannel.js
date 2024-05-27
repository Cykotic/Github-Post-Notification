const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");
const githubSchema = require("../../modals/testschema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-notification")
        .setDescription("[ADMIN] Set a GitHub notification")
        .addChannelOption(options =>
            options.setName("channel")
            .setDescription(`the channel to set`)
            .setRequired(true))
        .addStringOption(options =>
            options.setName("username")
            .setDescription(`the username to connect`)
            .setRequired(true)),
    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({
                    content: `> **You are not allowed to use this!**`,
                    ephemeral: true
                });
            }

            const channel = interaction.options.getChannel("channel");
            const username = interaction.options.getString("username");

            let exist = await githubSchema.findOne({
                guild: interaction.guild.id
            });

            if (exist) {
                await githubSchema.updateOne({
                    guild: interaction.guild.id
                }, {
                    $set: {
                        username: username,
                        channel: channel.id
                    }
                });
            } else {
                await githubSchema.create({
                    guild: interaction.guild.id,
                    username: username,
                    channel: channel.id
                });
            }

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Notification Set")
                    .setDescription(`Set the username to \`${username}\` and the channel to ${channel} successfully.`)
                    .setThumbnail(interaction.guild.iconURL())
                    .setFooter({
                        text: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTimestamp()
                ],
                ephemeral: true
            })
        } catch (error) {
            console.error("Error:", error);
            await interaction.reply("An error occurred while processing your request.");
        }
    },
};