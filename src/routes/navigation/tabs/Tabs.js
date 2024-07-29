import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FontIcon from 'react-native-vector-icons/FontAwesome'
import { colors } from 'theme'

// stack navigators
import { HomeNavigator, ProfileNavigator, ConnectNavigator, HistoryNavigator, ManageCategoryNavigator } from '../stacks'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      options={{
        tabBarStyle: {
          // backgroundColor: 'white',
          // borderTopColor: 'gray',
          // borderTopWidth: 1,
          // paddingBottom: 5,
          // paddingTop: 5,
        }
      }}
      defaultScreenOptions={{
        headerShown: false,
        headerTransparent: true
      }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.lightPurple,
        tabBarInactiveTintColor: colors.gray,
      })}
      initialRouteName="HomeTab"
      swipeEnabled={false}
    >
      <Tab.Screen
        name="HistoryTab"
        component={HistoryNavigator}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <FontIcon
              name="clock-o"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontIcon
              name="home"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ConnectTab"
        component={ManageCategoryNavigator}
        options={{
          tabBarLabel: 'Category',
          tabBarIcon: ({ color, size }) => (
            <FontIcon
              name="gear"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontIcon
              name="user"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator