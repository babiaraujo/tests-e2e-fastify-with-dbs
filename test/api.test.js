import { describe, beforeEach, before, after, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';
import { runSeed } from '../config/seed.js';
import { users } from '../config/users.js';
import { server } from '../src/index.js';

describe('API Workflow', () => {
    let testServer;
    let testServerAddress;

    before(async () => {
        testServer = await server;
        testServerAddress = await testServer.listen();
    });

    beforeEach(async () => {
        await runSeed();
    });

    after(async () => {
        await testServer.close();
    });

    async function createCustomer(customer) {
        const response = await testServer.inject({
            method: 'POST',
            url: `${testServerAddress}/customers`,
            payload: customer,
        });
        return response;
    }

    async function getCustomers() {
        const response = await testServer.inject({
            method: 'GET',
            url: `${testServerAddress}/customers`,
        });
        return response;
    }

    async function validateUsersListOrderedByName(usersSent) {
        const response = await getCustomers();
        const { statusCode, result } = response;
        const expectedSortedByName = usersSent.sort((a, b) => a.name.localeCompare(b.name));
        deepStrictEqual(statusCode, 200);
        deepStrictEqual(result, expectedSortedByName);
    }

    describe('POST /customers', () => {
        it('should create customer', async () => {
            const input = {
                name: 'Senhor Pink Floyd',
                phone: '12123456789',
            };
            const expected = `Usuário ${input.name} criado!`;
            const { body } = await createCustomer(input);
            deepStrictEqual(body, expected);
            await validateUsersListOrderedByName([...users, input]);
        });
    });

    describe('GET /customers', () => {
        it('should retrieve only initial users', async () => {
            await validateUsersListOrderedByName(users);
        });

        it('given 5 different customers it should have valid list', async () => {
            const customers = [
                { name: 'Itachi Uchiha', phone: '123456789' },
                { name: 'Naruto Uzumaki', phone: '123456789' },
                { name: 'Mashle', phone: '123456789' },
                { name: 'Pokemon', phone: '123456789' },
                { name: 'Sasuke Uchiha', phone: '123456789' },
            ];
            await Promise.all(customers.map(customer => createCustomer(customer)));
            await validateUsersListOrderedByName(users.concat(customers));
        });
    });
});
