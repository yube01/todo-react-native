import { Redirect } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const index = () => {
  return (
    <Redirect href="/(tabs)/home"/>
  )
}

export default index

const styles = StyleSheet.create({})