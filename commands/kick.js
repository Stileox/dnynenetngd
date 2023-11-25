const { Permissions } = require('discord.js');

module.exports = {
    data: {
    name: 'kick',
    description: 'Belirtilen üyeyi sunucudan atar.',
    },
    usage: '!kick <kullanıcı> [neden]',
    execute(message, args) {
        // Komutun kullanılabilmesi için gerekli izin kontrolü
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        // Belirtilen kullanıcıyı al
        const user = message.mentions.members.first();

        // Kullanıcı belirtilmemişse hata mesajı gönder
        if (!user) {
            return message.reply('Lütfen atılacak bir kullanıcı belirtin.');
        }

        // Kullanıcının atılma nedenini al
        const reason = args.slice(1).join(' ') || 'Belirtilmedi';

        // Botun yeterli izne sahip olup olmadığını kontrol et
        if (!message.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return message.reply('Atma işlemi için gerekli izinlerim yok.');
        }

        // Kullanıcıyı at
        user.kick({ reason: reason })
            .then(() => {
                message.reply(`${user.user.tag} başarıyla sunucudan atıldı.`);
            })
            .catch((error) => {
                console.error(error);
                message.reply('Atma işlemi sırasında bir hata oluştu.');
            });
    },
};