// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Fund {
    address public owner;
    Member[] private members;

    struct Member {
        address _address;
        uint _money;
        string _content;
    }

    constructor() {
        owner = msg.sender;
    }

    function Deposit(string memory _content) public payable {
        require(msg.value >= (10**18 * 0.001), "Sorry, minumum value must be 0.001 BNB");
        members.push(Member(msg.sender, msg.value, _content));
    }

    function Withdraw() public {
        require(msg.sender == owner);
        payable(owner).transfer(address(this).balance);
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function counter() public view returns (uint) {
        return members.length;
    }

    function getDetail(uint index) public view returns (address, uint, string memory) {
        return (
            members[index]._address,
            members[index]._money,
            members[index]._content
        );
    }
}