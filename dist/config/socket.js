"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketSever = void 0;
const SocketSever = (socket) => {
    // console.log(socket.id + " connected")
    socket.on('online', function (data) {
        if (data.iduser !== undefined) {
            socket.join(data.iduser);
            console.log({ online: socket.adapter.rooms });
        }
    });
    socket.on('offline', (data) => {
        socket.leave(data.iduser);
        console.log({ offline: socket.adapter.rooms });
    });
    socket.on("disconnect", () => {
        console.log(socket.id + " disconnect");
    });
};
exports.SocketSever = SocketSever;
