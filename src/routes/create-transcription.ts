import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { prisma } from "../lib/prisma";
import { createReadStream } from "node:fs";
import { openai } from "../lib/openai";

export async function createTranscriptionRoute(app: FastifyInstance){
    app.post('/videos/:videoId/transcription', async (request) => {
        const paramsSchema = z.object({
            videoId: z.string().uuid(),
        })

        const { videoId } = paramsSchema.parse(request.params)
        const bodySchema = z.object({
            prompt: z.string()
        })

        const { prompt } = bodySchema.parse(request.body)

        const { path } = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId
            }
        })
        const audioReadStram = createReadStream(path)
        const { text } = await openai.audio.transcriptions.create({
            file: audioReadStram,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt
        })

        await prisma.video.update({
            where: {
                id: videoId
            },
            data: {
                transcription: text
            }
        })
        // return { videoId, prompt, path }
        return { text }
    })
}