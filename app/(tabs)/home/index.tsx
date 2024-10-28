import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react'

const index = () => {
  const todos = [

  ]
  return (
    <>
      <View style={{
        marginHorizontal: 10,
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 12
      }}>
        <Pressable style={{
          backgroundColor: "#7CB9E8",
          paddingHorizontal: 18,
          paddingVertical: 6,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: 'center'

        }}>
          <Text style={{ color: "white", textAlign: "center" }}>All</Text>
        </Pressable>
        <Pressable style={{
          backgroundColor: "#7CB9E8",
          paddingHorizontal: 18,
          paddingVertical: 6,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: 'center'

        }}>
          <Text style={{ color: "white", textAlign: "center" }}>Work</Text>
        </Pressable>
        <Pressable style={{
          backgroundColor: "#7CB9E8",
          paddingHorizontal: 18,
          paddingVertical: 6,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: 'center',
          marginRight: "auto"

        }}>
          <Text style={{ color: "white", textAlign: "center" }}>Personal</Text>
        </Pressable>

        <Pressable>
          <AntDesign name="pluscircle" size={35} color="#007FFF" />
        </Pressable>

      </View>
      <ScrollView style={{
        flex: 1,
        backgroundColor: "white"
      }}>
        <View style={{
          padding: 10
        }}>
          {todos?.length > 0 ? (
            <View></View>
          ) : (
            <View style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 130,
              marginLeft: "auto",
              marginRight: "auto"
            }}>
              <Image style={{ width: 400, height: 600, resizeMode: "contain" }}
                source={require("../../../assets/images/todo.png")}
              />
              <Text style={{
                fontSize: 16,
                marginTop: 15,
                fontWeight: "600",
                textAlign: "center"
              }}>No task for today! Add the text</Text>
              <Pressable style={{
                marginTop: 15
              }}>
                <AntDesign name="pluscircle" size={30} color="#007FFF" />
              </Pressable>
            </View>

          )}
        </View>
      </ScrollView>
    </>
  )
}

export default index

const styles = StyleSheet.create({})