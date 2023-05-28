import { Box, Button, Flex, FormControl, Input, Text } from "@chakra-ui/react";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { useState } from "react";
import {
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { Props } from "../pages";
import { TokenOptions, tokenOptions } from "../utils";
import TokenSelect from "./TokenSelect";

const Interface = ({ ethPrice }: Props) => {
  const [selectedToken, setSelectedToken] = useState(tokenOptions[0]);
  const address = "0xbBc9161Dbf83992953dAAD477646A00b040E6f1A"; //DepositPool.sol contract address that will receive the funds
  const subAmount = "5"; //amount to be paid in USD, here we're simulating it's for a subscription and hardcoding it but you can bring it from props.

  const priceInEth = (Number(subAmount) / ethPrice).toFixed(6).toString(); //converting the amount in USD to ETH

  const handleTokenChange = (value: TokenOptions) => {
    setSelectedToken(value); //change selected token
  };

  //Pay with custom token (USDC) https://wagmi.sh/docs/hooks/useContractWrite
  const { config: configWrite } = usePrepareContractWrite({
    address: selectedToken.value, //Goerli USDC contract address
    abi: erc20ABI, //Standard ERC-20 ABI https://www.quicknode.com/guides/smart-contract-development/what-is-an-abi
    functionName: "transfer", //We're going to use the tranfer method provided in the ABI, here's an example of a standard transfer method https://docs.ethers.io/v5/single-page/#/v5/api/contract/example/
    args: [address, parseUnits(subAmount, 6)], //[receiver, amount] Note that the units to parse are six because that's the number of decimals set for USDC in its contract. In order to add another token with a different amount of decimals its necessary to add additional logic here for it to work.
  });
  const { data: dataWrite, write } = useContractWrite(configWrite);

  //Pay with ether https://wagmi.sh/docs/prepare-hooks/usePrepareSendTransaction
  const { config } = usePrepareSendTransaction({
    request: {
      to: address,
      value: parseEther(priceInEth), // parse the ETH amount to make it readable for the Ethereum Virtual Machine --- https://docs.ethers.io/v4/api-utils.html
    },
  });

  //https://wagmi.sh/docs/hooks/useSendTransaction
  const { data, sendTransaction } = useSendTransaction(config);

  //Wait for payment to be completed https://wagmi.sh/docs/hooks/useWaitForTransaction
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash || dataWrite?.hash, //transaction hash
  });

  return (
    <Box
      w="30rem"
      mx="auto"
      mt="1.25rem"
      boxShadow="rgb(0 0 0 / 8%) 0rem 0.37rem 0.62rem"
      borderRadius="1.37rem"
      bg="#ffffff"
      pb={5}
      pl={1}
    >
      <Flex
        alignItems="center"
        p="1rem 1.25rem 0.5rem"
        color="rgb(86, 90, 105)"
        justifyContent="space-between"
        borderRadius="1.37rem 1.37rem 0 0"
      >
        <Flex color="black" fontWeight="500">
          <Text ml={1}>1 ETH = USD {ethPrice}</Text>
        </Flex>
      </Flex>
      <Box p="0.5rem" borderRadius="0 0 1.37rem 1.37rem">
        <Flex>
          <Box>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                selectedToken.value ? write?.() : sendTransaction?.();
              }}
            >
              <FormControl>
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  bg="#f7f8fa"
                  pos="relative"
                  p="1rem 1rem 1.7rem"
                  borderRadius="1.25rem"
                  border="0.06rem solid rgb(237, 238, 242)"
                  _hover={{ border: "0.06rem solid rgb(211,211,211)" }}
                >
                  <Text color="black">To:</Text>
                  <Input
                    color="black"
                    aria-label="Recipient"
                    value={address}
                    fontSize="1.1rem"
                    fontWeight="500"
                    width="100%"
                    size="1rem"
                    textAlign="right"
                    outline="none"
                    border="none"
                    focusBorderColor="none"
                  />
                </Flex>
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  bg="#f7f8fa"
                  pos="relative"
                  p="1rem 1rem 1.7rem"
                  borderRadius="1.25rem"
                  mt="0.25rem"
                  border="0.06rem solid rgb(237, 238, 242)"
                  _hover={{ border: "0.06rem solid rgb(211,211,211)" }}
                >
                  <Input
                    fontSize="36px"
                    width="100%"
                    size="19rem"
                    textAlign="left"
                    outline="none"
                    border="none"
                    focusBorderColor="none"
                    color="black"
                    aria-label="Amount"
                    value={selectedToken.value ? subAmount : priceInEth}
                  />
                  <Box
                    w={215}
                    boxShadow="rgb(0 0 0 / 8%) 0rem 0.37rem 0.62rem"
                    borderRadius="1.37rem"
                    bg="#bca7ca"
                  >
                    <TokenSelect
                      selectedToken={selectedToken}
                      tokenOptions={tokenOptions}
                      handleTokenChange={handleTokenChange}
                    />
                  </Box>
                </Flex>
                <Box mt="0.5rem" padding={1} maxH="3rem">
                  <Button
                    disabled={isLoading || isSuccess}
                    type={"submit"}
                    color="white"
                    bg="#bca7ca"
                    width="100%"
                    p="1.62rem"
                    borderRadius="1.25rem"
                    _hover={{
                      bg: "white",
                      color: "#bca7ca",
                      border: "2px",
                      borderColor: "#bca7ca",
                    }}
                    fontSize="1.5rem"
                  >
                    {isLoading ? "Sending Payment..." : "Send Payment"}
                  </Button>
                </Box>
              </FormControl>
            </form>
          </Box>
        </Flex>
        {isSuccess && (
          <Flex color="black" mt={7} mb={7} textAlign="center">
            Successfully paid {selectedToken.value ? subAmount : priceInEth}{" "}
            {selectedToken.label} to {address}
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Interface;
