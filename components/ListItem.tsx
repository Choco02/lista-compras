import { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';
import {
  Text, View, StyleSheet, ToastAndroid, Vibration,
} from 'react-native';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import useFormatPrice from '../hooks/useFormatPrice';

export default function ListItem({
  // @ts-ignore
  item, amount, setAmount, navigation,
}) {
  useEffect(() => {
    ToastAndroid.show('Segure em um item da lista para editar', ToastAndroid.SHORT);
  }, []);

  const [isChecked, setChecked] = useState(false);

  interface Data {
    id?: string;
    title: string;
    price: string;
  }

  const updateValue = (value: boolean) => {
    setChecked(value);

    if (value) {
      setAmount(
        (Number(amount) * 100 - Number(item.price) * 100) / 100,
      );
    } else {
      setAmount(
        (Number(amount) * 100 + Number(item.price) * 100) / 100,
      );
    }
  };

  const Item = ({ title, price }: Data) => (
    <LongPressGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.BEGAN) {
          Vibration.vibrate(80);
        }
        if (nativeEvent.state === State.ACTIVE) {
          navigation.navigate('Modal', { itemId: item.id, title, price });
        }
      }}
      minDurationMs={400}
    >
      <View style={styles.item}>

        <Text style={{ width: 200, color: 'white', fontSize: 19 }} numberOfLines={1}>{title}</Text>
        <Text style={{
          fontWeight: 'bold', color: 'white', marginLeft: 10, fontSize: 16,
        }}
        >
          {useFormatPrice(price)}

        </Text>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={updateValue}
          color={isChecked ? '#29ff57' : undefined}
        />
      </View>
    </LongPressGestureHandler>
  );

  return (
    <Item
      title={item.title}
      price={useFormatPrice(item.price)}
    />
  );
}

export const styles = StyleSheet.create({
  item: {
    borderRadius: 5,
    alignItems: 'center',
    // backgroundColor: '#e56bfe',
    // backgroundColor: '#ffa8fc',
    backgroundColor: '#78aafa',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    justifyContent: 'space-around',
    flexDirection: 'row',
    width: 310,
    height: 50,
  },
  checkbox: {
    height: 35,
    width: 35,
    borderColor: 'white',
    marginLeft: 14,
  },
});
