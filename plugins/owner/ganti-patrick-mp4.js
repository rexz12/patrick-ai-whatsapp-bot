import fs from 'fs'
import path from 'path'
import te from '../../src/lib/patrick-error.js'
import { updateAssetUrl } from '../../src/lib/patrick-uploader.js'
const pluginConfig = {
    name: 'ganti-patrick.mp4',
    alias: ['gantipatrickvideo', 'setpatrickvideo'],
    category: 'owner',
    description: 'Ganti video patrick.mp4',
    usage: '.ganti-patrick.mp4 (reply/kirim video)',
    example: '.ganti-patrick.mp4',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    const isVideo = m.type === 'videoMessage' || (m.quoted && m.quoted.type === 'videoMessage')
    
    if (!isVideo) {
        return m.reply(`🎬 *ɢᴀɴᴛɪ ᴘᴀᴛʀɪᴄᴋ.ᴍᴘ4*\n\n> Kirim/reply video untuk mengganti\n> File: assets/video/patrick.mp4`)
    }
    
    try {
        let buffer
        if (m.quoted && m.quoted.isMedia) {
            buffer = await m.quoted.download()
        } else if (m.isMedia) {
            buffer = await m.download()
        }
        
        if (!buffer) {
            return m.reply(`❌ Gagal mendownload video`)
        }
        
        await m.reply(`⏳ Sedang mengupload gambar...`)
        try {
            const newUrl = await updateAssetUrl('patrick-mp4', buffer, 'patrick.mp4')
            m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*\n\n> File patrick.mp4 telah diganti ke URL baru:\n> ${newUrl}\n> Config telah diupdate secara realtime!`)
        } catch (e) {
            m.reply(`❌ Gagal mengupload file: ${e.message}`)
        }
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }