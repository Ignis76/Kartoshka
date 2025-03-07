const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');




const app = express();
const port = 3000;

const TELEGRAM_BOT_TOKEN = '7270514856:AAHBjJUSkKTgpkNFt6Kb7o26oCAmchicDW0'; // Замени на свой токен
const TELEGRAM_CHAT_ID = '631057960'; // Замени на свой Chat ID

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Раздача статических файлов (index.html и т.д.)

// Отдаём главную страницу
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Обработка заказа
app.post('http://ch41555.tw1.ru:3000/order', (req, res) => {
    console.log('Получен запрос на /order:', req.body); // Логирование входящих данных
    res.json({ message: 'Заказ получен' });
});

app.post('/order', async (req, res) => {
    const { phone, cart } = req.body;
    if (!phone || !cart || cart.length === 0) {
        return res.status(400).json({ message: 'Некорректные данные' });
    }

    let orderText = `📦 Новый заказ!\n📞 Телефон: ${phone}\n`;
    cart.forEach(item => {
        orderText += `🍡 ${item.product} x${item.quantity} — ${item.price * item.quantity} BYN\n`;
    });
    orderText += '\n💰 Общая сумма: ' + cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + ' BYN';

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: orderText,
            parse_mode: 'Markdown'
        });
        res.json({ message: 'Заказ отправлен!' });
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});



app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
