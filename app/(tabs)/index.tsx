import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) setTodos(JSON.parse(storedTodos));
    } catch (error) {
      Alert.alert('Error', 'Failed to load todos');
    }
  };

  const saveTodos = async (todos: Todo[]) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      Alert.alert('Error', 'Failed to save todos');
    }
  };

  const addTodo = () => {
    if (!todo.trim()) return;
    const newTodo: Todo = { id: Date.now().toString(), text: todo, completed: false };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    setTodo('');
    saveTodos(newTodos);
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const uncheckAll = () => {
    const uncheckedTodos = todos.map((item) => ({ ...item, completed: false }));
    setTodos(uncheckedTodos);
    saveTodos(uncheckedTodos);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a todo..."
          value={todo}
          onChangeText={setTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.uncheckButton} onPress={uncheckAll}>
        <Text style={styles.uncheckButtonText}>Uncheck All</Text>
      </TouchableOpacity>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Pressable
              style={[
                styles.checkbox,
                item.completed && styles.checkboxChecked,
              ]}
              onPress={() => toggleTodo(item.id)}
            >
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
            <Text style={[styles.todoText, item.completed && styles.completedTodo]}>
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    color:"white"
  },
  title: {
    fontSize: 32,
    color:"white",
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom:20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor:"white",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  uncheckButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  uncheckButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15
  
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    color:"white"
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#007bff',
    display:"flex",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 15,
    display:"flex",
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default App;
