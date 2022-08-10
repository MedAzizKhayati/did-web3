import { Container, Heading, Text, Input, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';

import ABI from '@constants/IdentityIssuer.json';
import CONTRACT_ADDRESS from '@constants/IdentityIssuerAddress.json';

import { useNotification } from 'web3uikit';
import { useRouter } from 'next/router';
import handleTxSuccess from '@utils/handleTxSuccess';
import handleTxError from '@utils/handleTxError';

export default function Register() {
  const { isWeb3Enabled } = useMoralis();
  const [name, setName] = useState('');
  const dispatchNotification = useNotification();
  const router = useRouter();

  const { runContractFunction: register } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'register'
  });

  const { runContractFunction: whoami } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'whoami'
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      whoami({
        onSuccess: () => {
          dispatchNotification({
            type: 'warning',
            message: 'You are already signed up!',
            title: 'Already registered',
            position: 'topR',
            icon: 'bell'
          });
          router.push('/profile');
        }
      });
    }
  }, [isWeb3Enabled]);

  const handleRegister = () => {
    if (!(name && isWeb3Enabled)) return;
    async function register_() {
      await register({
        params: {
          params: {
            _user: {
              name
            }
          }
        },
        onSuccess: handleSuccess,
        onError: handleTxError(dispatchNotification)
      });
    }
    register_();
  };

  const handleNewNotification = () => {
    dispatch({
      type: 'info',
      message: 'Transaction Complete!',
      title: 'Transaction Notification',
      position: 'topR',
      icon: 'bell'
    });
  };

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleTxSuccess(
      dispatchNotification,
      'You have been successfully registered!'
    )(tx);
    router.push('/profile');
  };

  return (
    <Container pt={20}>
      <Heading fontSize="2xl" mb={20}>
        Register
      </Heading>

      <Text fontWeight="bold">Name: </Text>
      <Input
        onChange={(ev) => setName(ev.target.value)}
        variant="flushed"
        mb={20}
        placeholder="John Doe"
        size="lg"
      />

      <Button onClick={handleRegister} colorScheme="orange" size="lg">
        Register
      </Button>
    </Container>
  );
}
