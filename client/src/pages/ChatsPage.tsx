import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MessageCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Chat {
  id: number;
  clothing_item_id: number;
  donor_id: number;
  requester_id: number;
  created_at: string;
  item_title: string;
  donor_name: string;
  requester_name: string;
}

export function ChatsPage() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchChats = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/chats/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchChats();
  }, [user, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-lg">Carregando conversas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Minhas Conversas</h1>
        </div>

        {chats.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma conversa ainda.</p>
              <Link to="/browse">
                <Button className="mt-4">Explorar Doações</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <Card key={chat.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <Link to={`/chat/${chat.id}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{chat.item_title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="text-sm">
                        {user?.id === chat.donor_id 
                          ? `Conversa com ${chat.requester_name}` 
                          : `Conversa com ${chat.donor_name}`}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Iniciado em {formatDate(chat.created_at)}</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
