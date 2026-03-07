import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MOCK_USER = {
  displayName: 'Alex Johnson',
  email: 'alex.johnson@school.edu',
  photo: null,
};

export default function LoginScreen() {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.replace('Dashboard', { user: MOCK_USER });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Thoth</Text>
        <Text style={styles.subtitle}>Sync your Google Classroom assignments</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4EC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FAFDF8',
    borderRadius: 16,
    padding: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C2B1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#617060',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#4A7C59',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
