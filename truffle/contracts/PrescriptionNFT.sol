//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract PrescriptionNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    // Manage token ids with a counter
    Counters.Counter private _tokenIds;

    // Doctor address allowed to mint prescription NFTs
    address private _doctor;

    // Token name override
    string private _name;

    // Token symbol ooverride
    string private _symbol;

    constructor() ERC721("", "") {}
    

    /**
    * @notice Allow to set token name and symbol by the factory
    *
    * Requirements:
    *
    * - `doctor` 
    * - `name`
    * - `symbol`
    */
    function init(address doctor, string calldata name, string calldata symbol) public onlyOwner {

        _doctor = doctor;
        _name = name;
        _symbol = symbol;
    }

    /**
    * @dev Only doctor can call
    */
    modifier onlyDoctor(address doctorAddress) {
        require(_doctor == doctorAddress, "What's up doc ?");
        _;
    }

    /**
    * @notice mint a prescription to a ppatient address
    * @dev
    * Requirements:
    *
    * - `patientAddress` cannot be the zero address.
    * - `tokenURI` cannot be empty.
    */
    function mintPrescription(address doctorAddress, address patientAddress, string calldata tokenURI) external onlyDoctor(doctorAddress) {
        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();
        _mint(patientAddress, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
    }

    function getDoctorName() external view returns(string memory) {
        return _name;
    }

    /**
    * @dev Trick to block a method of an implemented interface contract : always revert
    */
    modifier blockImplementation() {
        revert("NFNFT means : Non Transferable NFT");
        _;
    }

    /**
    * @notice This NFT collection need the tokens to be non transferables. So we override and block any ERC721 public methods inherited related to transfert feature.
    */
    function approve(address to, uint256 tokenId) public virtual override blockImplementation {}
    function getApproved(uint256 tokenId) public view virtual override blockImplementation returns (address) {}
    function setApprovalForAll(address operator, bool approved) public virtual override blockImplementation {}
    function isApprovedForAll(address owner, address operator) public view virtual override blockImplementation returns (bool) {}
    function transferFrom(address from,address to,uint256 tokenId) public virtual override blockImplementation {}
    function safeTransferFrom(address from,address to,uint256 tokenId) public virtual override blockImplementation {}
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override blockImplementation {}
}