const {
    ActivityType,
    Events,
    EmbedBuilder
} = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await client.user.setPresence({
            activities: [{
                name: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users`,
                type: ActivityType.Watching
            }],
            status: "dnd"
        });

        console.log(chalk.white(`[${chalk.blueBright("CLIENT")}]${chalk.white(" - ")}Connected to ${client.user.username}, started in ${client.guilds.cache.size} guild(s)`))
        console.log(" ")

        // GitHub events for each guild's stored information
        setInterval(async () => {
            const documents = await githubSchema.find();

            for (const doc of documents) {
                const options = {
                    hostname: 'api.github.com',
                    path: `/users/${doc.username}/events/public`,
                    headers: {
                        'User-Agent': 'Github Post Notification'
                    }
                };
                const data = await new Promise((resolve, reject) => {
                    const req = https.request(options, (res) => {
                        let data = '';
                        res.on('data', (chunk) => {
                            data += chunk;
                        });
                        res.on('end', () => {
                            resolve(data);
                        });
                    });

                    req.on('error', (error) => {
                        reject(error);
                    });

                    req.end();
                });

                console.log(data)

                const events = JSON.parse(data);
                const openRepo = events.filter(event => event.type === "CreateEvent");
                const latestRepo = openRepo[0];

                if (latestRepo) {
                    const eventDate = new Date(latestRepo.created_at);
                    const guildId = doc.guild;

                    // Check if the event is new
                    const latestProcessedEvent = await githubSchema.findOne({
                        guild: guildId
                    });
                    if (!latestProcessedEvent || eventDate > latestProcessedEvent.lastProcessedEvent) {
                        const repo = repoNameFromURL(latestRepo.repo.url);

                        const embed = new EmbedBuilder()
                            .setColor(0xff6464)
                            .setTitle("New Github Post")
                            .setThumbnail(latestRepo.actor.avatar_url)
                            .setDescription(`**${doc.username}** posted: [\`${repo}\`](https://github.com/${doc.username}/${repo})`)
                            .setFooter({
                                text: client.user.username,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setTimestamp()

                        const channel = client.channels.cache.get(doc.channel);
                        await channel.send({
                            embeds: [embed]
                        });

                        // Update the timestamp of the latest event processed for this guild in the database
                        await githubSchema.updateOne({
                            guild: guildId
                        }, {
                            $set: {
                                lastProcessedEvent: eventDate
                            }
                        }, {
                            upsert: true
                        });
                    }
                }
            }
        }, 15000);
    }
}