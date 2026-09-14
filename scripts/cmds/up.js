const os = require('os');
const { bold } = require("fontstyles");

module.exports = {
  config: {
    name: 'uptime',
    aliases: ['up', 'upt', 'hrtm', 'rtm'],
    version: '1.5',
    author: 'eden',
    countDown: 10,
    role: 0,
    shortDescription: 'Display bot uptime',
    longDescription: {
      en: 'Display bot uptime'
    },
    category: 'system',
    guide: {
      id: '{pn}: Display bot uptime and system stats with media ban check',
      en: '{pn}: Display bot uptime and system stats with media ban check'
    }
  },

  onStart: async function ({ message, event, usersData, threadsData, api }) {

    if (this.config.author !== 'eden) {
      return message.reply("⚠ Unauthorized author change detected. Command execution stopped.");
    }

    const startTime = Date.now();
    const users = await usersData.getAll();
    const groups = await threadsData.getAll();

    const botUptime = process.uptime();
    const sysUptime = os.uptime();

    function formatTime(sec) {
      const d = Math.floor(sec / 86400);
      const h = Math.floor((sec % 86400) / 3600);
      const m = Math.floor((sec % 3600) / 60);
      return `${d}d ${h}h ${m}m`;
    }

    const uptimeString = formatTime(botUptime);
    const sysUptimeString = formatTime(sysUptime);

    try {
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const cpuCores = os.cpus().length;
      const endTime = Date.now();
      const botPing = endTime - startTime;

      const sentMessage = await message.reply("LOADING...\n[█▒▒▒▒▒▒▒▒▒]");

      const loadingFrames = [
        'LOADING.\n[█▒▒▒▒▒▒▒▒▒]',
        'LOADING..\n[██▒▒▒▒▒▒▒▒]',
        'LOADING...\n[████▒▒▒▒▒▒]',
        'LOADING...\n[███████▒▒]'
      ];

      for (let i = 0; i < loadingFrames.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        api.editMessage(loadingFrames[i], sentMessage.messageID);
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const finalMessage = `┏━━━━━━━━֎
╏ ⏳𝗟𝗢𝗔𝗗𝗘𝗗⏳
┇[█████████]
┇
┣❥🖥 𝐒𝐘𝐒𝐓𝐄𝐌 𝐔𝐏𝐓𝐈𝗠𝗘 🖥️
┇
┣➧⏰ 𝗨𝗣𝗧𝗜𝗠𝗘: ${uptimeString}
┣➧⏳ 𝗦𝗬𝗦𝗧𝗘𝗠: ${sysUptimeString}
┇
┣➧🎯 𝗖𝗣𝗨 𝗖𝗢𝗥𝗘𝗦: ${cpuCores}
┣➧🚀 𝗣𝗜𝗡𝗚: ${botPing}ms
┇
┣➧👫 𝐓𝐎𝐓𝐀𝐋 𝐔𝐒𝐄𝐑𝐒: ${users.length}
┣➧📜 𝐓𝐎𝐓𝐀𝐋 𝐆𝐑𝐎𝐔𝐏𝐒: ${groups.length}
┇
┣➧👑 𝗢𝗪𝗡𝗘𝗥:  𝐄𝐝𝐞𝐧 愛
┣➧📥 𝗙𝗕: DIMU NA SHOR
┗━━━━━━━━━━━━━━━❂`;

      api.editMessage(finalMessage, sentMessage.messageID);

    } catch (err) {
      console.error(err);
      return message.reply("❌ An error occurred while fetching system statistics.");
    }
  }
};
