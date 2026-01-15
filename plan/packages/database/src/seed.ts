import { prisma } from ".";

import type { User } from "@prisma/client";

const DEFAULT_USERS = [
    {
        name: "Tim Apple",
        password: "123456",
        email: "1997roylee@gmail.com",
    } as User,
] as Array<Partial<User>>;

(async () => {
    try {
        await Promise.all(
            DEFAULT_USERS.map((user) =>
                prisma.user.upsert({
                    where: {
                        email: user.email!,
                    },
                    update: {
                        ...user,
                    },
                    create: {
                        name: user.name!,
                        password: user.password!,
                        email: user.email!,
                    },
                })
            )
        );
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})();
