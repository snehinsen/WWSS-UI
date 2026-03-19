import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Notification, Post, User, UserRegistration} from "./types.ts";


const api: AxiosInstance = axios.create({
    baseURL: "https://wwss.sanjaysen.me/api/",
    withCredentials: true,
});

if (import.meta.env.DEV) {
    console.log("DEV");
    api.defaults.headers.common['Authorization'] = 'Basic ' + btoa('admin@wwss.ai:password')
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
    return response.data;
}

export async function update(handle: string, bloodType: string): Promise<boolean> {
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

export async function addFriend(username: string): Promise<boolean> {
    return await api.post(
        "friends/add?username=" + username
    );
}

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