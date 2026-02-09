export interface Post {
    "body": string,
    "attachedImages": [],
    "user": User,
    "id": number
}

export interface User {
    "bio": string,
    "email": string,
    "friends": number[],
    "handle": string,
    "id": number,
    "isBot": boolean,
    "isWizarding": boolean,
    "name": string,
    "password": "",
    "pfp": string
}

export interface Comment {
    id: number,
    body: string,
    username: string,
}