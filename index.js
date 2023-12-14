const TeleBot = require('telebot');
require('dotenv').config()

const bot = new TeleBot({
    token: process.env.TOKEN,
    usePlugins: ['askUser']
});

const users = [];
const korzina = {text:'Добавить в карзину', call:'korzina_add'};

const helloText = "Добро пожаловать в наш бот по вышивке изображений на одежде! 🧵👕\nМы рады видеть вас здесь. Наш бот готов помочь вам с оформлением уникальной вышивки на вашей одежде. Просто расскажите нам, что вы хотели бы видеть, и мы сделаем все возможное, чтобы сделать вашу одежду особенной и стильной.\nЕсли у вас есть какие-либо вопросы или специальные запросы, не стесняйтесь сообщить нам. Удачи в создании вашего уникального стиля! 💼🧵"

const replyMarkup_menu = bot.inlineKeyboard([
    [
        // First row with command callback button
        bot.inlineButton('Каталог дизайнов', {callback: 'katalog'})
    ],
    [
        // First row with command callback button
        bot.inlineButton('Изделия', {callback: 'izdel'})
    ],
    [
        // Second row with regular command button
        bot.inlineButton('Сделай Сам!', {callback: 'create'})
    ]
]);
const replyMarkup_katalog = bot.inlineKeyboard([
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
]);
let replyMarkup_izdel = bot.inlineKeyboard([
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
]);

// On start command
bot.on('/start', async msg => {
    // Send message with keyboard markup
    return bot.sendMessage(msg.from.id, helloText, {parseMode: 'html', replyMarkup:replyMarkup_menu}).then(re => {newUser(re)})
});

bot.on('/hello', msg => {
    return bot.sendMessage(msg.from.id, 'Hello!');
});

// Button callback
bot.on('callbackQuery', async(msg) => {

    const chatId = users[0].id
    const messageId = users[0].las_mess
    switch(msg.data){
        case 'katalog':
            console.log(`${chatId},${messageId}`)
            return  bot.editMessageText({chatId, messageId}, ` Каталог Дизайнов`,{parseMode: 'html'},{replyMarkup:replyMarkup_katalog}).catch(error => console.log('Error:', error));
        break;
        case 'izdel':
            console.log(`${chatId},${messageId}`)
            bot.editMessageText({chatId, messageId}, `Страница 1 из 10\n\n<b>Персик</b>\nРазмеры: S, M\nЦвет: Белый, Черный\nЦена: <b>2500</b> руб.\n<a href="https://ae01.alicdn.com/kf/HTB1vrz.boz.BuNjt_j7q6x0nFXaS.jpg">Изображение</a>`,{parseMode: 'html', replyMarkup:replyMarkup_izdel}).catch(error => console.log('Error:', error));
            korzina.text = 'Залупа'
            korzina.call = 'korzinasadas_1'
            return
        break;
        case 'create':
            const id = msg.from.id;
            return bot.sendMessage(id, 'На чем вы хотите видеть ваше изображение ?', {ask: 'forma'});
        break;
        case 'payment':
            const inlineKeyboard = bot.inlineKeyboard([
                [
                    bot.inlineButton('Оплатить', {pay: true})
                ]
            ]); 
        
            return bot.sendInvoice(msg.from.id, {
                title: 'Футболка с изображением - Персик',
                description: 'Футболка с изображением персик - белого цвета! После оплаты с вами свяжется наш менеджер для уточнения всех деталей',
                payload: 'telebot-test-invoice',
                providerToken: '401643678:TEST:685469ce-2ca8-43c1-9f8d-d90f23956214',
                startParameter: 'pay',
                currency: 'RUB',
                sendPhoneNumberToProvider: true,
                photo: {url:'https://ae01.alicdn.com/kf/HTB1vrz.boz.BuNjt_j7q6x0nFXaS.jpg'},
                prices: [
                    {label: 'Футболка с изображением', amount: 250000},
                    {label: 'Подарочный пакет', amount: 10000},
                    {label: 'Доставка', amount: 100000}
                ],  
                replyMarkup: inlineKeyboard
            }).then(data => {
                console.log('OK', data);
            }).catch(error => {
                console.log('ERROR', error);
            });
        break;
        case 'menu':
            console.log(`${chatId},${messageId}`)
            return  bot.editMessageText({chatId, messageId}, ` ${helloText}`,{parseMode: 'html'},{replyMarkup:replyMarkup_menu}).catch(error => console.log('Error:', error));
        break;
        case 'korzina_add':
            
            console.log(`${chatId},${messageId}`)
            
            console.log(korzina)
            return  bot.editMessageReplyMarkup({chatId, messageId}, {replyMarkup:replyMarkup_izdel}).catch(error => console.log('Error:', error));
        break;
        case 'korzina_1':
            console.log("korzina ------1")
        break;
    }
    bot.answerCallbackQuery(msg.id);
 
});

const newUser = async(msg) =>{
    console.log(msg)
    users.push({id:msg.chat.id, las_mess:msg.message_id})
    console.log(users)
}
/*
// Ask name event
bot.on('ask.name', msg => {

    const id = msg.from.id;
    const name = msg.text;

    // Ask user age
    return bot.sendMessage(id, `Nice to meet you, ${ name }! How old are you?`, {ask: 'age'});

});

// Ask age event
bot.on('ask.age', msg => {

    const id = msg.from.id;
    const age = Number(msg.text);

    if (!age) {

        // If incorrect age, ask again
        return bot.sendMessage(id, 'Incorrect age. Please, try again!', {ask: 'age'});

    } else {

        // Last message (don't ask)
        return bot.sendMessage(id, `You are ${ age } years old. Great!`);

    }

});
*/

bot.on('ask.forma', msg => {
    const id = msg.from.id;
    // Ask user age
    return bot.sendMessage(id, `Хорошо, Отправьте нам свое изображение`, {ask: 'image'});

});

bot.on('ask.image', msg => {
    const id = msg.from.id;
    // Ask user age
    return bot.sendMessage(id, `Теперь укажите ваш размер`, {ask: 'size'});

});

bot.on('ask.size', msg => {
    const id = msg.from.id;
    // Ask user age
    return bot.sendMessage(id, `Укажите ваш контактный номер телефона для связи`, {ask: 'contact'});

});
bot.on('ask.contact', msg => {
    const id = msg.from.id;
    // Ask user age
    return bot.sendMessage(id, `Мы свяжемся с вами в ближайшее время для согласования некоторых моментов`, {});

});

bot.on('shippingQuery', (msg) => {
    console.log('shippingQuery', msg);
});

bot.on('preShippingQuery', (msg) => {
    console.log('preShippingQuery', msg);

    const id = msg.id;
    const isOk = true;

    return bot.answerPreCheckoutQuery(id, isOk);

});

bot.on('successfulPayment', (msg) => {
    console.log('successfulPayment', msg);

    return bot.sendMessage(msg.from.id, `Спасибо за покупку, ${msg.from.first_name}! Мы свяжемся с вами в ближайшеее время`);

});


bot.start();