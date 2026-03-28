import { useState, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';

export interface TravelFriend {
  id: string;
  name: string;
  avatar: string;
  location: string;
  isOnline: boolean;
  mutualConnections: number;
  email?: string;
  phone?: string;
  isConnected: boolean;
}

export const [TravelFriendsContext, useTravelFriends] = createContextHook(() => {
  const [friends] = useState<TravelFriend[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      location: 'New York, NY',
      isOnline: true,
      mutualConnections: 3,
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0123',
      isConnected: true,
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      location: 'San Francisco, CA',
      isOnline: false,
      mutualConnections: 1,
      email: 'mike.chen@email.com',
      phone: '+1-555-0456',
      isConnected: true,
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      location: 'London, UK',
      isOnline: true,
      mutualConnections: 5,
      email: 'emma.wilson@email.com',
      phone: '+44-20-1234-5678',
      isConnected: true,
    },
    {
      id: '4',
      name: 'David Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      location: 'Barcelona, Spain',
      isOnline: true,
      mutualConnections: 2,
      email: 'david.rodriguez@email.com',
      phone: '+34-123-456-789',
      isConnected: true,
    },
    {
      id: '5',
      name: 'Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      location: 'Seoul, South Korea',
      isOnline: false,
      mutualConnections: 4,
      email: 'lisa.park@email.com',
      phone: '+82-10-1234-5678',
      isConnected: true,
    },
  ]);

  const getConnectedFriends = useCallback(() => {
    return friends.filter(friend => friend.isConnected);
  }, [friends]);

  const getFriendById = useCallback((id: string) => {
    return friends.find(friend => friend.id === id);
  }, [friends]);

  const getFriendsByIds = useCallback((ids: string[]) => {
    return friends.filter(friend => ids.includes(friend.id));
  }, [friends]);

  return useMemo(() => ({
    friends,
    connectedFriends: getConnectedFriends(),
    getFriendById,
    getFriendsByIds,
  }), [friends, getConnectedFriends, getFriendById, getFriendsByIds]);
});