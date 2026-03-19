// User related types

export interface User {
    "bio": string,
    "email": string,
    "friends": User[],
    "handle": string,
    "id": number,
    "isBot": boolean,
    "isWizarding": boolean,
    "firstName": string,
    "lastName": string,
    "pfp": string
}

export interface UserRegistration {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

// Single use types
export interface Notification {
    id: number,
    body: string,
    timeSent: string,
    title: string
}


// Post related types

export interface Post {
    "body": string,
    "attachedImages": [],
    "user": User,
    "id": number
}

