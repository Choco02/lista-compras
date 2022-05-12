import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View } from '../components/Themed';
import ListItem from '../components/ListItem';
import { RootTabScreenProps } from '../types';
import useFormatPrice from '../hooks/useFormatPrice';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [amount, setAmount] = useState(300);
  const [data, setData] = useState<Data[]>([]);

  interface Data {
    id: string;
    title: string;
    price: string;
  }

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('items').then((items) => {
        const dataStorage: Data[] = JSON.parse(items!) || [];
        dataStorage.length > 0 && dataStorage.push(...dataStorage);
        setData([...new Set(dataStorage)]);
      });
      AsyncStorage.getItem('cash').then((cash) => {
        cash && setAmount(Number(cash));
      });
    }, []),
  );

  const renderItem: ListRenderItem<Data> = ({ item }) => (
    <ListItem
      item={item}
      amount={amount}
      setAmount={setAmount}
      navigation={navigation}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Dinheiro disponível
        {' R$ '}
        {useFormatPrice(amount)}
      </Text>
      <View style={styles.separator} lightColor='#eee' darkColor='rgba(255,255,255,0.1)' />
      {
        data.length !== 0
          ? <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} />
          : (
            <Text style={{ fontSize: 25 }}>
              {' '}
              Clique em
              {' '}
              <FontAwesome name='plus' size={20} color='white' />
              {' '}
              para adicionar
            </Text>
          )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    // textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
