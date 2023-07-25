const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')


let chiste;

const flowLoro = addKeyword(['Loro','loro'])
    .addAnswer("¡Arrr, se me pasó mencionar!\n\nEl loro está echando una siesta en este momento, pero vuelve mañana y podrás interrogarlo a placer 🦜💤⏳.\n\nHay una pequeña nota, no la entendi, pero capaz tu si, marinera *'Se me rompio la integración de mierda con chatGPT, pero ya estoy quemado, mañana la arreglo'*")

const flowMision = addKeyword(['mision','Mision'])
    .addAnswer(
        ["¡Bueno, que empiece la aventura, argh! ¿Estás lista, grumete? 🗺️"],
        { capture: true},
        async (ctx, { flowDynamic }) => {
            return flowDynamic("Mmm, no sonas muy convencida, escoria de tierra...")
        }
        
        
    )
    .addAnswer(
        ["¿En serio estás lista para este desafío, compañera de abordaje? ⚔️"],
        { capture: true},

        async (ctx, { flowDynamic }) => {
            
            chiste = ctx.body
            return flowDynamic(`Como decía mi abuela, los que dicen: *"${chiste}"*, siempre son los más cobardes... Pero bueno, ¡sigamos rumbo a la gloria pirata! 💀`)
        }
    )
    .addAnswer(
        'La misión es sencilla, marinera:\n\nTe voy a mandar una página web y debes encontrar la clave escondida 🔐\n\nhttps://2no.co/2rY7A5\n\nCuando creas haber encontrado la clave, podrás usar el comando *Adivinar*, pero si estás perdida, podrás implorar ayuda a la tripulación, usando el comando *Pista*. 🗺️\n'
 
    )
   

const flowAdivinanza = addKeyword(['adivinar'])
    .addAnswer(
        ["¿Cuál es la clave que abrirá el tesoro oculto, valiente marinera? 💰"],
        { capture: true},

        async (ctx, { flowDynamic }) => {

            let clave = ctx.body
            if (clave == "Bucanero" || clave == "bucanero"){
                return flowDynamic("¡Felicidades, valiente marinera! La palabra es Bucanero, has superado el desafío diario. ¡Eres una auténtica pirata de los mares! 🏴‍☠️⚓️🎉\n\n¡Has ganado el derecho de hacerle una pregunta al Loro adivino! 🦜\n\nUsando el comando *Loro* podrás preguntarle lo que quieras. ¡Así que no pierdas esta oportunidad, grumete! 🗝️🌟")
            }
            else{
                return flowDynamic('¡Argh, equivocación! Esa clave no abre la caja del tesoro, ¿sabes? Puedes probar de nuevo con *adivinar*, o aceptar tu destino y clamar por una *pista*, ¡ja, ja! 🏴‍☠️')
            }
            
        }
    )

    const flowPista = addKeyword(['pista','Pista','Quiero una pista'])
    .addAnswer(
        [
        "¡Primer día y ya pedís pista, escorbuto en tus huesos!\n\n¡Te ira pesimo en esta busqueda del tesoro 🤣!\n\n¡Toma esta ayuda! 🗝️\n", 
        "A simple vista no se puede ver, pero frente a tus ojos, la clave espera, como un tesoro enterrado en la arena de una isla perdida. 🏴‍☠️\n",
        "Cuando creas haber encontrado la clave, usa el comando *Adivinar* 🗺️"
    ],

    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPista, flowAdivinanza, flowMision, flowLoro])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
