import fs from 'fs'
import path from 'path'
import te from '../../src/lib/patrick-error.js'
import { updateAssetUrl } from '../../src/lib/patrick-uploader.js'
const pluginConfig = {
    name: 'ganti-patrick-otp.jpg',
    alias: ['gantipatrickotp', 'setpatrickotp'],
    category: 'owner',
    description: 'Ganti gambar patrick-otp.jpg',
    usage: '.ganti-patrick-otp.jpg (reply/kirim gambar)',
    example: '.ganti-patrick-otp.jpg',
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
    if (!isImage) return m.reply(`🖼️ *ɢᴀɴᴛɪ PATRICK-OTP.JPG*\n\n> Kirim/reply gambar untuk mengganti\n> File: assets/images/patrick-otp.jpg`)
    try {
        let buffer = m.quoted && m.quoted.isMedia ? await m.quoted.download() : await m.download()
        if (!buffer) return m.reply('❌ Gagal mendownload gambar')
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('patrick-otp', buffer, 'patrick-otp.jpg')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> Gambar patrick-otp.jpg telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload gambar: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }