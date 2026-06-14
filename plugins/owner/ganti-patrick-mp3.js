import fs from 'fs'
import path from 'path'
import te from '../../src/lib/patrick-error.js'
import { updateAssetUrl } from '../../src/lib/patrick-uploader.js'
const pluginConfig = {
    name: 'ganti-patrick.mp3',
    alias: ['gantipatrickaudio', 'setpatrickaudio'],
    category: 'owner',
    description: 'Ganti audio patrick.mp3',
    usage: '.ganti-patrick.mp3 (reply/kirim audio)',
    example: '.ganti-patrick.mp3',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isAudio = m.type === 'audioMessage' || (m.quoted && m.quoted.type === 'audioMessage')
    
    if (!isAudio) {
        return m.reply(`🎵 *ɢᴀɴᴛɪ ᴘᴀᴛʀɪᴄᴋ.ᴍᴘ3*\n\n> Kirim/reply audio untuk mengganti\n> File: assets/audio/patrick.mp3`)
    }
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            return m.reply(`❌ Gagal mendownload audio`)
        }
        
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('patrick-mp3', buffer, 'patrick.mp3')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> File patrick.mp3 telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload file: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }