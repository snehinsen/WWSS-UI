// This is the place all API functions will be ported over too over time

import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Post, User} from "./types.ts";


const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8544/api/",
    headers: {
        'Authorization': 'Basic ' + btoa('admin@wwss.ai:password')
    }
});

// User

export interface UserRegistration {
    name: string,
    email: string,
    password: string,
}

export async function register(user: UserRegistration) {
    const response: AxiosResponse<boolean> = await api.post("/user/signup", user);

    if (response.data) {
        window.location.href = "/app/setup";
    } else {
        window.location.href = "/app/signup?error=true";
    }

}

export async function checkHandle(handle: string): Promise<boolean> {
    const status: AxiosResponse<boolean> = await api.get(`/user/handleCheck?handle=${handle}`);
    return status.data;
}

export async function getProfile(username: string): Promise<User> {
    const response: AxiosResponse<User> = await api.get(
        "account/" + username
    );
    return response.data;
}

export async function getProfileById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await api.get(
        "account/id/" + id
    );
    return response.data;
}

// Posts and media

export async function getFeed() {
    console.log("Getting feed...");
    const response: AxiosResponse<Post[]> = await api.get("feed");
    console.log(response.data);
    return response.data;
}


export async function createPost(body: string) {
    console.log("Posting...");
    await api.post(
        "addPost?body=" + encodeURIComponent(body)
    );
}

export async function getPostComments(id: number) {
    const comments = await api.get(
        "getPostComments/" + id
    );
    console.log(comments)
    return comments.data;
}

export async function comment(username: string, body: string, postId: number) {
    await api.post(
        "addComment/" + postId + "&body=" + encodeURIComponent(body) + "&username=" + username
    );
}