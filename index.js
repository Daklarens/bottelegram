const TeleBot = require('telebot');
require('dotenv').config()
const service = require('./src/services')
const db = require('./src/db')
const bt = require('./src/buttons')
const serv = new service.bodyService()

const bot = new TeleBot({
    token: process.env.TOKEN,
    usePlugins: ['askUser']
});

//Основная
bot.on('/start', async msg => {
    const otvet = await serv.startPage(msg.chat,bot)
    return bot.sendPhoto(msg.from.id,otvet.photoArr , {caption:otvet.hello[0].text, parseMode: 'html', replyMarkup:otvet.button}).then(async re => { await serv.addUser(re.chat,re.message_id)})
});

//Команды Админа
bot.on('/addAdminCode', async msg =>{
    const code = msg.text.split(' ');
    const otvet = await serv.addAdmin(msg.from,code[1])
    console.log(`server send: ${otvet}`)
    switch(otvet){
        case 0 :
            return bot.sendMessage(msg.chat.id,"Ошибка в обработке запроса, попробуйте позже")
        break;
        case 1 :
            bot.sendMessage(msg.chat.id,"Вы внесены в список администраторов")
            return bot.sendMessage(msg.chat.id,`Напишите в ответ на это сообщение приветствующий текст который бот в дальнейшем будет использовать`, {ask: 'hello_text'})
        break;
        case 2 :
            return bot.sendMessage(msg.chat.id,"Вы внесены в список администраторов")
        break;
        case 3 :
            return bot.sendMessage(msg.chat.id,"Вы уже Администратор")
        break;
    }
})

bot.on('/addItem', async msg =>{
    const uid = msg.chat.id
    const las_mess = await serv.getLastMess(uid)
    const chek = await serv.issAdmin(uid)
    if(chek > 0){
        //bot.editMessageCaption({chatId:uid,messageId:las_mess}, {caption:'Это Образец вашего товара\nТекст можно редактировать с помощью html разметки\n\n<b>Пришлите в ответ на это сообщение Описание вашего товара</b>',parse_mode: 'html'},{ask:'addDescription'}).catch(error => console.log('Error:', error));
        return bot.sendMessage(uid, `<b>Пришлите мне фотографию вашего товара!</b>`, {parseMode:'html',ask: 'addImg'});
    }
})
bot.on('/dellItem', async msg =>{
    const splt = msg.text.split(' ')
    const uid = msg.chat.id
    const idItem = Number(splt[1])
    const otvet = await serv.dellItem(uid,idItem)
    return bot.sendMessage(uid,`Всего товаров: ${otvet}`)


})

