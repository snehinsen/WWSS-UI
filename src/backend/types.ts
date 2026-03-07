// User related types

export interface User {
    "bio": string,
    "email": string,
    "friends": User[],
    "handle": string,
    "id": number,
    "isBot": boolean,
    "isWizarding": boolean,
    "name": string,
    "pfp": string
}

export interface UserRegistration {
    name: string,
    email: string,
    password: string,
}

// Single use types
export interface UserHandle {
    handle: string;
}

// Post related types

export interface Post {
    "body": string,
    "attachedImages": [],
    "user": User,
    "id": number
}

