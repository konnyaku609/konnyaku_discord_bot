// main.mjs - Discord Botのメインプログラム

// 必要なライブラリを読み込み
import { Client, GatewayIntentBits,ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
  TextChannel, } from 'discord.js';
import dotenv from 'dotenv';
import express from 'express';


// .envファイルから環境変数を読み込み
dotenv.config();

// Discord Botクライアントを作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // サーバー情報取得
        GatewayIntentBits.GuildMessages,    // メッセージ取得
        GatewayIntentBits.MessageContent,   // メッセージ内容取得
        GatewayIntentBits.GuildMembers,     // メンバー情報取得
    ],
});

// Botが起動完了したときの処理
client.once('ready', () => {
    console.log(`🎉 ${client.user.tag} が正常に起動しました！`);
    console.log(`📊 ${client.guilds.cache.size} つのサーバーに参加中`);
});

// メッセージが送信されたときの処理
client.on('messageCreate', (message) => {
    // Bot自身のメッセージは無視
    if (message.author.bot) return;
    
    // 「ping」メッセージに反応
    if (message.content.toLowerCase() === 'ping') {
        message.reply('🏓 pong!');
        console.log(`📝 ${message.author.tag} が ping コマンドを使用`);
    }
 if (message.content.toLowerCase() === 'こんにゃく') {
        message.reply('🏓 にゃく！');
        console.log(`📝 ${message.author.tag} が こんにゃく コマンドを使用`);
    }
 if(message.content.toLowerCase()==='1d100'){
		const random = Math.floor(Math.random()*100)+1;
		message.reply(String(random));
		console.log(`📝 ${message.author.tag} が 1d100 コマンドを使用`)
	}
});

//ボタンを押すとロールが付与されるやつ
client.on('interactionCreate', async (interaction) => {
    // 1. ボタン操作であるかを確認
    if (!interaction.isButton()) return;

    // 2. どのボタンが押されたか customId で識別
    if (interaction.customId === 'verify_role_button') {
        // インタラクションが実行されたギルドとメンバーが存在するか確認
        const guild = interaction.guild;
        const member = interaction.member; // これは GuildMember | null
        const roleId = '蒟蒻ふれんず'; 

        if (!guild || !member) {
            await interaction.reply({
                content: 'この操作はサーバー内でのみ有効です。',
                ephemeral: true, // ephemeral: true で、応答がボタンを押した本人にしか見えないようにする
            });
            return;
        }

        // 3. ロールを付与
        try {
            // member は PartialGuildMember の可能性もあるため、GuildMember であるか確認
            if ('roles' in member) {
                // ロールIDを取得
                const role = guild.roles.cache.get(roleId);

                if (!role) {
                    // ロールが見つからない場合のエラー処理
                    await interaction.reply({
                        content: '指定されたロールが見つかりませんでした。管理者にお問い合わせください。',
                        ephemeral: true,
                    });
                    return;
                }

                // すでにロールを持っているか確認
                if (member.roles.cache.has(roleId)) {
                    await interaction.reply({
                        content: `**${role.name}** ロールはすでにお持ちです。`,
                        ephemeral: true,
                    });
                } else {
                    // ロールをメンバーに追加
                    await member.roles.add(role);

                    // 応答を送信
                    await interaction.reply({
                        content: `**${role.name}** ロールを付与しました！`,
                        ephemeral: true,
                    });
                }
            }
        } catch (error) {
            console.error('ロール付与中にエラーが発生しました:', error);
            // エラー時の応答
            await interaction.reply({
                content: 'ロール付与中にエラーが発生しました。ボットの権限設定を確認してください。',
                ephemeral: true,
            });
        }
    }
});

client.login('YOUR_BOT_TOKEN');


// エラーハンドリング
client.on('error', (error) => {
    console.error('❌ Discord クライアントエラー:', error);
});

// プロセス終了時の処理
process.on('SIGINT', () => {
    console.log('🛑 Botを終了しています...');
    client.destroy();
    process.exit(0);
});

// Discord にログイン
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ DISCORD_TOKEN が .env ファイルに設定されていません！');
    process.exit(1);
}

console.log('🔄 Discord に接続中...');
client.login(process.env.DISCORD_TOKEN)
    .catch(error => {
        console.error('❌ ログインに失敗しました:', error);
        process.exit(1);
    });

// Express Webサーバーの設定（Render用）
const app = express();
const port = process.env.PORT || 3000;

// ヘルスチェック用エンドポイントAS
app.get('/', (req, res) => {
    res.json({
        status: 'Bot is running! 🤖',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// サーバー起動
app.listen(port, () => {
    console.log(`🌐 Web サーバーがポート ${port} で起動しました`);
});