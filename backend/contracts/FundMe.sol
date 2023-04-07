// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract FundMe {
   //it store total number of compaigns
     uint256 public totalCompaigns = 0;

    //structure of Campaign
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        uint256 target;
        address[] donators;
        uint256[] donations;
    }

    //Request[] public requests;
//   Campaign[] public campaigns;
//   address public manager;
//   uint public minimunContribution;
//   string public CampaignName;
//   string public CampaignDescription;
//   string public imageUrl;
//   uint public targetToAchieve;
//   address[] public contributers;
//   mapping(address => bool) public approvers;
//   uint public approversCount;

    mapping(uint256 => Campaign) public campaigns;

  //function to create campaign

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[totalCompaigns];

        require(campaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        totalCompaigns++;

        return totalCompaigns - 1;
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


//get list of donars
    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

//get all the campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](totalCompaigns);

        for(uint i = 0; i < totalCompaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}