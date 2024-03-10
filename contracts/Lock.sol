// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Convo {
    // string[] public allGroupChats;
    uint256 public groupID;
    mapping(address => uint256[]) public userChats;
    mapping(uint256 => groupChat) public idToChat;

    struct groupChat {
        string name;
        uint256 timeCreated;
        uint256 people;
        string[] vaults;
    }

    function createChat(
        string[] calldata firstVault,
        string calldata _name
    ) public {
        // require(firstVault.length == 1, "VL1");
        idToChat[groupID] = groupChat(
            _name,
            block.timestamp,
            firstVault.length,
            firstVault
        );
        groupID = groupID + 1;
    }

    function joinChat(string calldata myVault, uint256 desiredID) public {
        if (desiredID >= groupID) {
            revert("group chat does not exist");
        }
        idToChat[desiredID].vaults.push(myVault);
        idToChat[desiredID].people++;
        userChats[msg.sender].push(desiredID);
    }

    function leaveChat(uint256 desiredID) public {
        if (desiredID >= groupID) {
            revert("group chat does not exist");
        }

        // Remove the chat from the user's list of chats
        bool isRemoved = false;
        for (uint i = 0; i < userChats[msg.sender].length; i++) {
            if (userChats[msg.sender][i] == desiredID && !isRemoved) {
                userChats[msg.sender][i] = userChats[msg.sender][
                    userChats[msg.sender].length - 1
                ];
                userChats[msg.sender].pop();
                isRemoved = true;
            }
        }

        if (!isRemoved) {
            revert("User is not in the chat");
        }

        // Decrease the number of people in the chat
        idToChat[desiredID].people--;
    }
}
