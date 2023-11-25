const { Permissions } = require('discord.js');

module.exports = {
    data: {
    name: 'ban',
    description: 'Belirtilen üyeyi sunucudan yasaklar.',
    },
    usage: '!ban <kullanıcı> [neden]',
    execute(message, args) {
        // Komutun kullanılabilmesi için gerekli izin kontrolü
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        // Belirtilen kullanıcıyı al
        const user = message.mentions.members.first();

        // Kullanıcı belirtilmemişse hata mesajı gönder
        if (!user) {
            return message.reply('Lütfen yasaklanacak bir kullanıcı belirtin.');
        }

        // Kullanıcının yasaklanma nedenini al
        const reason = args.slice(1).join(' ') || 'Belirtilmedi';

        // Botun yeterli izne sahip olup olmadığını kontrol et
        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return message.reply('Yasaklama işlemi için gerekli izinlerim yok.');
        }

        // Kullanıcıyı yasakla
        user.ban({ reason: reason })
            .then(() => {
                message.reply(`${user.user.tag} başarıyla sunucudan yasaklandı.`);
            })
            .catch((error) => {
                console.error(error);
                message.reply('Yasaklama işlemi sırasında bir hata oluştu.');
            });
    },
};