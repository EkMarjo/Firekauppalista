import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove, set } from 'firebase/database';
import { useEffect, useState } from 'react';



const firebaseConfig = {
  apiKey: "AIzaSyDt_p1Cz752rJeoudY0EMKe43liJu1N4pw",
  authDomain: "shopping-list-b2ac3.firebaseapp.com",
  databaseURL: "https://shopping-list-b2ac3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shopping-list-b2ac3",
  storageBucket: "shopping-list-b2ac3.appspot.com",
  messagingSenderId: "283512900860",
  appId: "1:283512900860:web:d8b681c786eb86d62f9b79",
  measurementId: "G-N05ZGYY5XR"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {

  const[product, setProduct] = useState({
    title: '',
    amount: ''
  });

  const [products, setProducts] = useState ([]);

  useEffect (() => {
    onValue(ref(database, '/products'), (snapshot) =>{
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProducts(productsArray);
      } else {
        setProducts([]);
      }
    });
  }, []);

  const handleSave = () => {
    const productsRef = ref(database, '/products');
    const newProductRef = push(productsRef); 
    const newProductId = newProductRef.key; 
    set(newProductRef, {...product, id: newProductId});
  }

  const handleDelete = (itemId) => {
    const productRef = ref(database, `/products/${itemId}`);
    remove(productRef);
    const updatedProducts = products.filter((p) => p.id !== itemId);
    setProducts(updatedProducts);
  }

  return (
    <View style={styles.container}>
      <TextInput
      placeholder='Product Title'
      value={product.title}
      onChangeText={value => setProduct({...product, title:value})}
      />
      <TextInput
      placeholder='Amount'
      value={product.amount}
      onChangeText={value => setProduct({...product, amount:value})}
      />
      <Button title= 'Save product' onPress={handleSave} />
      <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <View>
          <Text>{item.title} {item.amount}</Text>
          <Button title='Delete' onPress={() => handleDelete(item.id)} />
        </View>
      )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
