import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  VStack,
  Input,
  Text,
  Flex,
  useColorModeValue,
  IconButton,
  Avatar,
  Heading,
  useToast,
  SlideFade,
  Badge,
  useColorMode
} from '@chakra-ui/react';
import { FiSend, FiMoon, FiSun } from 'react-icons/fi';
import { keyframes } from '@emotion/react';
import { getChatResponse } from './api/openai';

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  // Color mode values
  const bg = useColorModeValue('gray.50', 'gray.900');
  const containerBg = useColorModeValue('whiteAlpha.900', 'gray.800');
  const messageBg = useColorModeValue('blue.50', 'blue.900');
  const assistantBg = useColorModeValue('purple.50', 'purple.900');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const textColor = useColorModeValue('gray.800', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast({
        title: 'エラーが発生しました',
        description: 'メッセージの送信中にエラーが発生しました。もう一度お試しください。',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      minH="100vh" 
      py={4}
      bgGradient={useColorModeValue(
        'linear(to-br, blue.200, purple.200)',
        'linear(to-br, gray.900, purple.900)'
      )}
    >
      <Container maxW="container.md" h="95vh" p={0}>
        <Box
          h="full"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="2xl"
          bg={glassBg}
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor={useColorModeValue('whiteAlpha.300', 'whiteAlpha.100')}
        >
          <VStack h="full" spacing={0}>
            {/* Header */}
            <Box 
              w="full" 
              p={6} 
              borderBottom="1px"
              borderColor={borderColor}
              bg={containerBg}
            >
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Avatar 
                    src="/coach-avatar.png" 
                    name="Mental Coach" 
                    size="md"
                    mr={4}
                    boxShadow="lg"
                    animation={`${floatAnimation} 3s ease-in-out infinite`}
                  />
                  <Box>
                    <Heading 
                      size="lg" 
                      bgGradient="linear(to-r, blue.400, purple.500)" 
                      bgClip="text"
                      letterSpacing="tight"
                    >
                      Mental Coach AI
                    </Heading>
                    <Badge colorScheme="green" mt={1}>オンライン</Badge>
                  </Box>
                </Flex>
                <IconButton
                  icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  colorScheme="purple"
                  aria-label="Toggle color mode"
                />
              </Flex>
            </Box>

            {/* Messages Area */}
            <Box 
              flex={1} 
              w="full" 
              overflowY="auto" 
              p={6}
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: useColorModeValue('#CBD5E0', '#4A5568'),
                  borderRadius: '24px',
                },
              }}
            >
              <VStack spacing={6} align="stretch">
                {messages.length === 0 ? (
                  <SlideFade in={true} offsetY="20px">
                    <Flex 
                      direction="column" 
                      align="center" 
                      justify="center" 
                      h="full"
                      py={10}
                    >
                      <Avatar 
                        src="/coach-avatar.png"
                        name="Mental Coach"
                        size="2xl"
                        mb={6}
                        animation={`${pulseAnimation} 3s infinite`}
                        boxShadow="2xl"
                      />
                      <VStack spacing={3}>
                        <Heading 
                          size="lg" 
                          textAlign="center"
                          bgGradient="linear(to-r, blue.400, purple.500)"
                          bgClip="text"
                        >
                          メンタルコーチAIへようこそ
                        </Heading>
                        <Text 
                          fontSize="lg" 
                          textAlign="center" 
                          color={textColor}
                          maxW="md"
                        >
                          あなたの心の声に耳を傾け、より良い未来への道筋を一緒に見つけていきましょう。
                          お気軽にお話しください。
                        </Text>
                      </VStack>
                    </Flex>
                  </SlideFade>
                ) : (
                  messages.map((message, index) => (
                    <SlideFade in={true} key={index} offsetY="20px">
                      <Flex
                        justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                        w="full"
                      >
                        {message.role === 'assistant' && (
                          <Avatar
                            src="/coach-avatar.png"
                            name="Mental Coach"
                            size="sm"
                            mr={3}
                            boxShadow="md"
                          />
                        )}
                        <Box
                          maxW="70%"
                          p={4}
                          borderRadius="2xl"
                          bg={message.role === 'user' ? messageBg : assistantBg}
                          boxShadow="lg"
                          _hover={{ transform: 'translateY(-2px)' }}
                          transition="all 0.3s ease"
                        >
                          <Text fontSize="md" color={textColor}>{message.content}</Text>
                        </Box>
                        {message.role === 'user' && (
                          <Avatar
                            name="User"
                            size="sm"
                            ml={3}
                            bg="blue.500"
                            boxShadow="md"
                          />
                        )}
                      </Flex>
                    </SlideFade>
                  ))
                )}
                <div ref={messagesEndRef} />
              </VStack>
            </Box>

            {/* Input Area */}
            <Box 
              w="full" 
              p={6} 
              bg={containerBg}
              borderTop="1px"
              borderColor={borderColor}
            >
              <form onSubmit={handleSubmit}>
                <Flex>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="メッセージを入力..."
                    size="lg"
                    mr={4}
                    borderRadius="full"
                    bg={useColorModeValue('white', 'gray.700')}
                    color={textColor}
                    _placeholder={{ color: placeholderColor }}
                    _focus={{
                      boxShadow: 'outline',
                      borderColor: 'blue.400',
                    }}
                    _hover={{
                      borderColor: 'blue.300',
                    }}
                  />
                  <IconButton
                    type="submit"
                    icon={<FiSend />}
                    colorScheme="blue"
                    size="lg"
                    isLoading={isLoading}
                    borderRadius="full"
                    aria-label="Send message"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  />
                </Flex>
              </form>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
