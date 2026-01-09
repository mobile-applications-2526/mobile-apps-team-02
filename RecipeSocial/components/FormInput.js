import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from '../utils/scaling';

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete = 'off',
  testID,
  multiline = false,
  numberOfLines = 1,
  style,
}) {
  const inputWidth = scale(329);
  const inputHeight = multiline ? verticalScale(100) : verticalScale(55);
  const verticalSpacing = verticalScale(20);

  return (
    <View style={[{ width: inputWidth, alignSelf: 'center', marginBottom: verticalSpacing }, style]}>
      {label && <Text className="text-2xl font-bold">{label}</Text>}
      <TextInput
        className="border border-gray-400 rounded-lg p-3"
        style={{
          height: inputHeight, color: '#000',
          textAlignVertical: multiline ? 'top' : 'center'
        }}
        placeholderTextColor="#6B7280"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        placeholder={placeholder}
        testID={testID}
        nativeID={testID}
        accessibilityLabel={testID}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

