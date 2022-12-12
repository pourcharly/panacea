const DoctorFactory = artifacts.require("DoctorFactory");

module.exports = (deployer) => {
    deployer.deploy(DoctorFactory);
} 