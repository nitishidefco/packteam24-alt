import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import moment from 'moment';

const OfflineDataDisplay = () => {
  const {sessions} = useSelector(state => state.OfflineData);
  const [sortOrder, setSortOrder] = useState('desc');
  // Process and sort the data
  const processedData = useMemo(() => {
    const allData = [];

    // Flatten the data structure
    Object.entries(sessions).forEach(([sessionId, sessionData]) => {
      sessionData.items.forEach(item => {
        allData.push({
          sessionId,
          ...item,
          timestamp: moment(item.time).valueOf(),
        });
      });
    });

    // Sort the data
    return allData.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.timestamp - a.timestamp;
      }
      return a.timestamp - b.timestamp;
    });
  }, [sessions, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(current => (current === 'desc' ? 'asc' : 'desc'));
  };
  console.log('Sessoin lenght', Object.keys(sessions).length === 0);

  if (!sessions || Object.keys(sessions).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No offline data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Offline Data</Text>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>
            Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {processedData.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.sessionText}>Session ID: {item.sessionId}</Text>
            <Text style={styles.tagText}>Tag ID: {item.tagId}</Text>
            <Text style={styles.timeText}>
              {moment(item.time).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sortButton: {
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  sortButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tagText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default OfflineDataDisplay;
