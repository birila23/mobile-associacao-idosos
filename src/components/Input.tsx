import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
  hasError?: boolean;
}

export default function Input({
  label,
  errorMessage,
  hasError,
  style,
  ...rest
}: InputProps) {
  const isInvalid = hasError || !!errorMessage;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputError, style]}
        {...rest}
      />
      {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});