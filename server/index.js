const io = require('socket.io')(4242, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
});

const addressMapping = {};

io.on('connection', (socket) => {
  console.log("user connected");
  let socketAddress = null;

  socket.on('registerPatient', (secuNum, callback) => {
    if (!addressMapping[secuNum]) {
      socketAddress = secuNum;
      addressMapping[socketAddress] = socket;
      socket.broadcast.emit('patientConnect_' + socketAddress);
      console.log('patientConnect_' + socketAddress);
    } else {
      console.error("Patient Allready Registered");
    }
    callback(true);
  });

  socket.on('registerProfessional', (address, callback) => {
    if (!addressMapping[address]) {
      socketAddress = address;
      addressMapping[socketAddress] = socket;
      socket.broadcast.emit('professionalConnect_' + socketAddress);
      console.log('professionalConnect_' + socketAddress);
    } else {
      console.error("Professional Allready Registered");
    }
    callback(true);
  });

  socket.on('isPatientConnected', (secuNum, callback) => {
    callback(!!addressMapping[secuNum]) ;
  });

  socket.on('disconnect', () => {
    if (socketAddress) {
      delete addressMapping[socketAddress];
      socket.broadcast.emit('clientDisconnect_' + socketAddress);
      console.log('clientDisconnect_' + socketAddress);
      socketAddress = null;
    }
  });
});
