import config from '../../config.js'
import { getDatabase } from '../../src/lib/patrick-database.js'

const pluginConfig = {
    name: 'botmode',
    alias: ['setmode', 'mode'],
    category: 'owner',
    description: 'Mengatur mode bot (md/cpanel/store/pushkontak/all)',
    usage: '.botmode <mode>',
    example: '.botmode autoorder',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
}

const VALID_MODES = ['md', 'cpanel', 'store', 'pushkontak', 'all']

const MODE_DESCRIPTIONS = {
    md: 'Mode default, semua fitur kecuali panel/store/pushkontak',
    cpanel: 'Mode panel, main + group + sticker + owner + tools + panel',
    store: 'Mode store manual, main + group + sticker + owner + store',
    pushkontak: 'Mode pushkontak, main + group + sticker + owner + pushkontak',
    all: 'Mode full, SEMUA fitur dari semua mode bisa diakses'
}

async function handler(m, { sock }) {
    const db = getDatabase()
    const args = m.args || []
    
    let mode = (args[0] || '').toLowerCase()
    const flags = args.slice(1).map(f => f.toLowerCase())

    
    const globalMode = db.setting('botMode') || 'md'
    const groupData = m.isGroup ? (db.getGroup(m.chat) || {}) : {}
    const groupMode = groupData.botMode || null
    
    if (!mode) {
        let txt = `╭┈┈⬡「 🤖 *ʙᴏᴛ ᴍᴏᴅᴇ* 」\n`
        txt += `┃ ㊗ ɢʟᴏʙᴀʟ: *${globalMode.toUpperCase()}*\n`
        
        if (m.isGroup) {
            txt += `┃ ㊗ ɢʀᴜᴘ: *${(groupMode || 'INHERIT').toUpperCase()}*\n`
        }
        txt += `╰┈┈⬡\n\n`
        
        txt += `╭┈┈⬡「 📋 *ᴀᴠᴀɪʟᴀʙʟᴇ ᴍᴏᴅᴇs* 」\n`
        
        const currentMode = m.isGroup ? (groupMode || globalMode) : globalMode
        
        for (const [key, desc] of Object.entries(MODE_DESCRIPTIONS)) {
            const isActive = key === currentMode ? ' ✅' : ''
            txt += `┃ ㊗ *${key.toUpperCase()}*${isActive}\n`
            txt += `┃   ${desc}\n`
        }
        txt += `╰┈┈⬡\n\n`
        
        txt += `*ꜰʟᴀɢ sᴛᴏʀᴇ:*\n`
        txt += `> \`${m.prefix}botmode store\` - Manual order\n`
        txt += `> \`${m.prefix}botmode md\` → Mode default\n`
        txt += `> \`${m.prefix}botmode all\` → Semua fitur`
        
        await m.reply(txt)
        return
    }

    if (!VALID_MODES.includes(mode)) {
        return m.reply(
            `❌ *ᴍᴏᴅᴇ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ*\n\n` +
            `> Mode tersedia: \`${VALID_MODES.join(', ')}\``
        )
    }

    if (m.isGroup) {
        const newGroupData = {
            ...groupData,
            botMode: mode
        }

        if (mode === 'store') {
            newGroupData.storeConfig = {
                ...(groupData.storeConfig || {}),
                products: groupData.storeConfig?.products || []
            }
        }

        db.setGroup(m.chat, newGroupData)
    } else {
        db.setting('botMode', mode)
    }

    db.save()
    await m.react('✅')



    await m.reply(
        `✅ *ᴍᴏᴅᴇ ᴅɪᴜʙᴀʜ*\n\n` +
        `> Mode: *${mode.toUpperCase()}*\n` +
        `> ${MODE_DESCRIPTIONS[mode]}\n` +
        `\n\n` +
        (m.isGroup ? `> _Mode grup ini juga diubah._` : `> _Mode global diubah._`)
    )

    console.log(`[BotMode] Changed to ${mode.toUpperCase()} by ${m.pushName} (${m.sender})`)
}

export { pluginConfig as config, handler, VALID_MODES, MODE_DESCRIPTIONS }