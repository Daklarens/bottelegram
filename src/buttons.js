const menu = async (bot)=>{ return bot.inlineKeyboard([
    [
        bot.inlineButton('🛍 Каталог дизайнов', {callback: 'katalog'})
    ],
    [
        bot.inlineButton('🖌 Ваш дизайн', {callback: 'create'})
    ],
    [
        bot.inlineButton('👕 Уход за изделиями', {callback: 'izdel'})
    ],
    [
        bot.inlineButton('📧 Связь', {callback: 'izdel'})
    ],
])

}

const katalog = (bot)=>{bot.inlineKeyboard([
    [
        // First row with command callback button
        bot.inlineButton('140X140', {callback: '140X140'})
    ],
    [
        // First row with command callback button
        bot.inlineButton('140X200', {callback: '140X200'})
    ],
    [
        // Second row with regular command button
        bot.inlineButton('200X200', {callback: '200X200'})
    ],
    [
        // Second row with regular command button
        bot.inlineButton('280X360', {callback: '280X360'})
    ],
    [
        // Second row with regular command button
        bot.inlineButton('<< Назад', {callback: 'menu'})
    ]
])}

let items = (bot)=>{bot.inlineKeyboard([
    [
        // First row with command callback button
        bot.inlineButton('<<<', {callback: 'back_tovar'}),
        bot.inlineButton('>>>', {callback: 'next_tovar'})
        
    ],
    [
        // First row with command callback button
        bot.inlineButton(`${korzina.text }`, {callback:korzina.call})
    ],
    [
        // Second row with regular command button
        bot.inlineButton('Оформить заказ', {callback: 'payment'})
    ],
    [
        // Second row with regular command button
        bot.inlineButton('<< Назад', {callback: 'menu'})
    ]
])}

module.exports = {menu, katalog, items}