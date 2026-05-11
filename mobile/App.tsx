import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from './src/theme'
import HomeScreen from './src/screens/HomeScreen'
import ChatScreen from './src/screens/ChatScreen'
import AnalyticsScreen from './src/screens/AnalyticsScreen'

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0f1020',
            borderTopColor: 'rgba(92,111,255,0.15)',
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          },
          tabBarActiveTintColor: Colors.brand,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
          tabBarIcon: ({ color, size, focused }) => {
            const icons: Record<string, [string, string]> = {
              Home: ['home', 'home-outline'],
              Chat: ['chatbubbles', 'chatbubbles-outline'],
              Analytics: ['bar-chart', 'bar-chart-outline'],
            }
            const [active, inactive] = icons[route.name] || ['help', 'help-outline']
            return <Ionicons name={(focused ? active : inactive) as any} size={22} color={color} />
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
