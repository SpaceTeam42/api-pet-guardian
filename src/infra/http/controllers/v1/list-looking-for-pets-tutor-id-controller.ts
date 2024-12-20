import { FastifyReply, FastifyRequest } from 'fastify';

import { z as zod } from 'zod';

export async function listLookingForPetsTutorIdControllet(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listLookingForPetsQueryParamsSchema = zod.object({
    searchParam: zod.string().optional().nullable(),
    page: zod.string().optional().nullable(),
    perPage: zod.string().optional().nullable(),
    isFound: zod.string().optional().nullable(),
    // enabled: zod.string().optional().nullable(),
  });

  const { searchParam, page, perPage, isFound } =
    listLookingForPetsQueryParamsSchema.parse(request.query);
}
