import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useWebSocketContext } from "../../context/WebSocketProvider";

const Grouped = () => {
  const { trades } = useWebSocketContext();

  const groupTimeData = (data) => {
    return data.reduce((acc, item) => {
      const [hours, minutes] = item.time.split(":");
      const key = `${hours}:${minutes}`;

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);

      return acc;
    }, {});
  };

  const groupedData = groupTimeData(trades);

  return (
    <View>
      {Object.keys(groupedData).map((key, i) => {
        const totalSum = groupedData[key].reduce(
          (sum, trade) => sum + trade.price,
          0
        );
        const averagePrice = totalSum / groupedData[key].length;
        return (
          <View key={key + i} style={styles.trade}>
            <Text style={styles.header}>{key}</Text>
            <Text style={styles.price}>Average: {averagePrice.toFixed(2)}</Text>
          </View>
        );
      })}
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
  trade: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Grouped;
