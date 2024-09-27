import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Switch,
  Button,
} from "react-native";
import React, { useState, useEffect, useCallback, memo } from "react";
import { useWebSocketContext } from "../../context/WebSocketProvider";
import debounce from "lodash.debounce";
import Toast from "react-native-root-toast";

const TradeItem = memo(({ item }) => (
  <View style={styles.trade}>
    <Text>Price: {item.price}</Text>
    <Text>Quantity: {item.quantity}</Text>
    <Text>Time: {item.time}</Text>
  </View>
));

const Home = () => {
  const { trades } = useWebSocketContext();
  const [userMaxPrice, setUserMaxPrice] = useState("");
  const [userMinPrice, setUserMinPrice] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // const debouncedSetUserMaxPrice = useCallback(
  //   debounce(setUserMaxPrice, 300),
  //   []
  // );
  // const debouncedSetUserMinPrice = useCallback(
  //   debounce(setUserMinPrice, 300),
  //   []
  // );

  useEffect(() => {
    const latestTrade = trades[0];
    if (latestTrade) {
      const price = latestTrade.price;
      const maxPrice = parseFloat(userMaxPrice);
      const minPrice = parseFloat(userMinPrice);
      if (isEnabled) {
        if (maxPrice && maxPrice < price) {
          toast("Max price is toast");
          // showAlert("Max price is updated");
        }
        if (minPrice && minPrice > price) {
          toast("Min price is toast");
          // showAlert("Min price is updated");
        }
      }
    }
  }, [trades, isEnabled, userMaxPrice, userMinPrice]);

  const showAlert = (text) =>
    Alert.alert(
      text,
      "My Alert Msg",
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );

  const renderItem = useCallback(({ item }) => <TradeItem item={item} />, []);
  const keyExtractor = useCallback((item, i) => item.time.toString() + i, []);

  let toast = (text) =>
    Toast.show(text, {
      duration: Toast.durations.SHORT,
    });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BTC/USDT Last Trades</Text>
      {/* <Button title="Show Toast" onPress={toast} /> */}
      <TextInput
        style={styles.input}
        placeholder="Enter min price"
        keyboardType="numeric"
        value={userMinPrice}
        onChangeText={setUserMinPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter max price"
        keyboardType="numeric"
        value={userMaxPrice}
        onChangeText={setUserMaxPrice}
      />
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <FlatList
        data={trades.slice(0, 50)}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "80%",
  },
  trade: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default memo(Home);
