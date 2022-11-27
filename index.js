// Импорт Telegraf и Markup
const {Telegraf, Markup} = require('telegraf')
// Импорт dotenv для защиты API токена
require('dotenv').config()
// Импорт хрона
const cron = require('node-cron');

// Импорт модуля с константами
const my_const = require('./const')

// Cron test
let i = 0;
const task = cron.schedule('* * * * * *', () => {
  console.log('stopped task-' + i);
  i++;
}, {
  scheduled: false
});
task.start();

// Инициализация бота с помощью Telegraf
const bot = new Telegraf(process.env.BOT_TOKEN)

// Обработка команды /start
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}!`))
// Обработка команды /help
bot.help((ctx) => ctx.reply(my_const.commands))
// Обработка команды /course
bot.command('chron', async (ctx) => {
  try {
    await ctx.replyWithHTML('<b>Countdown</b>', Markup.inlineKeyboard(
      [Markup.button.callback('Start', 'btn_c')]
    ))
  } catch (e) {
    console.error(e)
  }
})

const addActionBot = (id_btn) => {
  bot.action(id_btn, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      ctx.reply(`AlЯrm!`);
    } catch (e) {
      console.error(e)
    }
  })
}

// Обработчик кнопок с помощью функции
addActionBot('btn_c')

// Запустить бота
bot.launch()

// Включить плавную остановку
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))