const { Permissions } = require('discord.js');

module.exports = {
    data: {
    name: 'mute',
    description: 'Belirtilen üyeyi susturur.',
    },
    usage: '!mute <kullanıcı> [süre] [neden]',
    execute(message, args) {
        // Komutun kullanılabilmesi için gerekli izin kontrolü
        if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        // Belirtilen kullanıcıyı al
        const user = message.mentions.members.first();

        // Kullanıcı belirtilmemişse hata mesajı gönder
        if (!user) {
            return message.reply('Lütfen susturulacak bir kullanıcı belirtin.');
        }

        // Susturma süresini ve nedenini al
        const duration = args[1];
        const reason = args.slice(2).join(' ') || 'Belirtilmedi';

        // Botun yeterli izne sahip olup olmadığını kontrol et
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) {
            return message.reply('Susturma işlemi için gerekli izinlerim yok.');
        }

        // Kullanıcıyı sustur
        user.voice.setMute(true, reason)
            .then(() => {
                message.reply(`${user.user.tag} başarıyla susturuldu.`);
                
                // Eğer bir süre belirtilmişse, süre sonunda kullanıcının susturulmasını kaldır
                if (duration) {
                    setTimeout(() => {
                        user.voice.setMute(false, 'Süre doldu.');
                        message.channel.send(`${user.user.tag} susturulması kaldırıldı.`);
                    }, parseInt(duration) * 1000);
                }
            })
            .catch((error) => {
                console.error(error);
                message.reply('Susturma işlemi sırasında bir hata oluştu.');
            });
    },
};