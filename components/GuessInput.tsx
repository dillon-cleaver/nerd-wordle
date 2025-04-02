import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

type GuessInputProps = {
  gameStatus: "won" | "running" | "lost";
  tentativeGuess: string;
  onGuessChange: (text: string) => void;
  onSubmit: () => void;
};

const GuessInput = ({
  gameStatus,
  tentativeGuess,
  onGuessChange,
  onSubmit,
}: GuessInputProps) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Enter Guess:</Text>
      <TextInput
        style={styles.input}
        value={tentativeGuess}
        onChangeText={(text) => onGuessChange(text.toUpperCase())}
        maxLength={5}
        editable={gameStatus === "running"}
        placeholder="5 letter word"
        placeholderTextColor="#666"
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={onSubmit}
        disabled={gameStatus !== "running" || tentativeGuess.length !== 5}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GuessInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#ccc",
    padding: 8,
    fontSize: 16,
    width: 120,
    textAlign: "center",
    textTransform: "uppercase",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
});
