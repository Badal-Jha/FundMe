import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0x8c2C34985920C24Ef52Fdbf9F4415f77e08B22bA');
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    const { mutateAsync: makePayment } = useContractWrite(contract, 'makePayment');

    const address = useAddress();
    const connect = useMetamask();

    const withdraw = async (pId) => {
        const _campaign = await getCampaigns();
        const campaign = _campaign[pId];
        const cid = campaign.id;
        const obj = JSON.parse(localStorage.getItem(cid));
        const voters = obj.voters;
        const numContri = obj.numContributers;
        if (voters.size < numContri / 2 + 1) {
            alert("Unable to withdraw unapproved campaigns")
            return;
        }
        const data = await contract.call('makePayment', [pId], { value: ethers.utils.parseEther(campaign.amountCollected) });
        return data;
    }

    const publishCampaign = async (form) => {
        const id = Date.now();
        try {
            const data = await createCampaign({
                args: [
                    address, //owner
                    form.title,
                    form.description,
                    form.target,
                    new Date(form.deadline).getTime(),
                    form.image,
                    id
                ]
            });
            const obj = {
                id: id,
                numContributers: 0,
                voters: [-1],
                contributors: [-1]
            }
            localStorage.setItem(id, JSON.stringify(obj));
            console.log(JSON.parse(localStorage.getItem(id)));
            console.log("contract call success ", data);
        } catch (error) {
            console.log("contract call failed ", error);
        }
    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i,
            id: campaign.id
        }));
        const filteredCampaigns = parsedCampaigns.filter((campaign) => campaign.title != '' && campaign.deadline >= Date.now());
        return filteredCampaigns;
    }

    const voteCampaign = async (id, address) => {
        const obj = JSON.parse(localStorage.getItem(id));
        const voters = new Set([...obj.voters, address]);
        obj.voters = Array.from(voters);
        console.log(obj.voters)
        localStorage.setItem(id, JSON.stringify(obj));
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();
        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);
        return filteredCampaigns;
    }

    const donate = async (pId, id, amount) => {
        const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount) });
        const obj = JSON.parse(localStorage.getItem(id));
      
        obj.numContributers++;
        localStorage.setItem(id, JSON.stringify(obj));
        return data;
    }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', [pId]);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations;
    }


    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                withdraw,
                voteCampaign
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);
