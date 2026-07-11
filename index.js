const bedrock = require('bedrock-protocol');
const express = require('express');

// 1. تشغيل سيرفر الويب لـ Render لمنع توقف البوت
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('البوت يعمل ومستمر في تشغيل السيرفر!');
});

app.listen(PORT, () => {
  console.log(`سيرفر الويب يعمل بنجاح على المنفذ: ${PORT}`);
});

// 2. إعدادات اتصال البيدروك المتقدمة لتخطي الـ Timeout
const botOptions = {
  // استخدم الـ Dyn IP المباشر الذي أرسلته بدون تغيير
  host: 'danio.aternos.host', 
  port: 49435, 
  username: 'Bedrock_AFK_Bot',
  offline: true,               // إجباري لسيرفرات أترنوس المكركة
  
  // حل المشكلة: إجبار المكتبة على تخطي مرحلة الـ Ping التي يحظرها Render
  skipPing: true,              
  
  // قم بكتابة إصدار Minecraft البيدروك الخاص بسيرفرك هنا (مثال: '1.21.0')
  // إذا لم تكن متأكداً، اتركها '1.20.80' أو الإصدار الحالي لسيرفرك في أترنوس
  version: '1.26.32.2'            
};

function startBot() {
  console.log('جاري الاتصال المباشر عبر بروتوكول البيدروك (بدون Ping)...');
  
  try {
    const client = bedrock.createClient(botOptions);

    client.on('spawn', () => {
      console.log(`[نجاح] البوت دخل السيرفر الآن واستقر في العالم!`);
    });

    client.on('text', (packet) => {
      console.log(`[شات السيرفر] ${packet.source_name}: ${packet.message}`);
    });

    client.on('close', (reason) => {
      console.log(`انقطع الاتصال. السبب: ${reason}. إعادة المحاولة بعد 20 ثانية...`);
      setTimeout(startBot, 20000);
    });

    client.on('error', (err) => {
      console.error('[خطأ بالاتصال]:', err.message);
    });

  } catch (error) {
    console.error('فشل تشغيل العميل المباشر:', error.message);
  }
}

// بدء التشغيل
startBot();
