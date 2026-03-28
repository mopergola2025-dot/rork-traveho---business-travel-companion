import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import {
  MessageCircle,
  Heart,
  Share,
  MapPin,
  Camera,
  Send,
  UserPlus,
  Search,
} from 'lucide-react-native';

import Colors from '@/constants/colors';

interface User {
  id: string;
  name: string;
  avatar: string;
  location: string;
  isOnline: boolean;
  mutualConnections: number;
  isConnected?: boolean;
}

interface Post {
  id: string;
  user: User;
  content: string;
  images: string[];
  location: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'connect'>('feed');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      location: 'New York, NY',
      isOnline: true,
      mutualConnections: 3,
      isConnected: false,
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      location: 'San Francisco, CA',
      isOnline: false,
      mutualConnections: 1,
      isConnected: false,
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      location: 'London, UK',
      isOnline: true,
      mutualConnections: 5,
      isConnected: false,
    },
  ]);

  const [posts] = useState<Post[]>([
    {
      id: '1',
      user: users[0],
      content: 'Amazing business trip to Tokyo! The client meeting went perfectly and I had some time to explore the city. The food here is incredible! 🍜',
      images: [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
      ],
      location: 'Tokyo, Japan',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      isLiked: false,
    },
    {
      id: '2',
      user: users[1],
      content: 'Conference day 2 in San Francisco. Met some incredible entrepreneurs and learned about the latest tech trends. Networking at its finest! 💼',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      ],
      location: 'San Francisco, CA',
      timestamp: '5 hours ago',
      likes: 18,
      comments: 12,
      isLiked: true,
    },
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = (postId: string) => {
    console.log(`Like post ${postId}`);
  };

  const handleComment = (postId: string) => {
    console.log(`Comment on post ${postId}`);
  };

  const handleShare = (postId: string) => {
    console.log(`Share post ${postId}`);
  };

  const handleConnect = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, isConnected: !u.isConnected } : u
      )
    );

    if (!user.isConnected) {
      Alert.alert(
        'Connection Request Sent',
        `You are now connected with ${user.name}!`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Disconnected',
        `You have disconnected from ${user.name}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleMessage = (userId: string) => {
    console.log(`Message user ${userId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Social</Text>
        <Text style={styles.subtitle}>Connect with fellow travelers</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
            onPress={() => setActiveTab('feed')}
          >
            <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>
              Feed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'connect' && styles.tabActive]}
            onPress={() => setActiveTab('connect')}
          >
            <Text style={[styles.tabText, activeTab === 'connect' && styles.tabTextActive]}>
              Connect
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'feed' ? (
          <View>
            <TouchableOpacity style={styles.createPostCard}>
              <View style={styles.createPostHeader}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }}
                  style={styles.userAvatar}
                />
                <Text style={styles.createPostText}>Share your travel experience...</Text>
              </View>
              <View style={styles.createPostActions}>
                <TouchableOpacity style={styles.createPostAction}>
                  <Camera size={20} color={Colors.light.primary} />
                  <Text style={styles.createPostActionText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createPostAction}>
                  <MapPin size={20} color={Colors.light.accent} />
                  <Text style={styles.createPostActionText}>Location</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postUserInfo}>
                    <Image source={{ uri: post.user.avatar }} style={styles.postUserAvatar} />
                    <View>
                      <Text style={styles.postUserName}>{post.user.name}</Text>
                      <View style={styles.postMeta}>
                        <MapPin size={12} color={Colors.light.gray} />
                        <Text style={styles.postLocation}>{post.location}</Text>
                        <Text style={styles.postTimestamp}>• {post.timestamp}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Share size={20} color={Colors.light.gray} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                {post.images.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.postImages}>
                    {post.images.map((image, index) => (
                      <Image key={`${post.id}-image-${index}`} source={{ uri: image }} style={styles.postImage} />
                    ))}
                  </ScrollView>
                )}

                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => handleLike(post.id)}
                  >
                    <Heart
                      size={20}
                      color={post.isLiked ? Colors.light.danger : Colors.light.gray}
                      fill={post.isLiked ? Colors.light.danger : 'transparent'}
                    />
                    <Text style={[styles.postActionText, post.isLiked && styles.postActionTextActive]}>
                      {post.likes}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => handleComment(post.id)}
                  >
                    <MessageCircle size={20} color={Colors.light.gray} />
                    <Text style={styles.postActionText}>{post.comments}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => handleShare(post.id)}
                  >
                    <Share size={20} color={Colors.light.gray} />
                    <Text style={styles.postActionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <View style={styles.searchContainer}>
              <Search size={20} color={Colors.light.gray} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search travelers..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={Colors.light.gray}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Travelers Near You</Text>
              {filteredUsers.map((user) => (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatarContainer}>
                      <Image source={{ uri: user.avatar }} style={styles.userCardAvatar} />
                      {user.isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <View style={styles.userLocation}>
                        <MapPin size={14} color={Colors.light.gray} />
                        <Text style={styles.userLocationText}>{user.location}</Text>
                      </View>
                      <Text style={styles.mutualConnections}>
                        {user.mutualConnections} mutual connections
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.userActions}>
                    <TouchableOpacity
                      style={[
                        styles.connectButton,
                        user.isConnected && styles.connectedButton
                      ]}
                      onPress={() => handleConnect(user.id)}
                    >
                      <UserPlus size={16} color={user.isConnected ? Colors.light.primary : Colors.light.background} />
                      <Text style={[
                        styles.connectButtonText,
                        user.isConnected && styles.connectedButtonText
                      ]}>
                        {user.isConnected ? 'Connected' : 'Connect'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.messageButton}
                      onPress={() => handleMessage(user.id)}
                    >
                      <Send size={16} color={Colors.light.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  header: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.light.background,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  createPostCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  createPostText: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.gray,
  },
  createPostActions: {
    flexDirection: 'row',
    gap: 20,
  },
  createPostAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  createPostActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  postCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postUserAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postLocation: {
    fontSize: 12,
    color: Colors.light.gray,
  },
  postTimestamp: {
    fontSize: 12,
    color: Colors.light.gray,
  },
  postContent: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  postImages: {
    marginBottom: 12,
  },
  postImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  postActionTextActive: {
    color: Colors.light.danger,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userCardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.success,
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  userLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  userLocationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  mutualConnections: {
    fontSize: 12,
    color: Colors.light.gray,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  connectButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.background,
  },
  connectedButton: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  connectedButtonText: {
    color: Colors.light.primary,
  },
  messageButton: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 8,
    borderRadius: 8,
  },
});