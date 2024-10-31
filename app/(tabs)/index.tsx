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
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmModal from '@/components/ConfirmModal';
import EditTodoModal from '@/components/EditModal';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import NameModal from '@/components/NameModal';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);


  const [name, setName] = useState<string | null>(null);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const fetchName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setName(storedName);
      } else {
        setIsNameModalVisible(true);
      }
    };

    fetchName();
  }, []);

  const saveName = async () => {
    if (tempName.trim()) {
      await AsyncStorage.setItem('userName', tempName);
      setName(tempName);
      setIsNameModalVisible(false);
    }
  };


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

  const hasCompletedTodos = todos.some(todo => todo.completed);


  const clearAll = () => {
    setIsModalVisible(true); // Show the modal
  };

  const confirmClearAll = async () => {
    setTodos([]);
    await AsyncStorage.removeItem('todos');
    setIsModalVisible(false); // Close the modal after clearing
  };

  const openEditModal = (todo: Todo) => {
    setCurrentTodo(todo);
    setIsEditModalVisible(true);
  };

  const handleEditConfirm = async (newText: string) => {
    if (currentTodo) {
      const updatedTodos = todos.map((item) =>
        item.id === currentTodo.id ? { ...item, text: newText } : item
      );
      setTodos(updatedTodos);
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
    }
    setIsEditModalVisible(false);
  };

  const clearName = async () => {
    await AsyncStorage.removeItem('userName');
    setName(null);
    setIsNameModalVisible(true); // Show modal again to prompt for name
  };


  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Todo List</Text>
        {/* {name ? (
        <>
          <Text style={styles.welcomeText}>Welcome, {name}!</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearName}>
            <Text style={styles.clearButtonText}>Clear Name</Text>
          </TouchableOpacity>
        </>
      ) : null}

      <NameModal
        visible={isNameModalVisible}
        onSave={saveName}
        onClose={() => setIsNameModalVisible(false)}
      /> */}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter a todo..."
            value={todo}
            onChangeText={setTodo}
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>


        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.uncheckButton, !hasCompletedTodos && styles.clearButtonDisabled]} onPress={uncheckAll} disabled={!hasCompletedTodos}
          >
            <Text style={styles.uncheckButtonText} >Uncheck All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.clearButton, todos.length === 0 && styles.clearButtonDisabled]}
            onPress={clearAll}
            disabled={todos.length === 0} >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>


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
              <TouchableOpacity
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.deleteText}><MaterialIcons name="edit" size={24} color="white" /></Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                <Text style={styles.deleteText}><MaterialIcons name="delete" size={24} color="white" /></Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <ConfirmModal visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={confirmClearAll}
        message="Are you sure you want to delete all todo items?" />
      <EditTodoModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onConfirm={handleEditConfirm}
        initialText={currentTodo ? currentTodo.text : ''}
      />
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    color: "white"
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
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
    backgroundColor: "white",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  uncheckButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  uncheckButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearButtonDisabled: {
    backgroundColor: '#ccc',  // Light gray to indicate it's disabled
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15

  },
  todoText: {
    flex: 1,
    fontSize: 18,
    color: "white"
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteText: {
    marginLeft: 20,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#007bff',
    display: "flex",
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
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;