// callback
bot.on('callbackQuery', async(msg) => {
    const uid = msg.message.chat.id
    const las_mess = await serv.getLastMess(uid)
    let zapros = msg.data
    let dell = zapros.split('_')
    if(dell[0] === 'tovar'){zapros = dell[1]}
    switch(zapros){
        case 'katalog':
            const countKorz = await serv.getCountKorz(uid)
            const button = await bt.items(bot,1,countKorz)
            const item = await serv.getItem(1)
            console.log(item)
            return  bot.editMessageMedia({media:item.fId,type:'photo',caption:`<b>${item.title}</b>\n\n${item.description}\n\n<b>Цена: ${item.price} руб.</b>`,parse_mode:'html'},{chatId:uid,messageId:las_mess, replyMarkup:button}).catch(error => console.log('Error:', error));
        break;
        case 'create':
            const crButton = await bt.end(bot)
            return bot.editMessageCaption({chatId:uid,messageId:las_mess}, {caption:`Вы можете прислать нам ваше изображение чтобы мы помогли воплотить ваши мечты в жизнь \n\n (отправьте изображение)`,replyMarkup:crButton,parse_mode:'html'});        
        break;
        case 'izdel':
            const izButton = await bt.end(bot)
            return bot.editMessageCaption({chatId:uid,messageId:las_mess}, {caption:`<b>1. 🧺 Стирка изделий с вышивкой:</b>\n· Стирать нужно при температуре не выше 30°;\n· Стирка рекомендуется ручная, а если нет такой возможности - то в машинке на самом деликатном режиме;\n· Используйте мягкие, жидкие средства для стирки.\nНельзя использовать средства с хлором и пероксидом;\n· Саму вышивку лучше не отжимать, не выкручивать и не тереть;\n<b>2. 🌧️☀️ Сушка изделий с вышивкой:</b>\nЖелательно такие изделия сушить в горизонтальном виде, аккуратно разложенными на ткани или сушилке.\n<b>3. ❕Глажка изделий с вышивкой:</b>\nВещь должна быть немного влажной для полного разглаживание складок. При необходимости сбрызните ее водой.\nГладить изделие нужно только вывернутым наизнанку или покрыв тонкой тканью.`,replyMarkup:izButton,parse_mode:'html'});        
        break;
        case 'call':
            const caButton = await bt.end(bot)
            return bot.editMessageCaption({chatId:uid,messageId:las_mess}, {caption:`Менеджеры по продажам:\n<a href="https://vk.com/id585005638">Денис - VK</a> Тел. +7 977 975 33 62\n<a href="https://vk.com/id94747670">Диана - VK</a> Тел. +7 995 900 69 10;`,replyMarkup:caButton,parse_mode:'html'});        
        break;
        case 'menu':
            const otvet = await serv.startPage(msg.from,bot)
            return  bot.editMessageMedia({media:otvet.photoArr[0],type:'photo',caption:otvet.hello[0].text,parse_mode:'html'},{chatId:uid,messageId:las_mess, replyMarkup:otvet.button}).catch(error => console.log('Error:', error));
        break;
        //для Каталога
        case 'set':
            const setKorz = await serv.getCountKorz(uid)
            const setItem = await serv.getItem(Number(dell[2]))
            const setButton = await bt.items(bot,Number(dell[2]),setKorz)
            return  bot.editMessageMedia({media:setItem.fId,type:'photo',caption:`<b>${setItem.title}</b>\n\n${setItem.description}\n\n<b>Цена: ${setItem.price} руб.</b>`,parse_mode:'html'},{chatId:uid,messageId:las_mess, replyMarkup:setButton}).catch(error => console.log('Error:', error));
        break;
        case 'plus':
            const plusKorz = await serv.addKorz(uid,Number(dell[2]))
            const plusButton = await bt.items(bot,Number(dell[2]),plusKorz)
            return bot.editMessageReplyMarkup({chatId:uid,messageId:las_mess},{replyMarkup:plusButton})

        break;
        case 'minus':
            const minusKorz = await serv.dellKorz(uid,Number(dell[2]))
            const minusButton = await bt.items(bot,Number(dell[2]),minusKorz)
            return bot.editMessageReplyMarkup({chatId:uid,messageId:las_mess},{replyMarkup:minusButton})
        break;
        case 'editItem':
            bot.deleteMessage(uid,las_mess)
            return bot.sendMessage(uid, `<b>Пришлите мне фотографию вашего товара!</b>`, {parseMode:'html',ask: 'addImg'});
        break;
        case 'createMenu':
            const add = await serv.addItem(uid)
            const dataSt = await serv.startPage(msg.message.chat,bot)
            return  bot.editMessageMedia({media:dataSt.photoArr[0],type:'photo',caption:dataSt.hello[0].text,parse_mode:'html'},{chatId:uid,messageId:las_mess, replyMarkup:dataSt.button}).catch(error => console.log('Error:', error));
        break;
        //Момент оплаты 
        case 'payment':
            const gg = await serv.generateKorz(uid,bot)
            return bot.sendInvoice(msg.from.id, {
                title: `Ваш заказ:`,
                description: gg.text,
                payload: 'telebot-test-invoice',
                providerToken: process.env.PAYCOD,
                startParameter: 'pay',
                currency: 'RUB',
                sendPhoneNumberToProvider: true,
                photo: {url:'https://flomaster.top/uploads/posts/2022-12/1672474935_flomaster-club-p-korzina-illyustratsiya-instagram-1.png'},
                prices: gg.items,  
                replyMarkup: gg.plBt
            }).then(data => {
                console.log('OK', data);
            }).catch(error => {
                console.log('ERROR', error);
            });
        break;

    }

    bot.answerCallbackQuery(msg.id);
 
});

