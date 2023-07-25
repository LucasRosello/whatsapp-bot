const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;

// Verificar si ya existe una sesión guardada
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

// Crear una instancia del cliente de WhatsApp
const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });

// Evento cuando el código QR esté listo para ser escaneado
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Escanee el código QR con su teléfono para iniciar sesión.');
});

// Evento cuando se inicie la sesión
client.on('authenticated', (session) => {
  console.log('Autenticado');
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

// Evento cuando el cliente esté listo
client.on('ready', () => {
  console.log('El cliente está listo');
});

// Evento para recibir mensajes
client.on('message', (msg) => {
  if (msg.body === 'Hola') {
    msg.reply('¡Hola! ¿En qué puedo ayudarte?');
  }
});

// Iniciar el cliente
client.initialize();
