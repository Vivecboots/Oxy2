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
import { Select } from "@chakra-ui/react";


const Interface = ({ ethPrice }: Props) => {
  const [selectedToken, setSelectedToken] = useState(tokenOptions[0]);
  const [amount, setAmount] = useState(""); // Add state to handle input amount
  const address = "0xbBc9161Dbf83992953dAAD477646A00b040E6f1A"; //DepositPool.sol contract address that will receive the funds

  const fixedConversionRate = 100; // Set the fixed conversion rate for testing

  const priceInEth = (Number(amount || "0") * fixedConversionRate).toFixed(2).toString();



  const handleTokenChange = (value: TokenOptions) => {
    setSelectedToken(value); //change selected token
  };

  //Pay with custom token (USDC)
  const { config: configWrite } = usePrepareContractWrite({
    address: selectedToken.value,
    abi: erc20ABI,
    functionName: "transfer",
    args: [address, parseUnits(amount || "0", 2)],

  });
  const { data: dataWrite, write } = useContractWrite(configWrite);

  //Pay with ether
  const { config } = usePrepareSendTransaction({
    request: {
      to: address,
      value: parseEther(amount || "0"),
    },
  });

  const { data, sendTransaction } = useSendTransaction(config);
  
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash || dataWrite?.hash,
  });

  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [input5, setInput5] = useState("");

  const [selectedTime, setSelectedTime] = useState("");

  const generateTimeOptions = () => {
    let times = [];
    for(let i = 0; i < 24; i++) {
      for(let j = 0; j < 2; j++) {
        let hour = i < 10 ? `0${i}` : `${i}`;
        let minute = j === 0 ? '00' : '30';
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  }
  


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

        <Flex>
        <Button
  onClick={() => {
    setAmount("");
  }}
>
  <a href="https://mumbai.polygonscan.com/address/0xbBc9161Dbf83992953dAAD477646A00b040E6f1A">Discover the Contract DepositPool.sol</a>
</Button>

        </Flex>
      </Flex>
      <Box p="0.5rem" borderRadius="0 0 1.37rem 1.37rem">
        <Flex>
          <Box>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedToken.value) {
                  const parsedAmount = parseUnits(amount || "0", 6);
                  write?.({ args: [address, parsedAmount] });
                } else {
                  const parsedAmount = parseEther(priceInEth || "0");
                  sendTransaction?.({ value: parsedAmount });
                }
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
                  border="0.06rem solid rgb
                  (237, 238, 242)"
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} // Added onChange handler to update 'amount'
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
    aria-label="Input 2"
    value={input2}
    onChange={(e) => setInput2(e.target.value)} // Added onChange handler to update 'input3'
    placeholder="Enter your text here" // Added placeholder attribute
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
    aria-label="Input 3"
    value={input3}
    onChange={(e) => setInput3(e.target.value)} // Added onChange handler to update 'input3'
    placeholder="Minimum # Users in Pool" // Added placeholder attribute
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
    aria-label="Input 3"
    value={input3}
    onChange={(e) => setInput4(e.target.value)} // Added onChange handler to update 'input3'
    placeholder="Token Entry Max Limit" // Added placeholder attribute
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
    aria-label="Input 3"
    value={input3}
    onChange={(e) => setInput5(e.target.value)} // Added onChange handler to update 'input3'
    placeholder="# of Blocks to Test" // Added placeholder attribute
  />


  
</Flex>

<Select
  placeholder="Choose Time Today to Test First Block"
  value={selectedTime}
  onChange={(e) => setSelectedTime(e.target.value)}
>
  {generateTimeOptions().map((time, index) => (
    <option key={index} value={time}>
      {time}
    </option>
  ))}
</Select>
              </FormControl>
            </form>
          </Box>
        </Flex>
        {isSuccess && (
          <Flex color="black" mt={7} mb={7} textAlign="center">
            Successfully paid {amount} {selectedToken.label} to {address}
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default Interface;
