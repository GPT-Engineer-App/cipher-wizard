import React, { useState } from "react";
import { Box, Heading, Text, Textarea, Input, Button, Stack, useColorMode, useColorModeValue } from "@chakra-ui/react";

const Index = () => {
  const { toggleColorMode } = useColorMode();
  const [mode, setMode] = useState("encrypt");
  const [input, setInput] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");
  const [possibleKeys, setPossibleKeys] = useState([]);

  const handleInputChange = (e) => setInput(e.target.value);
  const handleKeyChange = (e) => setKey(e.target.value.toUpperCase());

  const encrypt = () => {
    let result = "";
    for (let i = 0, j = 0; i < input.length; i++) {
      const c = input.charAt(i);
      if (c.match(/[a-z]/i)) {
        const shift = key.charCodeAt(j % key.length) - 65;
        result += String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65);
        j++;
      } else {
        result += c;
      }
    }
    setOutput(result);
  };

  const decrypt = () => {
    let result = "";
    for (let i = 0, j = 0; i < input.length; i++) {
      const c = input.charAt(i);
      if (c.match(/[a-z]/i)) {
        const shift = key.charCodeAt(j % key.length) - 65;
        result += String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        j++;
      } else {
        result += c;
      }
    }
    setOutput(result);
  };

  const breakCipher = () => {
    const freqs = new Array(26).fill(0);
    let sum = 0;

    for (let c of input) {
      if (c.match(/[a-z]/i)) {
        freqs[c.charCodeAt(0) - 65]++;
        sum++;
      }
    }

    freqs.forEach((f, i) => (freqs[i] = f / sum));

    const englishFreqs = [0.082, 0.015, 0.028, 0.043, 0.127, 0.022, 0.02, 0.061, 0.07, 0.002, 0.008, 0.04, 0.024, 0.067, 0.075, 0.019, 0.001, 0.06, 0.063, 0.091, 0.028, 0.01, 0.023, 0.001, 0.02, 0.001];

    const possibleLengths = [3, 4, 5, 6, 7, 8, 9, 10];
    const keys = [];

    possibleLengths.forEach((length) => {
      const key = new Array(length).fill("A");

      for (let i = 0; i < length; i++) {
        let minDiff = Infinity;
        let minChar = "A";

        for (let j = 0; j < 26; j++) {
          const shiftedFreqs = new Array(26).fill(0);
          for (let k = i; k < input.length; k += length) {
            const c = input.charAt(k);
            if (c.match(/[a-z]/i)) {
              shiftedFreqs[(c.charCodeAt(0) - 65 - j + 26) % 26]++;
            }
          }

          let diff = 0;
          for (let k = 0; k < 26; k++) {
            diff += Math.abs(shiftedFreqs[k] / sum - englishFreqs[k]);
          }

          if (diff < minDiff) {
            minDiff = diff;
            minChar = String.fromCharCode(65 + j);
          }
        }

        key[i] = minChar;
      }

      keys.push(key.join(""));
    });

    setPossibleKeys(keys);
  };

  const bg = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("black", "white");

  return (
    <Box p={4} bg={bg} color={color} minHeight="100vh">
      <Heading mb={4}>Vigenère Cipher Tool</Heading>
      <Button onClick={toggleColorMode} mb={4}>
        Toggle Theme
      </Button>
      <Stack direction={["column", "row"]} spacing={4} mb={4}>
        <Button onClick={() => setMode("encrypt")} variant={mode === "encrypt" ? "solid" : "outline"}>
          Encrypt
        </Button>
        <Button onClick={() => setMode("decrypt")} variant={mode === "decrypt" ? "solid" : "outline"}>
          Decrypt
        </Button>
        <Button onClick={() => setMode("break")} variant={mode === "break" ? "solid" : "outline"}>
          Break Cipher
        </Button>
      </Stack>
      <Textarea placeholder="Enter text..." value={input} onChange={handleInputChange} mb={4} fontFamily="monospace" />
      {mode !== "break" && <Input placeholder="Enter key..." value={key} onChange={handleKeyChange} mb={4} fontFamily="monospace" />}
      <Button
        onClick={() => {
          if (mode === "encrypt") encrypt();
          else if (mode === "decrypt") decrypt();
          else breakCipher();
        }}
        mb={4}
      >
        {mode === "break" ? "Analyze" : mode === "encrypt" ? "Encrypt" : "Decrypt"}
      </Button>
      {mode === "break" ? (
        <Box>
          <Heading size="md" mb={2}>
            Possible Keys:
          </Heading>
          {possibleKeys.map((key, i) => (
            <Text key={i} fontFamily="monospace">
              {key}
            </Text>
          ))}
        </Box>
      ) : (
        <Box>
          <Heading size="md" mb={2}>
            Output:
          </Heading>
          <Text fontFamily="monospace">{output}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Index;
