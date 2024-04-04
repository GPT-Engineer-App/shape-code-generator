import React, { useState } from "react";
import { Box, Heading, Textarea, Button, useToast, VStack, HStack, Text, Input } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa";
import { readAsText } from "../utils/fileUtils";



const API_KEY = "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";

const Index = () => {
  const [shape, setShape] = useState("");
  const [code, setCode] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const toast = useToast();

  const fetchGeneratedCode = async (shape, pdfFileContent) => {
    try {
      const requestBody = {
        apiKey: API_KEY,
        model: "codellama-70b-instruct",
        parameters: {},
        data: {
          shape,
          pdfContent: pdfFileContent || "",
        },
      };

      const response = await fetch("https://api.perplexity.ai/v1/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("API call failed: " + response.status);
      }

      const result = await response.json();

      return result.code;
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return "";
    }
  };

  const generateCode = async () => {
    if (!shape.trim()) {
      toast({
        title: "Error",
        description: "Please enter a shape.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    console.log("PDF File:", pdfFile);

    let cppCode = "";

    if (shape.toLowerCase() === "square") {
      cppCode = `#include <iostream>
using namespace std;

namespace ShapeScript {
  class ShapeSquare {
  public:
    double SideLength = 10.0;

    ShapeSquare() {
      ShapeName = "Square";
    }

    string GetPartName() {
      return ShapeName + " " + to_string(SideLength) + "\" X " + to_string(SideLength) + "\"";
    }

    string GetCategory() {
      return "Square";
    }

    string GetSubCategory() {
      return to_string(SideLength) + "\" X " + to_string(SideLength) + "\"";
    }

    string GetProductCode() {
      return "";
    }

    void RunScript() {
     
     
    }

  private:
    string ShapeName;
  };
}`;
    } else {
      cppCode = `#include <iostream>
using namespace std;

int main() {
  cout << "${shape}" << endl;
  return 0;
}`;
    }

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
        <Text>Upload PDF with shape definitions (optional):</Text>
        <Input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
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
