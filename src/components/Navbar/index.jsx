import { Flex, HStack, Text } from '@chakra-ui/react';
import { ConnectButton } from 'web3uikit';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import ABI from '@constants/IdentityIssuer.json';
import CONTRACT_ADDRESS from '@constants/IdentityIssuerAddress.json';
import { useNotification } from 'web3uikit';

import NextLink from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { isWeb3Enabled } = useMoralis();
  const dispatchNotification = useNotification();
  const router = useRouter();

  const { runContractFunction: whoami, error } = useWeb3Contract({
    abi: ABI,
    contractAddress: CONTRACT_ADDRESS,
    functionName: 'whoami'
  });

  useEffect(() => {
    if (isWeb3Enabled && !['/register', '/'].includes(router.pathname) ) {
      whoami({
        onError: () => {
          dispatchNotification({
            type: 'warning',
            message: 'Please register continuing!',
            title: 'Register',
            position: 'topR'
          });
          router.push('/register');
        }
      });
    } else if (!isWeb3Enabled && router.pathname !== '/') {
      dispatchNotification({
        type: 'warning',
        message: 'Please connect your wallet!',
        title: 'Connect Wallet',
        position: 'topR'
      });
      router.push('/');
    }
  }, [isWeb3Enabled, router.pathname]);

  return (
    <Flex justifyContent="space-between" p={10} alignItems="center">
      {/* <Heading color="blue.900">Meta Talan</Heading> */}
      <HStack gap={5}>
        <Link href="/">Home</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/metadata">Look Up</Link>
        <Link href="/register">Register</Link>
      </HStack>
      <ConnectButton moralisAuth={false} />
    </Flex>
  );
}

const Link = ({ href, children }) => (
  <NextLink href={href} passHref>
    <Text
      pos="relative"
      color="blue.900"
      fontSize="lg"
      transition="all 0.2s ease-in-out"
      _after={{
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '50%',
        height: '1px',
        width: '0',
        backgroundColor: 'blue.400',
        transition: 'all 0.2s ease-in-out'
      }}
      _hover={{
        color: 'blue.400',
        cursor: 'pointer',
        transform: 'scale(1.1)',
        _after: {
          left: '0',
          width: '100%'
        }
      }}
    >
      {children}
    </Text>
  </NextLink>
);
