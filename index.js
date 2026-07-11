const bedrock = require('bedrock-protocol');
const express = require('express');
const settings = require('./settings.json');

// 1. تشغيل سيرفر ويب خفيف متوافق مع Render لمنع توقف الخدمة
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('البوت يعمل بنجاح ومستمر في تشغيل السيرفر!');
});

app.listen(PORT, () => {
  console.log(`سيرفر الويب يعمل على المنفذ: ${PORT}`);
});

// 2. إعدادات اتصال البوت بالسيرفر (Bedrock)
const botOptions = {
  host: settings.ip,
  port: parseInt(settings.port),
  username: settings.botName,
  offline: true // إجباري: لأن سيرفرات أترنوس تستخدم وضع Cracked للبوتات
};

function startBot() {
  console.log('جاري الاتصال بسيرفر أترنوس بيدروك...');
  const client = bedrock.createClient(botOptions);

  client.on('spawn', () => {
    console.log(`[نجاح] البوت ${botOptions.username} دخل السيرفر الآن!`);
  });

  client.on('text', (packet) => {
    // عرض شات السيرفر في الكونسول لمراقبة الوضع
    console.log(`[Chat] ${packet.source_name}: ${packet.message}`);
  });

  client.on('close', (reason) => {
    console.log(`تم الفصل بسبب: ${reason}. جاري إعادة المحاولة بعد 20 ثانية...`);
    setTimeout(startBot, 20000); // إعادة اتصال تلقائي في حال ريستارت السيرفر
  });

  client.on('error', (err) => {
    console.error('حدث خطأ في الاتصال:', err.message);
  });
}

// تشغيل البوت
startBot();
