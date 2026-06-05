import axios, {AxiosInstance, AxiosResponse} from "axios";
import {
    FriendRequest,
    Notification,
    Post,
    Thread,
    ThreadMemberUpdate,
    TypingIndicator,
    User,
    UserRegistration,
    WebSocketMessageRequest,
    WebSocketMessageResponse
} from "./types.ts";
import {Client, IMessage} from "@stomp/stompjs";
// @ts-ignore
import SockJS from "sockjs-client";

const WEBSOCKET_URL = "https://wwss.sanjaysen.me/ws"

const api: AxiosInstance = axios.create({
    baseURL: "https://wwss.sanjaysen.me/api/",
    withCredentials: true,
});

if (import.meta.env.DEV) {
    console.log("DEV");
    api.defaults.headers.common['Authorization'] =
        'Basic ' + btoa('admin@wwss.ai:password')
} else {
    console.log("PROD");
}


// User

export async function register(user: UserRegistration) {
    const response: AxiosResponse<boolean> = await api.post("user/signup", user);
    setTimeout(() => {
        if (!response.data) {
            window.location.href = "/signup?error=true";
        } else {
            window.location.href = "/setup";
        }
    }, 2000);

}

export async function getUsers(filter: string): Promise<User[]> {
    const response: AxiosResponse<User[]> = await api.get(`user/search?q=${filter}`);
    return response.data;
}

export async function checkHandle(handle: string): Promise<boolean> {
    const status: AxiosResponse<boolean> = await api.get(`user/handleCheck?handle=${handle}`);
    return status.data;
}

export async function getUser(): Promise<User> {
    const response: AxiosResponse<User> = await api.get(`user`);
    const user: User = response.data;
    user.friends = await api.get(`/friends/list/${user.handle}`).then((friends: AxiosResponse<User[]>): User[] => friends.data);

    return user;
}

export async function getFriendRequests(): Promise<FriendRequest[]> {
    const response: AxiosResponse<FriendRequest[]> = await api.get(`/friends/requests`);
    return response.data;
}

export async function getFriendRequest(user: string): Promise<FriendRequest> {
    const response: AxiosResponse<FriendRequest> = await api.get(`/friends/check?handle=${user}`);
    return response.data;
}

export async function sendFriendRequests(handle: string): Promise<boolean> {
    const response: AxiosResponse<boolean> = await api.get(`/friends/send?handle=${handle}`);
    return response.data;
}

export async function acceptFriendRequests(requestID: number): Promise<boolean> {
    const response: AxiosResponse<boolean> = await api.get(`/friends/accept?id=${requestID}`);
    return response.data;
}

export async function declineFriendRequests(requestID: number): Promise<boolean> {
    const response: AxiosResponse<boolean> = await api.get(`/friends/decline?id=${requestID}`);
    return response.data;
}

export async function removeFriend(handle: string): Promise<boolean> {
    const response: AxiosResponse<boolean> = await api.delete(`/friends/rm?handle=${handle}`);
    return response.data;
}

export async function configure(handle: string, bloodType: string): Promise<boolean> {
    const response: AxiosResponse<boolean> = await api.post("user/configure", {
        handle: handle,
        isWizarding: bloodType !== "m"
    });

    return response.data;
}


export async function uploadProfilePicture(file: File): Promise<boolean> {
    const formData = new FormData();
    formData.append("file", file);
    const response: AxiosResponse<boolean> = await api
        .post(
            "/user/pfp",
            formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

    return response.data;
}

export async function getProfile(username: string): Promise<User> {
    if (username != null) {
        console.log(`Getting user: ${username}`);
        const response: AxiosResponse<User> = await api.get(
            "user/" + username
        );
        const user: User = response.data;
        user.friends = await api.get(`/friends/list/${username}`).then((friends: AxiosResponse<User[]>): User[] => friends.data);
        return user;
    } else {
        throw new Error("Username is null");
    }
}

export async function getUserById(id: number): Promise<User> {
    if (id != null) {
        console.log(`Getting user: ${id}`);
        const response: AxiosResponse<User> = await api.get(
            "user/id/" + id
        );
        const user: User = response.data;
        user.friends = await api.get(`/friends/list/${id}`).then((friends: AxiosResponse<User[]>): User[] => friends.data);
        return user;
    } else {
        throw new Error("Username is null");
    }
}


export async function getProfileById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await api.get(
        "user/id/" + id
    );
    return response.data;
}

