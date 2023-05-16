import { View, Text } from 'react-native'
import React from 'react'

export function Header (props) {
  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'black' }}>
        {props.name}
      </Text>
    </View>
  )
}
