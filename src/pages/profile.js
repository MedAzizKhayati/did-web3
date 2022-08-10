import { Box, Text, Heading, Input, Button, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import IDENTITY_ABI from '@constants/Identity.json';
import ABI from '@constants/IdentityIssuer.json';
import ADDRESS from '@constants/IdentityIssuerAddress.json';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import handleTxSuccess from '@utils/handleTxSuccess';
import handleTxError from '@utils/handleTxError';
import { useNotification } from 'web3uikit';

export default function Profile() {
  const { isWeb3Enabled, account } = useMoralis();
  const [values, setValues] = useState({ name: '' });
  const [did, setDid] = useState('');
  const [formData, setFormData] = useState([]);
  const dispatchNotification = useNotification();

  const { runContractFunction: whoami } = useWeb3Contract({
    abi: ABI,
    contractAddress: ADDRESS,
    functionName: 'whoami'
  });

  const { runContractFunction: getName } = useWeb3Contract({
    abi: IDENTITY_ABI,
    functionName: 'getName'
  });

  const { runContractFunction: setNameDid } = useWeb3Contract({
    abi: IDENTITY_ABI,
    functionName: 'setName'
  });

  const { runContractFunction: setMetaData } = useWeb3Contract({
    abi: IDENTITY_ABI,
    functionName: 'setMetadata'
  });

  useEffect(() => {
    if (!isWeb3Enabled) return;
    async function setup() {
      const did = await whoami({ params: { params: [account] } });
      setDid(did);
    }
    setup();
  }, [isWeb3Enabled, account]);

  useEffect(() => {
    if (!did) return;
    async function getName_() {
      const name = await getName({ params: { contractAddress: did } });
      setValues((v) => ({ ...v, name }));
    }
    getName_();
  }, [did]);

  useEffect(() => {
    setFormData([
      {
        label: 'Name',
        placeholders: ['John Doe'],
        button: 'Set Name',
        onClick: async () => {
          if (!(values.name && did && isWeb3Enabled)) return;
          async function setName_() {
            await setNameDid({
              params: {
                contractAddress: did,
                params: { _name: values?.name }
              },
              onSuccess: handleTxSuccess(dispatchNotification, 'Name set'),
              onError: handleTxError(dispatchNotification)
            });
          }
          setName_();
        },
        onChange(e) {
          setValues((v) => ({ ...v, name: e.target.value }));
        },
        keys: ['name']
      },
      {
        label: 'MetaData',
        placeholders: ['Key', 'Value'],
        button: 'Set MetaData',
        onClick: async () => {
          if (!(values.key && values.value && did && isWeb3Enabled)) return;
          async function setMetaData_() {
            await setMetaData({
              params: {
                contractAddress: did,
                params: { _k: values?.key, _v: values?.value }
              },
              onSuccess: handleTxSuccess(dispatchNotification, 'MetaData set'),
              onError: handleTxError(dispatchNotification)
            });
          }
          setMetaData_();
        },
        onChange(e) {
          setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
        },
        keys: ['key', 'value']
      },
      {
        label: 'Grant Write Access',
        placeholders: ['Key', '0x0000...'],
        button: 'Grant'
      },
      {
        label: 'Revoke Read Access',
        placeholders: ['Key', '0x0000...'],
        button: 'Revoke'
      }
    ]);
  }, [values]);

  return (
    <Box p={20} pt={10}>
      <Heading textAlign="center" mb={20}>
        PROFILE
      </Heading>
      {formData.map((form, index) => (
        <Flex
          key={index}
          mb={20}
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontWeight="bold" fontSize="xl" flex={1}>
            {form.label}
          </Text>
          <Flex flex={1} gap={5}>
            {form.placeholders.map((placeholder, index) => (
              <Input
                key={index}
                variant="flushed"
                placeholder={placeholder}
                size="lg"
                onChange={form.onChange}
                value={form?.keys?.[index] && values[form.keys[index]]}
                name={form?.keys?.[index]}
              />
            ))}
          </Flex>
          <Flex flex={1} justifyContent="flex-end">
            <Button
              w={40}
              size="lg"
              colorScheme="orange"
              onClick={form.onClick}
            >
              {form.button}
            </Button>
          </Flex>
        </Flex>
      ))}
    </Box>
  );
}