// Posts and media

export async function getFeed() {
    console.log("Getting feed...");
    const response: AxiosResponse<Post[]> = await api.get("post/feed");
    console.log(response.status);
    return response.data;
}

export async function createPost(body: string) {
    console.log("Posting...");
    const response: AxiosResponse<boolean> = await api.post(
        "/post/add?body=" + encodeURIComponent(body)
    );

    return response.data;
}

export async function getUserPosts(name: string) {
    const response: AxiosResponse<Post[]> = await api.get(`post/user/${name}`);
    return response.data || [];
}

export async function deletePost(id: number) {
    console.log("Deleting...");
    const res: AxiosResponse<boolean> = await api.delete(
        `/post/${id}`
    );

    return res.data;
}

// comments

export async function getPostComments(id: number): Promise<Post[]> {
    const comments = await api.get(
        "/comment/" + id
    );
    console.log(comments)
    return comments.data;
}

export async function comment(body: string, postId: number): Promise<boolean> {
    console.log("Posting...");
    const res: AxiosResponse<boolean> = await api.post(
        "comment/" + postId + "?body=" + encodeURIComponent(body)
    )
    console.log(res)
    return res.data
}

// friends


// Notification

export async function getNotifications(): Promise<Notification[]> {
    const res: AxiosResponse<Notification[]> = await api.get(
        "notification"
    );

    return res.data;
}

export async function clearNotification(id: number): Promise<boolean> {
    const res: AxiosResponse<boolean> = await api.get(
        `notification/${id}`
    );

    return res.data;
}

export async function clearAll(): Promise<boolean> {
    const res: AxiosResponse<boolean> = await api.get(
        "notification"
    );

    return res.data;
}

// DM
export async function createThread(request: { tittle: string; handles: string[] }): Promise<boolean> {
    console.log(request)
    const response: AxiosResponse<boolean> = await api.post("/dms/create", request);
    return response.data;
}

export async function listThreads(): Promise<Thread[]> {
    const response: AxiosResponse<Thread[]> = await api.get("/dms");
    return response.data;
}

export async function addMembers(tid: number, handles: string[]): Promise<boolean> {
    const response: AxiosResponse<boolean> = await api.post(`/dms/add?threadId=${tid}`, handles);
    return response.data;
}


export async function removeMember(tid: number, uid: number): Promise<boolean> {
    const response: AxiosResponse<boolean> = await api.delete(`/dms/rm?threadId=${tid}&userId=${uid}`);
    return response.data;
}

export async function leaveThread(tid: number): Promise<boolean> {
    const response: AxiosResponse<boolean> = await api.delete(`/dms/leave?threadId=${tid}`);
    return response.data;
}

export async function deleteThread(tid: number): Promise<boolean> {
    const response: AxiosResponse<boolean> = await api.delete(`/dms/${tid}`);
    return response.data;
}

// WebSocket

let stompClient: Client | null = null;

const threadSubscriptions: Map<number, any> = new Map();

const messageListeners: ((message: WebSocketMessageResponse) => void)[] = [];
const typingListeners: ((typing: TypingIndicator) => void)[] = [];
const memberListeners: ((member: ThreadMemberUpdate) => void)[] = [];
const errorListeners: ((error: any) => void)[] = [];

export function connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {

        if (stompClient?.connected) {
            resolve();
            return;
        }

        stompClient = new Client({
            webSocketFactory: () => new SockJS(WEBSOCKET_URL),

            reconnectDelay: 5000,

            debug: (str) => {
                console.log("[STOMP]", str);
            },

            onConnect: () => {
                console.log("WebSocket connected");

                // User-specific errors
                stompClient?.subscribe("/user/queue/errors", (message: IMessage) => {
                    const parsed = JSON.parse(message.body);

                    errorListeners.forEach((listener) => listener(parsed));
                });

                resolve();
            },

            onStompError: (frame) => {
                console.error("Broker reported error:", frame.headers["message"]);
                console.error("Additional details:", frame.body);
            },

            onWebSocketError: (event) => {
                console.error("WebSocket error", event);
                reject(event);
            },

            onDisconnect: () => {
                console.log("WebSocket disconnected");
            }
        });

        stompClient.activate();
    });
}

