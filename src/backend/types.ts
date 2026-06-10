// User related types

export interface User {
    bio: string,
    email: string,
    friends: User[],
    handle: string,
    id: number,
    isBot: boolean,
    isWizarding: boolean,
    firstName: string,
    lastName: string,
    pfp: string,
    isSetup: boolean,
}

export interface UserRegistration {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

export interface FriendRequest {
        sender: User,
        receiver: User,
        status: string,
        id: number
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
    "attachedMedia": [],
    "user": User,
    "id": number,
    "likedBy": number[]
}

export interface ThreadCreateRequest {
    handles: string[],
    tittle: string
}

export enum ThreadType {
    DM="DM", GC="GC"
}

export interface Thread {
    owner: User,
    otherMembers: User[],
    title: string,
    threadType: ThreadType,
    id: number
}

// WebSocket Types
export interface WebSocketMessageRequest {
    threadId: number;
    content: string;
    attachmentUrls: string[];
}

export interface WebSocketMessageResponse {
    id: number;
    threadId: number;

    senderId: number;
    senderHandle: string;

    content: string;
    attachmentUrls: string[];

    timestamp: string;

    edited: boolean;
}

export interface TypingIndicator {
    threadId: number;
    userId: number;
    handle: string;
    isTyping: boolean;
}

export interface ThreadMemberUpdate {
    threadId: number;
    userId: number;
    handle: string;
    action: "JOINED" | "LEFT";
}