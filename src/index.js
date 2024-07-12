import Fastify from 'fastify';
import dotenv from 'dotenv';
import Database from './db.js';
import customerRoutes from './routes/customers.js';

dotenv.config();

const fastify = Fastify({});
const isTestEnv = process.env.NODE_ENV === 'test';

const startServer = async () => {
  if (!isTestEnv && !process.env.DB_NAME) {
    console.error('[error]: Por favor, defina a variável de ambiente DB_NAME antes de executar o aplicativo!');
    process.exit(1);
  }

  const db = new Database();

  try {
    await db.connect();
    console.log('Conectado ao banco de dados com sucesso');
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }

  fastify.register(customerRoutes, { db });

  fastify.addHook('onClose', async () => {
    console.log('Servidor fechado!');
    await db.disconnect();
  });

  if (!isTestEnv) {
    try {
      await fastify.listen({ port: process.env.PORT || 9999, host: '::' });
      console.log(`Servidor está rodando na porta ${process.env.PORT || 9999}`);
    } catch (err) {
      console.error('Erro ao iniciar o servidor:', err);
      process.exit(1);
    }
  }
};

startServer();

export const server = fastify;
