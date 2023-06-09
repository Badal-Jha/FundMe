import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BigNumber, ethers } from "ethers";

import { useStateContext } from "../context";
import { CountBox, CustomButton, Loader } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb } from "../assets";

const CampaignDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { donate, getDonations, contract, address, withdraw, voteCampaign } =
        useStateContext();

    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [donators, setDonators] = useState([]);
    const [showApprove, setShowApprove] = useState(false);

    const remainingDays = daysLeft(state.deadline);

    const fetchDonators = async () => {
        const data = await getDonations(state.pId);
        console.log(data, "donators");
        const id = BigNumber.from(state.id).toNumber();

        const obj = JSON.parse(localStorage.getItem(id));
        const contributors = data.map((d) => {
            let a = {
                address: d.donator,
                isApprove: false,
            };
            return a;
        });
        obj.contributors = contributors;
        localStorage.setItem(id, JSON.stringify(obj));
        setDonators(data);
    };

    useEffect(() => {
        if (contract) fetchDonators();
    }, [contract, address, showApprove]);

    const handleDonate = async () => {
        setIsLoading(true);

        const id = BigNumber.from(state.id).toNumber();
        await donate(state.pId, id, amount);
        setShowApprove(true);
        setIsLoading(false);
        // navigate("/");
    };

    const handleVote = async () => {
        // setIsLoading(true);
        const id = BigNumber.from(state.id).toNumber();
        await voteCampaign(id, address);
        const obj = JSON.parse(localStorage.getItem(id));
        obj.contributors.forEach((d) => {
            console.log(address, ": ", d.address)
            if (address == d.address) {
                d.isApprove = true;
            }
        });

        localStorage.setItem(id, JSON.stringify(obj));
        setShowApprove(false);
        // navigate("/");
        // setIsLoading(false);
    };

    const handleWithdraw = async () => {
        setIsLoading(true);
        await withdraw(state.pId);
        navigate("/");
        setIsLoading(false);
    };

    const id = BigNumber.from(state.id).toNumber();
    const voters = JSON.parse(localStorage.getItem(id)).voters.length - 1;
    console.log(voters)

    return (
        <div>
            {isLoading && <Loader />}

            <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
                <div className="flex-1 flex-col">
                    <img
                        src={state.image}
                        alt="campaign"
                        className="w-full h-[410px] object-cover rounded-xl"
                    />
                    <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
                        <div
                            className="absolute h-full bg-[#4acd8d]"
                            style={{
                                width: `${calculateBarPercentage(
                                    state.target,
                                    state.amountCollected
                                )}%`,
                                maxWidth: "100%",
                            }}
                        ></div>
                    </div>
                </div>

                <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
                    <CountBox title="Days Left" value={remainingDays} />
                    <CountBox
                        title={`Raised of ${state.target}`}
                        value={state.amountCollected}
                    />
                    <CountBox title="Total Backers" value={donators.length} />
                </div>
            </div>

            <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                <div className="flex-[2] flex flex-col gap-[40px]">
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Creator
                        </h4>

                        <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                            <div>
                                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                                    {state.owner}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Story
                        </h4>

                        <div className="mt-[20px]">
                            <p className="font-epilogue font-normal text-[16px] text-[#fff] opacity-70 ] leading-[26px] text-justify">
                                {state.description}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Donators
                        </h4>

                        <div className="mt-[20px] flex flex-col gap-4">
                            {donators.length > 0 ? (
                                donators.map((item, index) => (
                                    <div
                                        key={`${item.donator}-${index}`}
                                        className="flex justify-between items-center gap-4"
                                    >
                                        <p className="font-epilogue font-normal text-[16px] text-[#fff] opacity-90 leading-[26px] break-ll">
                                            {index + 1}. {item.donator}
                                        </p>
                                        <p className="font-epilogue font-normal text-[16px] text-[#fff] opacity-70 ] leading-[26px] break-ll">
                                            {item.donation}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="font-epilogue font-normal text-[16px] text-[#fff] opacity-70 ] leading-[26px] text-justify">
                                    No donators yet. Be the first one!
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                            Approvers Count
                        </h4>

                        <div className="mt-[20px] flex flex-col gap-4">
                            {voters > 0 ? (
                                <div className="flex justify-between items-center gap-4"
                                >
                                    <p className="font-epilogue font-normal text-[16px] text-[#fff] opacity-90 leading-[26px] break-ll">
                                        {voters}
                                    </p>
                                </div>
                            ) : (
                                <p className="font-epilogue font-normal text-[16px] text-[#fff] opacity-70 ] leading-[26px] text-justify">
                                    No approvers yet. Be the first one!
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    {showApprove && (
                        <CustomButton
                            btnType="button"
                            title="Approve Campaign"
                            styles="w-full bg-[#49B265]"
                            handleClick={handleVote}
                        />
                    )}
                    {calculateBarPercentage(state.target, state.amountCollected) < 100 ||
                        state.owner !== address ? (
                        <div className="mt-[20px] flex flex-col p-4 bg-[#13131a] rounded-[10px]">
                            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#fff] opacity-70 ]">
                                Fund the campaign
                            </p>
                            <div className="mt-[30px]">
                                <input
                                    type="number"
                                    placeholder="ETH 0.1"
                                    step="0.01"
                                    className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />

                                <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                                    <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                                        Back it because you believe in it.
                                    </h4>
                                    <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#fff] opacity-70 ]">
                                        Support the project for no reward, just because it speaks to
                                        you.
                                    </p>
                                </div>

                                <CustomButton
                                    btnType="button"
                                    title="Fund Campaign"
                                    styles="w-full bg-[#49B265]"
                                    handleClick={handleDonate}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="mt-[20px] flex flex-col p-4 bg-[#13131a] rounded-[10px]">
                            <CustomButton
                                btnType="button"
                                title="Withdraw"
                                styles={`w-full bg-[#49B265]`}
                                handleClick={handleWithdraw}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;
