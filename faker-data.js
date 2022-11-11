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

const USER = generateUser();

const generatePlaylist = () => ({
    playlistID: faker.datatype.uuid(),
    image: faker.image.imageUrl(),
    userId: faker.datatype.uuid(),
    likes: Math.floor(Math.random() * 500),
});

const PLAYLISTS = [generatePlaylist(), generatePlaylist(), generatePlaylist()];

const generateFriendActivity = () => ({
    userId: faker.datatype.uuid(),
    avatar: faker.internet.avatar(),
    lastOnline: faker.date.past(),
});

const FRIENDSACTIVITY = [generateFriendActivity(), generateFriendActivity()];

const generateActivity = () => ({
    time: faker.date.past(),
    type: faker.datatype.string(),
    data: faker.datatype.json(),
});

const ACTIVITY = [
    generateActivity(),
    generateActivity(),
    generateActivity(),
    generateActivity(),
];

const SEARCHRESULT = {
    results: faker.datatype.json(),
};

export const data = {
    USER,
    PLAYLISTS,
    FRIENDSACTIVITY,
    ACTIVITY,
    SEARCHRESULT,
};