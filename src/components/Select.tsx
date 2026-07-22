import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectProps {
  label: string;
  selectedValue: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
}

export default function Select({
  label,
  selectedValue,
  options,
  isOpen,
  onToggle,
  onSelect,
  placeholder = 'Selecione...',
  errorMessage,
  disabled = false,
}: SelectProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.dropdownButton, !!errorMessage && styles.dropdownButtonError]}
        onPress={onToggle}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.dropdownButtonText, !selectedValue && styles.placeholderText]}>
          {selectedValue ? selectedValue : placeholder}
        </Text>
        <Text style={styles.arrowIcon}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.dropdownItem,
                selectedValue === item && styles.dropdownItemSelected,
              ]}
              onPress={() => onSelect(item)}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedValue === item && styles.dropdownItemTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    color: '#000',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  dropdownButtonError: {
    borderColor: '#FF0000',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000',
    textTransform: 'lowercase',
  },
  placeholderText: {
    color: '#A9A9A9',
  },
  arrowIcon: {
    fontSize: 12,
    color: '#555',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#BBB',
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dropdownItemSelected: {
    backgroundColor: '#E97BB522',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    textTransform: 'lowercase',
  },
  dropdownItemTextSelected: {
    color: '#E97BB5',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});