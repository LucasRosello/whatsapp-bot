const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')


const flowPista = addKeyword(['Quiero una pista', 'pista'])
    .addAnswer('Dale que no es tan dificil, recorda que podes googlear')

    // const flowString = addKeyword('botones').addAnswer('Este mensaje envia tres botones', {
    //     buttons: [{ body: 'Boton 1' }, { body: 'Boton 2' }, { body: 'Boton 3' }],
    // })
    

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('¡Ahoy y bienvenida a la caza del tesoro, madame Giuli! ¡Argggg! ⚓🏴‍☠️💰')
    .addAnswer(
        [
            '¡A lo largo de los próximos días, recibirás un desafío diario, camarada de abordaje! ⏳🗝️🏴‍☠️\n',
            'Si logras completarlos todos, obtendrás el mapa del tesoro, ¡arrr! 🗺️🏴‍☠️💰',
        ]
    )
    .addAnswer([
        '¡Las reglas son sencillas, arrr!\n',
        'Yo te voy a dar una misión y vos tenés que encontrar la clave secreta.\n',
        'Cuando tengas la clave, me la mandas por chat y si es correcta, ¡has superado el desafío diario!\n',
        '¡Algunos de los desafíos son arduos (o capaz vos sos un poco lenta), por lo que podras pedir una "pista" siempre que necesites, grumete! 🗝️⚓🏴‍☠️'
        ]
    )
    .addAnswer('Alguna pregunta?')
    // .addAnswer('To?', {
    //     buttons: [{ body: 'Telefonos' }, { body: 'Computadoras' }, { body: 'Otros' }],
    // })

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