//Админские 
bot.on('photo', async msg => {
    const id = msg.chat.id;
    const las_mess = await serv.getLastMess(id)
    if(msg.caption){
        const chek = await serv.updateImg(id,msg.photo[3].file_id,msg.photo[3].file_unique_id,msg.photo[3].width,msg.photo[3].height,1)
        if(chek){
            return bot.sendMessage(id, 'Готово');
        }
    }else{
        const chek = await serv.updateImg(id,msg.photo[3].file_id,msg.photo[3].file_unique_id,msg.photo[3].width,msg.photo[3].height,0)
        if(chek){
            return bot.sendMessage(id, 'Теперь пришлите мне ЗАГОЛОВОК вашего товара',{ask:'addTitle'});
        }else{
            return bot.sendMessage(id, `Укажите ваш размер одежды (S,M,L..)`,{ask:'size'});        
        }
    }
});

bot.on('ask.addTitle', async msg => {
    const id = msg.from.id;
    const text = String(msg.text)
    const chek = await serv.updateTite(id,text)
    if(chek){
        return bot.sendMessage(id, 'Теперь пришлите мне ОПИСАНИЕ вашего товара. Используйте теги html для стилизации',{ask:'addDescription'});
    }

});
bot.on('ask.addDescription', async msg => {
    const id = msg.from.id;
    const text = String(msg.text)
    const chek = await serv.updateDescription(id,text)
    if(chek){
        return bot.sendMessage(id, 'Теперь пришлите мне ЦЕНУ вашего товара',{ask:'addPrice'});
    }

});
bot.on('ask.addPrice', async msg => {
    const id = await msg.from.id;
    const text = Number(msg.text)
    const chek = await serv.updatePrice(id,text)
    if(chek){
        const data = await serv.getTestItem(id)
        const photoArr = [data.fId,data.fUnicId,data.w,data.h]
        const but = await bt.adminItems(bot)
        await bot.sendMessage(id, 'Взгляните на ваш получившийся товар');
        return bot.sendPhoto(msg.from.id,photoArr , {caption:`<b>${data.title}</b>\n\n${data.description}\n\n<b>Цена: ${data.price} руб.</b>`, parseMode: 'html', replyMarkup:but}).then(async re => {await serv.updateLastMess(re.chat.id,re.message_id)})    
    }

});


bot.on('ask.hello_text', async msg => {
    const id = msg.from.id;
    const text = String(msg.text)
    await db.insert('config',{name:'hello_text',text});
    // Ask user age
    return bot.sendMessage(id, `Окей, вот несколько комманд для администратора :\n/addItem - Добавить товар\n/addAdminUser - Добавить администратора(id) что бы узнать id  напишите /myid\n/dellAdminUser - Забрать права администратора\n/dellItem - Удалить товар\n\n Теперь напишите или нажмите на : /start`);

});
//Пользовательские
bot.on('ask.size', msg => {
    const id = msg.chat.id;
    return bot.sendMessage(id, `Укажите ваш контактный номер телефона для связи`,{ask:'contact'});     


});
bot.on('ask.contact', async msg => {
    const id = msg.chat.id;
    const crButton = await bt.end(bot)
    const las_mess = await serv.getLastMess(id)
    await bot.deleteMessage(id,msg.message_id)
    await bot.deleteMessage(id,msg.message_id-1)
    await bot.deleteMessage(id,msg.message_id-2)
    await bot.deleteMessage(id,msg.message_id-3)
    await bot.deleteMessage(id,msg.message_id-4)
    return await bot.editMessageCaption({chatId:id,messageId:las_mess}, {caption:`Мы свяжемся с вами в ближайшее время для согласования некоторых моментов`, replyMarkup: crButton});        

});


// Остальное
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