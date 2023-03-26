const { getStats } = require('../lib/stats')
const cx = require('canvacord')

module.exports = {
    name: 'rank',
    aliases: ['rk'],
    category: 'general',
    exp: 5,
    description: 'Gives you your rank',
    async execute(client, arg, M) {
        let pfp
        try {
            pfp = await client.profilePictureUrl(M.sender, 'image')
        } catch {
            pfp =
                'https://w0.peakpx.com/wallpaper/346/996/HD-wallpaper-love-live-sunshine-404-error-love-live-sunshine-anime-girl-anime.jpg'
        }

        const level = (await client.DB.get(`${M.sender}_LEVEL`)) || 1
        const { requiredXpToLevelUp, rank } = getStats(level)
        const username = (await client.contact.getContact(M.sender, client)).username
        const experience = (await client.exp.get(M.sender)) || 0

        const card = await new cx.Rank()
            .setAvatar(pfp)
            .setLevel(level, 'LEVEL', true)
            .setCurrentXP(experience, '#db190b')
            .setRequiredXP(requiredXpToLevelUp, '#db190b')
            .setProgressBar('#db190b')
            .setDiscriminator(M.sender.substring(3, 7), '#db190b')
            .setCustomStatusColor('#db190b')
            .setLevelColor('#db190b', '#db190b')
            .setOverlay('', '', false)
            .setUsername(username, '#db190b')
            .setBackground('COLOR', '#000000')
            .setRank(1, '', false)
            .renderEmojis(true)
            .build({ fontX: 'arial', fontY: 'arial' })

        //user.substring(3, 7)
        client.sendMessage(
            M.from,
            {
                image: card,
                caption: `*Your Exp[${experience}] and Level[${level}]*`
            },
            {
                quoted: M
            }
        )
    }
}
//M.quoted.mtype === 'imageMessage',
