import PusherServer from "pusher";

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
})

export async function triggerMenuUpdate() {
    try {
        await pusherServer.trigger('menu-updates', 'update', { status: 'ok' });
    } catch (error) {
        console.error("Erreur Pusher:", error);
    }
}