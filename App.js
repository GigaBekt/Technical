import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Grouped, Home } from "./src/screens";
import { WebSocketProvider } from "./src/context/WebSocketProvider";
import { RootSiblingParent } from "react-native-root-siblings";
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <RootSiblingParent>
      <WebSocketProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Grouped" component={Grouped} />
          </Tab.Navigator>
        </NavigationContainer>
      </WebSocketProvider>
    </RootSiblingParent>
  );
};

export default App;
