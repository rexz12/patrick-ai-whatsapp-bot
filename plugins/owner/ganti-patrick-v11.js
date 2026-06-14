import fs from 'fs'
import path from 'path'
import te from '../../src/lib/patrick-error.js'
import { updateAssetUrl } from '../../src/lib/patrick-uploader.js'
const pluginConfig = {
    name: 'ganti-patrick-v11.jpg',
    alias: ['gantipatrickv11', 'setpatrickv11'],
    category: 'owner',
    description: 'Ganti gambar patrick-v11.jpg',
    usage: '.ganti-patrick-v11.jpg (reply/kirim gambar)',
    example: '.ganti-patrick-v11.jpg',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isImage = m.isImage || (m.quoted && m.quoted.type === 'imageMessage')
    if (!isImage) return m.reply(`🖼️ *ɢᴀɴᴛɪ PATRICK-V11.JPG*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/patrick-v11.jpg`)
    try {
        let buffer = m.quoted && m.quoted.isMedia ? await m.quoted.download() : await m.download()
        if (!buffer) return m.reply('❌ Gagal mendownload gambar')
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('patrick-v11', buffer, 'patrick-v11.jpg')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar patrick-v11.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload gambar: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }