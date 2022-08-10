import {
  HStack,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  Box
} from '@chakra-ui/react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { useNotification } from 'web3uikit';
import ABI from '@constants/IdentityIssuer.json';
import IDENTITY_ABI from '@constants/Identity.json';
import CONTRACT_ADDRESS from '@constants/IdentityIssuerAddress.json';
import handleTxSuccess from '@utils/handleTxSuccess';
import handleTxError from '@utils/handleTxError';
import { useState } from 'react';

export default function MetaData() {
  const { isWeb3Enabled } = useMoralis();
  const [lookup, setLookup] = useState({ input: '', value: '' });
  const [name, setName] = useState();
  const dispatch = useNotification();

  const { runContractFunction: lookupMetadata } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'lookup'
  });

  const { runContractFunction: getName } = useWeb3Contract({
    abi: IDENTITY_ABI,
    functionName: 'getName'
  });

  const onLookUp = () => {
    if (!(lookup.input && isWeb3Enabled)) return;
    async function lookup_() {
      const address = await lookupMetadata({
        params: {
          params: {
            _user: lookup.input
          }
        },
        onSuccess: handleTxSuccess(dispatch, 'Account found'),
        onError: handleTxError(dispatch)
      });
      setLookup({ ...lookup, value: address });
      const name = await getName({ params: { contractAddress: address } });
      setName(name);
    }
    lookup_();
  };

  return (
    <Box p={20}>
      <Flex mb={20} justifyContent="space-between" alignItems="center">
        <Heading>LOOKUP</Heading>
        <Input
          variant="flushed"
          onChange={(e) => setLookup({ ...lookup, input: e.target.value })}
          w={400}
          placeholder="Enter the DID @Address"
        />
        <Text>
          <strong> DID: </strong>
          {lookup.value || '0x0000...'}
        </Text>
        <Button onClick={onLookUp} size="lg" colorScheme="orange">
          LOOKUP
        </Button>
      </Flex>
      <Flex mb={20} justifyContent="space-between" alignItems="center">
        <Flex>
          <Text fontWeight="bold" mr={10}>
            Name{' '}
          </Text>
          <Text>{name}</Text>
        </Flex>
        <HStack alignItems="center" gap={5}>
          <Text fontWeight="bold">MetaData </Text>
          <Input variant="flushed" placeholder="Key" />
          <Button size="lg" colorScheme="orange">
            GET
          </Button>
          <Box>
            <Text w="max-content"></Text>
          </Box>
        </HStack>
      </Flex>

      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold">SET METADATA</Text>
        <HStack gap={5}>
          <Input variant="flushed" placeholder="Key" />
          <Input variant="flushed" placeholder="Value" />
        </HStack>
        <Button size="lg" colorScheme="orange">
          SET METADATA
        </Button>
      </Flex>
    </Box>
  );
}
