# Telegram Shop Bot

Бот-магазин для Telegram на Node.js с поддержкой каталога, корзины и оплаты.

## 🚀 Быстрый старт

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/Daklarens/bottelegram
   cd bottelegram
2. Установите зависимости:
npm install

3. Создайте .env
   
TOKEN=токен_бота
MONGODB=mongodb://localhost:27017
NAMEDB=botdb
PAYCOD=токен_оплаты
PRIVATECOD=секрет_админа

4. npm run dev
   
⚙️ Возможности
/start — старт и главное меню

/addAdminCode <код> — получить права администратора

/addItem — добавить товар (админ)

/dellItem <id> — удалить товар (админ)

Навигация по каталогу, корзина, Telegram-оплата

Приём индивидуальных заказов с фото

🧱 Стек
Node.js + TeleBot

MongoDB

Telegram Payments