export function disconnectWebSocket() {
    threadSubscriptions.forEach((subscription) => {
        subscription.unsubscribe();
    });

    threadSubscriptions.clear();

    stompClient?.deactivate();
    stompClient = null;
}


export async function connectToChat(threadId: number) {

    await connectWebSocket();

    if (!stompClient?.connected) {
        throw new Error("WebSocket not connected");
    }

    // Prevent duplicate subscriptions
    if (threadSubscriptions.has(threadId)) {
        return;
    }

    const subscription = stompClient.subscribe(
        `/topic/thread/${threadId}`,
        (message: IMessage) => {

            const data = JSON.parse(message.body);

            console.log("Thread Event:", data);

            // Message
            if (data.content !== undefined) {
                messageListeners.forEach((listener) => {
                    listener(data as WebSocketMessageResponse);
                });
            }

            // Typing indicator
            else if (data.isTyping !== undefined) {
                typingListeners.forEach((listener) => {
                    listener(data as TypingIndicator);
                });
            }

            // Member update
            else if (data.action !== undefined) {
                memberListeners.forEach((listener) => {
                    listener(data as ThreadMemberUpdate);
                });
            }
        }
    );

    threadSubscriptions.set(threadId, subscription);

    // Notify backend user joined
    stompClient.publish({
        destination: "/app/joinThread",
        body: JSON.stringify({
            threadId: threadId
        })
    });

    console.log(`Connected to thread ${threadId}`);
}

export function disconnectFromChat(threadId: number) {

    const subscription = threadSubscriptions.get(threadId);

    if (subscription) {
        subscription.unsubscribe();
        threadSubscriptions.delete(threadId);
    }

    stompClient?.publish({
        destination: "/app/leaveThread",
        body: JSON.stringify({
            threadId: threadId
        })
    });

    console.log(`Disconnected from thread ${threadId}`);
}


export function sendMessage(
    threadId: number,
    content: string,
    attachmentUrls: string[] = []
) {

    if (!stompClient?.connected) {
        throw new Error("WebSocket not connected");
    }

    const payload: WebSocketMessageRequest = {
        threadId,
        content,
        attachmentUrls
    };

    stompClient.publish({
        destination: "/app/sendMessage",
        body: JSON.stringify(payload)
    });
}

export function sendTypingIndicator(
    threadId: number,
    isTyping: boolean
) {

    if (!stompClient?.connected) {
        return;
    }

    stompClient.publish({
        destination: "/app/typing",
        body: JSON.stringify({
            threadId,
            isTyping
        })
    });
}


export async function getLiveThreadContent(
    threadId: number
): Promise<WebSocketMessageResponse[]> {

    const response: AxiosResponse<WebSocketMessageResponse[]> =
        await api.post(
            `/messages/history?threadId=${threadId}`
        );

    return response.data;
}

export async function editMessage(
    messageId: number,
    newContent: string
): Promise<boolean> {

    const response: AxiosResponse<boolean> =
        await api.post(
            `/messages/edit?messageId=${messageId}&newContent=${encodeURIComponent(newContent)}`
        );

    return response.data;
}

export async function deleteMessage(
    messageId: number
): Promise<boolean> {

    const response: AxiosResponse<boolean> =
        await api.post(
            `/messages/delete?messageId=${messageId}`
        );

    return response.data;
}


export function onMessage(
    callback: (message: WebSocketMessageResponse) => void
) {
    messageListeners.push(callback);
}

export function onTyping(
    callback: (typing: TypingIndicator) => void
) {
    typingListeners.push(callback);
}

export function onMemberUpdate(
    callback: (member: ThreadMemberUpdate) => void
) {
    memberListeners.push(callback);
}

export function onWebSocketError(
    callback: (error: any) => void
) {
    errorListeners.push(callback);
}