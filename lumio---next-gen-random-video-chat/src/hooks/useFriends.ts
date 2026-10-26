import { useState, useCallback, useEffect } from 'react';
import { FriendsService } from '../services/friendsService';
import { DirectMessage, FriendItem, UserProfile } from '../types';

export function useFriends() {
  const [friends, setFriends] = useState<FriendItem[]>(() => FriendsService.getFriends());
  const [activeFriend, setActiveFriend] = useState<FriendItem | null>(() => {
    const list = FriendsService.getFriends();
    return list.length > 0 ? list[0] : null;
  });
  const [messages, setMessages] = useState<DirectMessage[]>([]);

  // Load messages when activeFriend changes
  useEffect(() => {
    if (activeFriend) {
      const msgs = FriendsService.getMessages(activeFriend.profile.id);
      setMessages(msgs);
    } else {
      setMessages([]);
    }
  }, [activeFriend]);

  const addFriend = useCallback((profile: UserProfile) => {
    const newFriend = FriendsService.addFriend(profile);
    const updated = FriendsService.getFriends();
    setFriends([...updated]);
    return newFriend;
  }, []);

  const removeFriend = useCallback(
    (friendId: string) => {
      FriendsService.removeFriend(friendId);
      const updated = FriendsService.getFriends();
      setFriends([...updated]);
      if (activeFriend?.id === friendId || activeFriend?.profile.id === friendId) {
        setActiveFriend(updated.length > 0 ? updated[0] : null);
      }
    },
    [activeFriend]
  );

  const isFriend = useCallback((profileId: string) => {
    return FriendsService.isFriend(profileId);
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!activeFriend || !text.trim()) return null;

      const sent = FriendsService.sendMessage(activeFriend.profile.id, text.trim());
      setMessages((prev) => [...prev, sent]);

      // Simulate a realistic reply after 1.8s
      setTimeout(() => {
        const replies = [
          'Thanks for the message! Always great hearing from you.',
          'Haha yeah totally agree!',
          'Let me check that out in a bit, tuning into some music right now 🎧',
          'Let’s hop into a video lounge together soon!',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyMsg = FriendsService.sendMessage(activeFriend.profile.id, randomReply);
        setMessages((prev) => [...prev, replyMsg]);

        // Refresh friend list so lastMessage updates
        setFriends([...FriendsService.getFriends()]);
      }, 1800);

      return sent;
    },
    [activeFriend]
  );

  return {
    friends,
    activeFriend,
    messages,
    setActiveFriend,
    addFriend,
    removeFriend,
    isFriend,
    sendMessage,
  };
}
