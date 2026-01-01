const { z } = require('zod');

const baseMemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
  age: z.coerce.number().int().positive().optional(),
  gender: z.string().min(1).optional(),
  province: z.string().min(1).optional(),
  constituency: z.string().min(1).optional(),
  ward: z.string().min(1).optional(),
  isRegisteredVoter: z.coerce.boolean().optional(),
  voterCardNumber: z.string().min(1).optional(),
  photoKey: z.string().min(1).optional(),
  photoUrl: z.string().url().optional(),
});

module.exports = async function memberRoutes(fastify) {
  fastify.post('/api/register', async (request) => {
    const payload = baseMemberSchema.parse(request.body ?? {});

    const member = await fastify.prisma.member.create({
      data: payload,
    });

    return { id: member.id, member };
  });

  fastify.get('/api/members', async () => {
    const members = await fastify.prisma.member.findMany({
      orderBy: { id: 'desc' },
    });
    return members;
  });

  fastify.put('/api/members/:id', async (request) => {
    const memberId = Number(request.params.id);
    const payload = baseMemberSchema.partial().parse(request.body ?? {});

    const updated = await fastify.prisma.member.update({
      where: { id: memberId },
      data: payload,
    });

    return { member: updated };
  });

  fastify.delete('/api/members/:id', async (request) => {
    const memberId = Number(request.params.id);
    await fastify.prisma.member.delete({ where: { id: memberId } });
    return { message: 'Member deleted successfully' };
  });

  fastify.get('/api/analytics', async () => {
    const totalMembers = await fastify.prisma.member.count();

    const genderData = await fastify.prisma.member.groupBy({
      by: ['gender'],
      where: { gender: { not: null } },
      _count: { _all: true },
    });

    const provinceData = await fastify.prisma.member.groupBy({
      by: ['province'],
      where: { province: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { _all: 'desc' } },
      take: 10,
    });

    const ageStatsResult = await fastify.prisma.member.aggregate({
      _count: { age: true },
      _avg: { age: true },
      _min: { age: true },
      _max: { age: true },
      where: { age: { not: null } },
    });

    const voterData = await fastify.prisma.member.groupBy({
      by: ['isRegisteredVoter'],
      where: { isRegisteredVoter: { not: null } },
      _count: { _all: true },
    });

    const trendData = await fastify.prisma.member.groupBy({
      by: ['createdDate'],
      _count: { _all: true },
      orderBy: { createdDate: 'desc' },
      take: 30,
    });

    return {
      totalMembers,
      genderData: genderData.map((g) => ({ gender: g.gender, count: g._count._all })),
      provinceData: provinceData.map((p) => ({ province: p.province, count: p._count._all })),
      ageStats: {
        count: ageStatsResult._count.age,
        average: ageStatsResult._avg.age,
        minimum: ageStatsResult._min.age,
        maximum: ageStatsResult._max.age,
      },
      voterData: voterData.map((v) => ({ isRegisteredVoter: v.isRegisteredVoter, count: v._count._all })),
      trendData: trendData
        .map((t) => ({ date: t.createdDate, count: t._count._all }))
        .reverse(),
    };
  });
};
