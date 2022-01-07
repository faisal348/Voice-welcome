require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES"],
});
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require("@distube/spotify");
const Distube = require("distube");

const targetedVoiceChannel = "861075863554228267";
const voiceLogChannel = "898937103667322880";

const distube = new Distube.default(client, {
  searchSongs: 1,
  searchCooldown: 30,
  leaveOnEmpty: false,
  emptyCooldown: 1000 * 60 * 60 * 24,
  leaveOnFinish: false,
  leaveOnStop: false,
  plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
});

// client.on("debug", console.log);
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (oldState.member.user.bot) return;
  if (
    newState.channelID === targetedVoiceChannel &&
    oldState.channelID === null
  ) {
    distube.playVoiceChannel(
      newState.member.voice.channel,
      "https://youtu.be/Dpe3zKCRBB0",
      {
        textChannel: newState.member.guild.channels.cache.get(voiceLogChannel),
        member: newState.member,
      }
    );
  }
});

distube.on("playSong", (queue, song) => {
  queue.textChannel.send(`هناك شخص دخل روم الدعم الفني : <@!${"أيدي رتبة"}>`);
});

client.login(process.env.token);
