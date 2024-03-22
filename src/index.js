import Fastify from 'fastify';
import { getDb } from './db.js';

const fastify = Fastify({});
const isTestEnv = process.env.NODE_ENV === 'test';

if (!isTestEnv && !process.env.DB_NAME) {
    console.error('[error*****]: Por favor, defina a variável de ambiente DB_NAME antes de executar o aplicativo!');
    process.exit(1);
}

const { dbClient, collections: { dbUsers } } = await getDb().catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
});

fastify.get('/customers', async (request, reply) => {
    const users = await dbUsers
        .find({})
        .project({ _id: 0 })
        .sort({ name: 1 })
        .toArray()
        .catch(err => {
            console.error('Erro ao buscar clientes:', err);
            reply.code(500).send('Erro ao buscar clientes');
        });

    return reply.code(200).send(users);
});

fastify.post('/customers', {
    schema: {
        body: {
            type: 'object',
            required: ['name', 'phone'],
            properties: {
                name: { type: 'string' },
                phone: { type: 'string' },
            },
            additionalProperties: false,
        },
        response: {
            201: {
                type: 'string',
            },
        },
    },
}, async (request, reply) => {
    const user = request.body;
    await dbUsers.insertOne(user).catch(err => {
        console.error('Erro ao adicionar cliente:', err);
        reply.code(500).send('Erro ao adicionar cliente');
    });
    return reply.code(201).send(`Usuário ${user.name} criado!`);
});

fastify.addHook('onClose', async () => {
    console.log('Servidor fechado!');
    return dbClient.close();
});

if (!isTestEnv) {
    fastify.listen(process.env.PORT || 9999, '::').then(server => {
        console.log(`Servidor está rodando em ${server}`);
    }).catch(err => {
        console.error('Erro ao iniciar o servidor:', err);
        process.exit(1);
    });
}

export const server = fastify;
