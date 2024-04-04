import React, { useState } from "react";
import { Box, Heading, Textarea, Button, useToast, VStack, HStack, Text } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa";

const Index = () => {
  const [shape, setShape] = useState("");
  const [code, setCode] = useState("");
  const toast = useToast();

  const generateCode = () => {
    if (shape.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a shape.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const cppCode = `#include <iostream>
using namespace std;

int main() {
  cout << "${shape}" << endl;
  return 0;
}`;

    setCode(cppCode);
  };

  const downloadCode = () => {
    if (code.trim() === "") {
      toast({
        title: "Error",
        description: "Please generate the code first.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "shape.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Box maxWidth="600px" margin="auto" padding={4}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Shape Code Generator
        </Heading>
        <Text>Enter a shape:</Text>
        <Textarea value={shape} onChange={(e) => setShape(e.target.value)} placeholder="Enter a shape (e.g., circle, square, triangle)" />
        <Button colorScheme="blue" onClick={generateCode}>
          Generate Code
        </Button>
        {code && (
          <>
            <Text>Generated C++ Code:</Text>
            <Textarea value={code} readOnly />
            <HStack justify="flex-end">
              <Button leftIcon={<FaDownload />} colorScheme="green" onClick={downloadCode}>
                Download Code
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default Index;