import io from 'socket.io-client';

export const socket = io('http://localhost:4242');

socket.on('connect', () => {
    console.log('Connected!');
});

export function registerAsPatientSoket (secuNum: string) {
    return new Promise<boolean>((resolve, reject) => {
        socket.emit('registerPatient', secuNum, () => {
            resolve(true);
        });
    });
}

export function registerAsProfessionalSocket(address: string) {
    return new Promise<boolean>((resolve, reject) => {
        socket.emit('registerProfessional', address, () => {
            resolve(true);
        });
    })
}

export const isPatientSocketConnected = (secuNum: string) => {
    return new Promise<boolean>((resolve, reject) => {
        socket.emit('isPatientConnected', secuNum, (isConnected: boolean) => {
            resolve(isConnected);
        });
    });
};