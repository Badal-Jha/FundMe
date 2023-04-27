// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(campaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        if(sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    function withdrawFunds(uint256 _campaignID) public {
        // <-- only available for Campaign creator, if funds were fully raised

        Campaign storage campaign = campaigns[_campaignID];
        require(campaign.campaignID != 0, "Campaign does not exist.");
        require(
            campaign.amountCollected >= campaign.raisingGoal,
            "Campaign goal has not been reached."
        ); // <-- check fund goal
        require(
            msg.sender == campaign.owner,
            "Only the campaign creator can withdraw funds."
        ); // <-- check caller's adress, fail if not owner

        uint256 commission = (campaign.amountCollected * 5) / 100; // <-- calculate comission
        uint256 withdrawalAmount = campaign.amountCollected - commission; // <-- calculate withdrawalAmount
        (bool sent, ) = campaign.owner.call{value: withdrawalAmount}(""); // <-- withdraw funds only for called Campaign, returns 'sent' on success
        require(sent, "ETH Withdrawal failed"); // <-- if no 'sent', return an error

        (bool commissioned, ) = deployer.call{value: commission}(""); // <-- same but for comission
        require(commissioned, "Commission transfer failed");

        delete campaigns[_campaignID]; // <-- remove our withdrawn Campaign from our mapping storage
    }
}
