import { io } from "socket.io-client";

const SOCKET_URL = "https://api.loschanchitos.masdiseno.com/api";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});