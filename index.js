const TeleBot = require('telebot');
require('dotenv').config()
const db = require('./src/db')
const bt = require('./src/buttons')

const bot = new TeleBot({
    token: process.env.TOKEN,
    usePlugins: ['askUser']
});
/*
bot.on('photo',async msg =>{
    console.log(msg.photo)
    console.log(msg.photo.length)
    await db.insert('config',{name:'img_menu',fid:msg.photo[3].file_id,fUniqId:msg.photo[3].file_unique_id,w:msg.photo[3].width,h:msg.photo[3].height})
})
*/
bot.on('/addAdminCode', async msg =>{
    const code = msg.text.split(' ');
    if(code[1] === process.env.PRIVATECOD){
       const chek = await db.count('config',{uid:msg.from.id}) 
       if(chek > 0 ){
            return bot.sendMessage(msg.from.id,"Вы уже Администратор")
       }else{
        const ct =  await db.insert('config',{uid:msg.from.id,username:msg.from.username,admin_status:1})
        if(ct === true){
            const start_nastr = await db.count('config',{}) 
            if(start_nastr === 1){
                bot.sendMessage(msg.from.id,"Вы внесены в список администраторов")
                return bot.sendMessage(msg.from.id,`Напишите в ответ на это сообщение приветствующий текст который бот в дальнейшем будет использовать`, {ask: 'hello_text'})
            }else{
               // return bot.sendMessage(msg.from.id,"Вы внесены в список администраторов")
            }
        }
       }    
    }
})

// On start command
bot.on('/start', async msg => {
    const hello = await db.find('config',{name:"hello_text"})
    const button = await bt.menu(bot)
    const photo = await db.find('config',{name:"img_menu"})
    const photoArr = await [photo[0].fid,photo[0].fUniqId,photo[0].w,photo[0].h]
    // Send message with keyboard markup
    /*
    bot.sendPhoto(msg.from.id, { file_id: 'AgACAgIAAxkBAAIFwWV_CEM5KxcNv16vSqq_RPaoycAGAAIK0TEb3Bb4S9lUdLffJ5nHAQADAgADeAADMwQ'},{
        file_id: 'AgACAgIAAxkBAAIFwWV_CEM5KxcNv16vSqq_RPaoycAGAAIK0TEb3Bb4S9lUdLffJ5nHAQADAgADeAADMwQ',
    file_unique_id: 'AQADCtExG9wW-Et9',
    file_size: 109968,
    width: 681,
    height: 800
    });
    */
    return bot.sendPhoto(msg.from.id,photoArr , {caption:hello[0].text, parseMode: 'html', replyMarkup:button}).then(re => {})
});
/*
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

bot.on('ask.hello_text', async msg => {
    const id = msg.from.id;
    const text = String(msg.text)
    await db.insert('config',{name:'hello_text',text});
    // Ask user age
    return bot.sendMessage(id, `Окей, вот несколько комманд для администратора :\n/addAdminItem - Добавить товар\n/addAdminUser - Добавить администратора(@username)\n/dellAdminUser - Забрать права администратора\n/dellAdminItem - Удалить товар\n\n Теперь напишите или нажмите на : /start`);

});

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