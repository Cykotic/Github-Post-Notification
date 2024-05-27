const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");
const githubSchema = require("../../modals/testschema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reset-info")
        .setDescription("[ADMIN] Reset the GitHub notification info (Github-Notifications)"),
    async execute(interaction) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.reply({
                    content: `> **You are not allowed to use this!**`,
                    ephemeral: true
                });
            }

            const existingDocument = await githubSchema.findOne({
                guild: interaction.guild.id
            });

            if (existingDocument) {
                await githubSchema.deleteOne({
                    guild: guildId
                });
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Deleted Data")
                        .setDescription(`The GitHub notification info for \`${interaction.guild.name}\` has been reset successfully.`)
                        .setThumbnail(interaction.guild.iconURL())
                        .setFooter({
                            text: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                    ],
                    ephemeral: true
                })
            } else {
                return await interaction.reply({
                    content: "> **No data found to delete!**",
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error("Error:", error);
            await interaction.reply("An error occurred while processing your request.");
        }
    },
};