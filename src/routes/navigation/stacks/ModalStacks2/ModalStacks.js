import React, { useState, useContext } from "react";
import { createStackNavigator } from '@react-navigation/stack'
import { HomeTitleContext } from "../../../../context/HomeTitleContext";

import AddTransaction from "../../../../scenes/addTransaction";
import Print from "../../../../scenes/print";

const Stack = createStackNavigator()

export const ModalStacks = () => {
  const [title, setTitle] = useState('default title')

  return (
    <HomeTitleContext.Provider
      value={{
        title,
        setTitle,
      }}
    >
      <HomeTitleContext.Consumer>
        {(ctx) => (
          <Stack.Navigator
            screenOptions={{
              headerShown: true,
            }}
          >
            <Stack.Screen
              name='Add Transaction'
              component={AddTransaction}
              options={{
                title: ctx.title,
                headerBackTitle: '',
              }}
            />
            {/* <Stack.Screen
              name='Print'
              component={Print}
            /> */}
          </Stack.Navigator>
      )}
      </HomeTitleContext.Consumer>
    </HomeTitleContext.Provider>
  )
}
