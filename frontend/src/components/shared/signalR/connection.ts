import * as signalR from "@microsoft/signalr";

export const createChatConnection = (guestId: string) => {
    const url = `${process.env.NEXT_PUBLIC_URL_API_HUB}/chatHub?guestId=${guestId}`;

    return new signalR.HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect()
        .build();
};