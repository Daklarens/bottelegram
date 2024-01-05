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
        bot.inlineButton('📧 Связь', {callback: 'call'})
    ],
])

}

const end = async (bot)=>{ return bot.inlineKeyboard([
    [
        // First row with command callback button
        bot.inlineButton('<< Вернуться в меню', {callback: 'menu'})
    ]
])}

const pay = async (bot)=>{ return bot.inlineKeyboard([
    [
        // First row with command callback button
        bot.inlineButton('Оплатить', {pay: true})
    ],
    [
        // First row with command callback button
        bot.inlineButton('Изменить корзину', {callback: 'korzina'})
    ],
    [
        // First row with command callback button
        bot.inlineButton('Вернуться в меню', {callback: 'menu'})
    ]
])}

let items = async (bot,id,count)=>{return bot.inlineKeyboard([
    [
        // First row with command callback button
        bot.inlineButton('<<<', {callback: `tovar_set_${id-1}`}),
        bot.inlineButton('>>>', {callback: `tovar_set_${id+1}`})
        
    ],
    [
        // First row with command callback button
        bot.inlineButton(`🛒 ${count}`, {callback: `korzina`}),
        bot.inlineButton(`➕`, {callback: `tovar_plus_${id}`}),
        bot.inlineButton(`➖`, {callback: `tovar_minus_${id}`}),

    ],
    [
        // Second row with regular command button
        bot.inlineButton('Оформить заказ', {callback: 'payment'})
    ],
    [
        // Second row with regular command button
        bot.inlineButton('<< В меню', {callback: 'menu'})
    ]
])}


let adminItems = async (bot)=>{return bot.inlineKeyboard([
    [
        // Second row with regular command button
        bot.inlineButton('Изменить ✏️', {callback: 'editItem'})
    ],
    [
        // Second row with regular command button
        bot.inlineButton('Сохранить и выйти 📝', {callback: 'createMenu'})
    ]
])}

module.exports = {menu, end, items, adminItems,pay}