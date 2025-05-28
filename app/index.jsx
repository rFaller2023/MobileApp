import React, { useState, useEffect, useRef } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  TextInput,
  FlatList,
  Switch,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [quotesList, setQuotesList] = useState([
    `“Winning doesn't always\nmean being first. Winning means you're doing better than you've done before”`,
    `“The best way to get started is to quit talking and begin doing.”`,
    `“Don't let yesterday take up too much of today.”`,
    `“It's not whether you get knocked down, it's whether you get up.”`,
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedQuotes, setLikedQuotes] = useState({});
  const [activeNav, setActiveNav] = useState('home');
  const [fontSize, setFontSize] = useState(22);
  const [fontFamily, setFontFamily] = useState('System');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isDarkMode, setIsDarkMode] = useState(false);

  const animateQuoteChange = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNextQuote = () => {
    animateQuoteChange();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % quotesList.length);
  };

  const toggleLike = () => {
    setLikedQuotes((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  
  const HomeScreen = () => (
    <View style={styles.screenContent}>
      <Animated.Text
        style={[
          styles.quoteText,
          { opacity: fadeAnim, fontSize, fontFamily, color: isDarkMode ? '#fff' : '#222' },
        ]}
      >
        {quotesList[currentIndex]}
      </Animated.Text>
      <View style={styles.quoteActions}>
        <TouchableOpacity
          onPress={handleNextQuote}
          activeOpacity={0.8}
          style={[styles.actionButton, { backgroundColor: isDarkMode ? '#444' : '#ddd' }]}
        >
          <MaterialIcons
            name="refresh"
            size={28}
            color={isDarkMode ? '#fff' : '#333'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleLike}
          activeOpacity={0.8}
          style={[
            styles.actionButton,
            likedQuotes[currentIndex]
              ? { backgroundColor: '#e74c3c', shadowColor: '#e74c3c' }
              : { backgroundColor: isDarkMode ? '#444' : '#ddd' },
          ]}
        >
          <MaterialIcons
            name="favorite"
            size={28}
            color={likedQuotes[currentIndex] ? '#fff' : (isDarkMode ? '#fff' : '#333')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const FavoritesScreen = () => {
    const likedList = Object.entries(likedQuotes)
      .filter(([_, liked]) => liked)
      .map(([index]) => quotesList[index]);

    if (likedList.length === 0) {
      return (
        <View style={styles.screenContent}>
          <Text style={[styles.emptyText, { color: isDarkMode ? '#999' : '#555' }]}>
            No liked quotes yet ❤️
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.screenContent}>
        <FlatList
          data={likedList}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={[styles.likedQuoteContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0' }]}>
              <Text style={[styles.likedQuoteText, { color: isDarkMode ? '#eee' : '#111' }]}>{item}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const AddQuoteScreen = () => {
    const [newQuote, setNewQuote] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    const handleAddOrEditQuote = () => {
      if (newQuote.trim() === '') return;

      const formatted = `“${newQuote.trim()}”`;

      if (editIndex !== null) {
        const updatedQuotes = [...quotesList];
        updatedQuotes[editIndex] = formatted;
        setQuotesList(updatedQuotes);
        setEditIndex(null);
        setConfirmation('✅ Quote updated!');
      } else {
        setQuotesList([...quotesList, formatted]);
        setConfirmation('✅ Quote added!');
      }

      setNewQuote('');
      setTimeout(() => setConfirmation(''), 2000);
    };

    const handleEdit = (index) => {
      setEditIndex(index);
      setNewQuote(quotesList[index].replace(/“|”/g, ''));
    };

    const handleDelete = (index) => {
      const updatedQuotes = quotesList.filter((_, i) => i !== index);
      setQuotesList(updatedQuotes);
      setNewQuote('');
      setEditIndex(null);
      setConfirmation('🗑️ Quote deleted!');
      setTimeout(() => setConfirmation(''), 2000);
    };

    return (
      <View style={styles.screenContent}>
        <TextInput
          style={[
            styles.searchInput,
            {
              color: isDarkMode ? '#eee' : '#222',
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#fafafa',
              borderColor: isDarkMode ? '#555' : '#ddd',
            },
          ]}
          placeholder="Type a new quote here..."
          placeholderTextColor={isDarkMode ? '#bbb' : '#888'}
          value={newQuote}
          onChangeText={setNewQuote}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.addEditButton,
            { backgroundColor: isDarkMode ? '#1e90ff' : '#007aff' },
          ]}
          onPress={handleAddOrEditQuote}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name={editIndex !== null ? 'edit' : 'add'}
            size={24}
            color="#fff"
          />
          <Text style={styles.addEditButtonText}>
            {editIndex !== null ? 'Edit Quote' : 'Add Quote'}
          </Text>
        </TouchableOpacity>
        {confirmation !== '' && (
          <Text style={[styles.confirmationText]}>{confirmation}</Text>
        )}
        <FlatList
          style={{ marginTop: 30, width: '100%' }}
          data={quotesList}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.likedQuoteContainer,
                { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f9f9f9' },
              ]}
            >
              <Text style={[styles.likedQuoteText, { color: isDarkMode ? '#eee' : '#222' }]}>{item}</Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#FFC107' }]}
                  onPress={() => handleEdit(index)}
                >
                  <MaterialIcons name="edit" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#FF3B30', marginLeft: 10 }]}
                  onPress={() => handleDelete(index)}
                >
                  <MaterialIcons name="delete" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const ViewAllQuotesScreen = () => (
    <View style={styles.screenContent}>
      <FlatList
        data={quotesList}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={[styles.likedQuoteContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f5f5f5' }]}>
            <Text style={[styles.likedQuoteText, { color: isDarkMode ? '#eee' : '#222' }]}>{item}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  function SettingsScreen() {
    return (
      <View style={[styles.screenContent]}>
        <Text style={[styles.settingText, { color: isDarkMode ? '#eee' : '#222' }]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          thumbColor={isDarkMode ? '#fff' : '#222'}
          trackColor={{ false: '#ccc', true: '#1e90ff' }}
        />
      </View>
    );
  }

  const renderActiveScreen = () => {
    switch (activeNav) {
      case 'home':
        return <HomeScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'add':
        return <AddQuoteScreen />;
      case 'viewAll':
        return <ViewAllQuotesScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // BlurView fallback for Android (since it only works on iOS well)
  const BottomNavWrapper = ({ children }) =>
    Platform.OS === 'ios' ? (
      <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={styles.bottomNav}>
        {children}
      </BlurView>
    ) : (
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)',
            borderTopColor: isDarkMode ? '#222' : '#ccc',
            borderTopWidth: 1,
          },
        ]}
      >
        {children}
      </View>
    );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f8f1e4' }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.overlay, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255,255,255,0.15)' }]} />
        <View style={styles.header}>
          <Text style={[styles.logoText, { color: isDarkMode ? '#fff' : '#444' }]}>
            Daily <Text style={styles.logoItalic}>Quote</Text>
          </Text>
        </View>

        {renderActiveScreen()}

        <BottomNavWrapper>
          {[
            { key: 'home', icon: 'home', label: 'Home' },
            { key: 'favorites', icon: 'favorite', label: 'Favorites' },
            { key: 'add', icon: 'add-circle-outline', label: 'Add' },
            { key: 'viewAll', icon: 'list', label: 'All' },
            { key: 'settings', icon: 'settings', label: 'Settings' },
          ].map(({ key, icon, label }) => {
            const isActive = activeNav === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setActiveNav(key)}
                activeOpacity={0.7}
                style={styles.navButton}
              >
                <MaterialIcons
                  name={icon}
                  size={28}
                  color={isActive ? '#1e90ff' : isDarkMode ? '#bbb' : '#744607'}
                  style={isActive ? styles.activeNavItem : null}
                />
                <Text
                  style={[
                    styles.navLabel,
                    {
                      color: isActive ? '#1e90ff' : isDarkMode ? '#bbb' : '#744607',
                      fontWeight: isActive ? '700' : '400',
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BottomNavWrapper>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logoText: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 1,
  },
  logoItalic: {
    fontStyle: 'italic',
    color: '#1e90ff',
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 80,
    justifyContent: 'center',
  },
  quoteText: {
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  quoteActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    gap: 20,
  },
  actionButton: {
    padding: 15,
    borderRadius: 60,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  likedButton: {
    backgroundColor: '#e74c3c',
    shadowColor: '#e74c3c',
  },
  likedQuoteContainer: {
    borderRadius: 12,
    padding: 18,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  likedQuoteText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
  },
  emptyText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  bottomNav: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingBottom: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  activeNavItem: {
    textShadowColor: '#1e90ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  searchInput: {
    fontSize: 16,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    marginBottom: 15,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  addEditButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  addEditButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  confirmationText: {
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
    color: '#1e90ff',
  },
  settingText: {
    fontSize: 20,
    marginBottom: 14,
    fontWeight: '600',
  },
});
