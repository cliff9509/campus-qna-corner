import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Send, User, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Chat {
  id: string;
  accommodation_id: string;
  tenant_id: string;
  landlord_id: string;
  created_at: string;
  accommodations: { name: string };
  profiles: { display_name: string };
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface ChatManagerProps {
  chats: Chat[];
}

const ChatManager = ({ chats }: ChatManagerProps) => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      
      // Set up real-time subscription for messages
      const channel = supabase
        .channel(`chat_${selectedChat.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `chat_id=eq.${selectedChat.id}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedChat]);

  const fetchMessages = async (chatId: string) => {
    try {
      setMessagesLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          chat_id: selectedChat.id,
          sender_id: user.id,
          message: newMessage.trim()
        }]);

      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = (chat: Chat) => {
    setSelectedChat(chat);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Chat Messages</h2>
        <p className="text-gray-600">Communicate with potential tenants</p>
      </div>

      {chats.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No active chats
            </h3>
            <p className="text-gray-600">
              When tenants message you about properties, they'll appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chats.map((chat) => (
            <Card key={chat.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{chat.accommodations.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <User className="h-3 w-3" />
                      {chat.profiles.display_name || 'Anonymous'}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    New
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(chat.created_at), { addSuffix: true })}
                  </div>
                  
                  <Dialog open={isDialogOpen && selectedChat?.id === chat.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openChat(chat)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Open
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-lg h-[600px] flex flex-col">
                      <DialogHeader>
                        <DialogTitle>
                          Chat: {chat.accommodations.name}
                        </DialogTitle>
                        <p className="text-sm text-gray-600">
                          with {chat.profiles.display_name || 'Anonymous'}
                        </p>
                      </DialogHeader>
                      
                      <div className="flex-1 flex flex-col min-h-0">
                        <ScrollArea className="flex-1 p-4 border rounded-lg">
                          {messagesLoading ? (
                            <div className="text-center text-gray-500">Loading messages...</div>
                          ) : messages.length === 0 ? (
                            <div className="text-center text-gray-500">No messages yet</div>
                          ) : (
                            <div className="space-y-4">
                              {messages.map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${
                                    message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                      message.sender_id === user?.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                                  >
                                    <p className="text-sm">{message.message}</p>
                                    <p
                                      className={`text-xs mt-1 ${
                                        message.sender_id === user?.id
                                          ? 'text-blue-100'
                                          : 'text-gray-500'
                                      }`}
                                    >
                                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                        
                        <div className="flex gap-2 mt-4">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1"
                          />
                          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatManager;