import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Platform, StyleSheet, TextInput, Alert,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import MaskInput, { Masks } from 'react-native-mask-input';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function ModalScreen({ navigation, route }: RootTabScreenProps<'Modal'>) {
  const [price, setPrice] = useState(route.params?.price || '');
  const [name, setName] = useState(route.params?.title || '');

  interface Data {
    id: string;
    title: string;
    price: string;
  }

  const removeItem = (arr: Data[], item: Data) => arr.splice(arr.indexOf(item), 1)[0];
  const formatFloat = (str: string) => str.slice(3).replace(',', '.');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ route.params ? 'Editar item' : 'Novo item' }</Text>
      <View style={styles.separator} lightColor='#eee' darkColor='rgba(255,255,255,0.1)' />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        placeholder={route.params?.title || 'Nome do item'}
        placeholderTextColor='#121212'
      />

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
          Alert.alert(
            `Item ${name}`,
            `Valor: ${price}\n`,
          );
          if (name && price) {
            AsyncStorage.getItem('items').then((items) => {
              const data: Data[] = items ? JSON.parse(items!) : [];

              route.params && removeItem(
                data,
                data.find((i) => i.id === route.params?.itemId) as Data,
              );

              data.push(
                {
                  id: route.params?.itemId || `${Date.now()}`,
                  title: name,
                  price: formatFloat(price),
                },
              );

              AsyncStorage.setItem('items', JSON.stringify(data)).then(() => {
                navigation.goBack();
              });
            });
          }
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.title}>
          { route.params ? 'Editar' : 'Adicionar' }
        </Text>
      </RectButton>
      {
        route.params && (
        <RectButton
          style={styles.button}
          onPress={() => {
            AsyncStorage.getItem('items')
              .then((items) => {
                const data: Data[] = JSON.parse(items!);
                removeItem(data, data.find((i) => i.id === route.params?.itemId) as Data);

                AsyncStorage.setItem('items', JSON.stringify(data))
                  .then(() => navigation.goBack());
              });
          }}
        >
          <Text style={styles.title}>
            {' '}
            <FontAwesome name='trash' size={25} color='white' />
            {' '}
          </Text>
        </RectButton>
        )
      }

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
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
  picker: {
    textAlign: 'center',
    height: 50,
    backgroundColor: '#EBEBEB',
    width: 150,
    marginLeft: 15,
  },
});
