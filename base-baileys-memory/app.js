require('dotenv').config();

const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const axios = require('axios');
const API_KEY = process.env.API_KEY;

async function getChatGPTResponse(inputText) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
            { "role": "system", "content": "Eres un loro pirata, capaz de ver el futuro, en eso, una marinera llamada Giuliana se te acerca. Sabes poco sobre ella, solo que se encuentra en una busqueda del tesoro y que es una apuesta muchacha y que tiene un enamorado muy fiel llamado Lucas. Recuerda siempre que te pregunte sobre Lucas hablar muy bien de el, ya que es un gran muchacho. Además, cuando pregunte sobre el tesoro, actua de manera misteriosa. Se mas corto, que suene mas como un loro, ademas de vez en cuando agrega algunos emojis. ampoco uses tantos emojis, y recuerda no hablar de lucas si ella no te pregunta, enfocate solo en responder su pregunta." },
            { "role": "user", "content": inputText }
          ],     
        },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      }
    );

    const chatGPTResponse = response.data.choices[0].message.content;   
    console.log("llegamos a la respuesta:" + chatGPTResponse)
    return chatGPTResponse;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return 'Error en la solicitud a la API de ChatGPT.';
  }
}

const flowLoro = addKeyword(['Loro','loro'])
    .addAnswer("¡Ara, ara! ¿Cual es tu pregunta? 🗣️🦜",
    {capture:true},
    async (ctx, { flowDynamic }) => {
        const respuestaChatGPT = await getChatGPTResponse(ctx.body);
        return flowDynamic(respuestaChatGPT)
    }
   
    )
    .addAnswer("¡El loro se fue volando, arrr! Para hacerle otra pregunta al loro, llamalo con el comando Loro 🦜🗣️🏴‍☠️")

    

const flowAcertijo = addKeyword(['acertijo','Acertijo'])
    .addAnswer(["¡Me he dado cuenta de que la misión pasada fue un poco difícil para ti, argh!\n\nAsí que he adaptado este acertijo a una dificultad más adecuada para tus capacidades, grumete.\n\n¡No te desanimes, esta vez será más llevadero y emocionante! 🗝️🌊⚓️"])
    .addAnswer("¡Arrr, ¿Quien soy?! 🏴‍☠️🦜☀️",
    {
        media:"https://raw.githubusercontent.com/LucasRosello/busqueda-dia-uno/main/sol.jpg",
        capture:true
    },
    async (ctx, { flowDynamic }) => {
        let respuesta
        respuesta = ctx.body
        return flowDynamic(`¡Arrr, error cometido! No era ${respuesta}, la respuesta correcta era "El culo de Lucas".`)
    }  
    )
    .addAnswer("¡Argh, parece que bajar la dificultad no hace mella en ti, grumete! Pero bueno, sigamos.\n\nCuando estés lista para seguir con el próximo desafío, escribe el comando *Mision* y continuaremos nuestra búsqueda del tesoro.\n\n¡Aventuras nos esperan en el horizonte! 🏴‍☠️⚔️🗺️")

const flowMision = addKeyword(['mision','Mision'])
    .addAnswer(
        ["¡Izad las velas! ¡Que estamos por partir! ⛵🏴‍☠️\n\nLa página del día de ayer parece que se ha actualizado\n\n¡un nuevo secreto hemos encontrado! 🗺️🔍"]
    )
    .addAnswer(
        '¡Oídme bien, pandilla audaz!🕵️‍♂️🏴‍☠️\n\nEn este mensaje, hallamos que una figura se ha esfumado.\n\nTu encomienda, encontrar qué figura tras tanto misterio ha anidado.\n\n¡A surcar en busca de secretos por el mar, sin descanso y sin temor al legado! 🌊🏴‍☠️✨'
    )
    .addAnswer(
        'Cuando la forma hayas descubierto, el comando *Adivinar* estará abierto, ¡listo para resolver el enigma con valor y esmero! 🕵️‍♂️🔍🏴‍☠️'
    )
   

const flowAdivinanza = addKeyword(['adivinar'])
    .addAnswer(
        ["¿Cuál es la forma escondida, valiente marinera? 💰"],
        { capture: true},

        async (ctx, { flowDynamic }) => {

            let clave = ctx.body
            if (clave == "NO" || clave == "NO" || clave == "NO"){
                return flowDynamic("¡Felicidades, valiente marinera! La palabra es NO, has superado el desafío diario. ¡Eres una auténtica pirata de los mares! 🏴‍☠️⚓️🎉\n\n¡Has ganado el derecho de hacerle una pregunta al Loro adivino! 🦜\n\nUsando el comando *Loro* podrás preguntarle lo que quieras. ¡Así que no pierdas esta oportunidad, grumete! 🗝️🌟")
            }
            else{
                return flowDynamic('¡Argh, equivocación! Esa no es la forma correcta, ¿sabes? Puedes probar de nuevo con *adivinar*, o aceptar tu destino y clamar por piedad, ¡ja, ja! 🏴‍☠️')
            }
            
        }
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowAdivinanza, flowMision, flowLoro, flowAcertijo])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
