//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./PrescriptionNFT.sol";

contract DoctorFactory is Ownable {
    // mapping doctor address => collection address
    mapping (address => address) _doctors;
    mapping (address => bool) _pharmacists;

    event DoctorCreated(string doctorName, address doctorAddress, address collectionAddress, uint timestamp);
    event PrescriptionMinted(string doctorName, address doctorAddress, address patientAddress, uint timestamp);

    /**
    * @notice Deploy the ERC-721 Collection contract of a doctor to be able to create prescription NFTs
    * @dev
    * Requirements:
    *
    * - `doctor` cannot be address 0.
    * - `name` cannot be empty.
    * - `symbol` cannot be empty.
    *
    * @return collectionAddress the address of the created collection contract
    */
    function createDoctorCollection(
        address doctorAddress,
        string memory doctorName,
        string memory doctorInitials
    ) external onlyOwner returns (address collectionAddress) {

        require(doctorAddress != address(0), "address zero is not a valid doctor");
        require(keccak256(abi.encode(doctorName)) != keccak256(abi.encode("")), 'name cannot be empty');
        require(keccak256(abi.encode(doctorInitials)) != keccak256(abi.encode("")), 'symbol cannot be empty');

        bytes memory collectionBytecode = type(PrescriptionNFT).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(doctorName));

        assembly {
            collectionAddress := create2(0, add(collectionBytecode, 0x20), mload(collectionBytecode), salt)
            if iszero(extcodesize(collectionAddress)) {
            // revert if something gone wrong (collectionAddress doesn't contain an address)
            revert(0, 0)
          }
        }
      
        PrescriptionNFT(collectionAddress).init(doctorAddress,doctorName, doctorInitials);

        emit DoctorCreated(doctorName, doctorAddress, collectionAddress, block.timestamp);

        return collectionAddress;
    }

    /**
    * @dev Only doctor can call
    */
    modifier onlyDoctor() {
        require(_doctors[msg.sender] != address(0), "What's up doc ?");
        _;
    }

    function mintPrescription(address patientAddress, string calldata tokenURI) external onlyDoctor {
        require(keccak256(abi.encode(tokenURI)) != keccak256(abi.encode("")), 'URI cannot be empty');
        address contractAddress = _doctors[msg.sender];
        PrescriptionNFT(contractAddress).mintPrescription(msg.sender, patientAddress, tokenURI);

        emit PrescriptionMinted(
            PrescriptionNFT(contractAddress).getDoctorName(),
            msg.sender,
            patientAddress,
            block.timestamp
        );
    }

    /**
    * @notice Add a pharmacist to a dedicated whitelist
    * @dev
    * Requirements:
    *
    * - `pharmacist` cannot be address 0.
    */
    function addPharmacist(address pharmacist) external onlyOwner {
        require(pharmacist != address(0), "address zero is not a valid pharmacist");
        _pharmacists[pharmacist] = true;
    }

    /**
    * @notice Test if address is referenced as pharmacist
    *
    * @return isHe true if is pharmacist
    */
    function isPharmacist(address pharmacist) view external onlyOwner returns(bool isHe) {
        return _pharmacists[pharmacist];
    }

    /**
    * @notice Test if address is referenced as doctor
    *
    * @return isHe true if is doctor
    */
    function isDoctor(address doctor) view external onlyOwner returns(bool isHe) {
        return _doctors[doctor] != address(0);
    }

}