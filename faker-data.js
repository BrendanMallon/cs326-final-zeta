import { faker } from "@faker-js/faker";

faker.seed(123);

const generateUser = () => ({
    userId: faker.datatype.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
});

const user = generateUser();

export const data = {
    user: user,
};
