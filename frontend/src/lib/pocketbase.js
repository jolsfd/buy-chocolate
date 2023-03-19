import PocketBase from "pocketbase";
import { writable } from "svelte/store";

// connect to backend
export const pb = new PocketBase(import.meta.env.VITE_ORIGIN)

// store for admins
export const currentAdmin = writable(pb.authStore.model)

pb.authStore.onChange((auth) => {
    console.log("auth store changed",auth)
    currentAdmin.set(pb.authStore.model)
})

export const cfStore = writable("default")

let cfToken = "";

cfStore.subscribe(value => {
    cfToken = value
})

// hook to send turnstile token in response
pb.beforeSend = function(url, reqConfig){
    console.log(url)
    if (url.indexOf("/api/collections/chocolate/records") > -1 && reqConfig.method == "POST"){
        console.log("Api hitted 🎯")

        const raw = JSON.parse(reqConfig.body)
        raw["cf-turnstile-response"] = cfToken
        reqConfig.body = JSON.stringify(raw)
        console.log("Injected turnstile token 🤖", cfToken)

        //console.log(reqConfig.body)
    }
    return { url, reqConfig };
}