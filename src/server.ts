import { fastify } from "fastify";
import { prisma } from "./lib/prisma";

const app = fastify()

app.get('/', () => {
    return 'Hello World'
})

app.get('/prompts', async () => {
    const prompts = await prisma.prompt.findMany({})
    
})

app.listen({
    port: 3333,
}).then(() => {
    console.log('Server on')
})