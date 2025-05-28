import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export default function QuotesScreen() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('https://zenquotes.io/api/quotes');
      const data = await response.json();
      setQuotes(data.slice(0, 10)); // show first 10 quotes only
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Quotes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>"{item.q}"</Text>
              <Text style={styles.authorText}>- {item.a}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fffaf0',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  quoteContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#444',
  },
  authorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'right',
  },
});
