import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { FontAwesome } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
  const [price, setPrice] = useState('');

  const formatFloat = (str: string) => str.slice(3).replace(',', '.');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicione seu dinheiro disponível</Text>
      <MaskInput
        style={styles.input}
        placeholderTextColor='#121212'
        value={price}
        onChangeText={setPrice}
        mask={Masks.BRL_CURRENCY}
        keyboardType='numeric'
      />
      <RectButton
        style={styles.button}
        onPress={() => {
          AsyncStorage.setItem('cash', formatFloat(price));
          Alert.alert('Salvo com sucesso ✅');
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
          <FontAwesome name='save' size={25} />
          {' '}
          Salvar
        </Text>
      </RectButton>
      <View style={styles.separator} lightColor='#eee' darkColor='rgba(255,255,255,0.1)' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 23,
    fontWeight: '300',
    marginTop: 120,
    marginBottom: 30,
    fontStyle: 'italic',
  },
  input: {
    height: 50,
    width: 320,
    textAlign: 'center',
    margin: 10,
    borderWidth: 1,
    padding: 10,
    // color: 'white',
    fontSize: 25,
    backgroundColor: '#EBEBEB',
    borderRadius: 5,
  },
  button: {
    borderRadius: 5,
    marginTop: 12,
    backgroundColor: '#FC666F',
    // backgroundColor: '#ff352e',
    width: 320,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
