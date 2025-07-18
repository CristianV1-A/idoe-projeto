import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ClothingItem {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  image_url: string | null;
  created_at: string;
  donor_name: string;
  donor_location: string | null;
}

export function ClothingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = React.useState<ClothingItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [chatLoading, setChatLoading] = React.useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/clothing-items/${id}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
      }
    } catch (error) {
      console.error('Error fetching item:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchItem();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleStartChat = async () => {
    if (!user || !item) {
      navigate('/login');
      return;
    }

    setChatLoading(true);
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clothing_item_id: item.id,
          donor_id: item.user_id,
          requester_id: user.id,
        }),
      });

      if (response.ok) {
        const chat = await response.json();
        navigate(`/chat/${chat.id}`);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      tops: 'Blusas',
      bottoms: 'Calças',
      dresses: 'Vestidos',
      outerwear: 'Casacos',
      shoes: 'Sapatos',
      accessories: 'Acessórios'
    };
    return categories[category] || category;
  };

  const getSizeLabel = (size: string) => {
    const sizes = {
      pp: 'PP',
      p: 'P',
      m: 'M',
      g: 'G',
      gg: 'GG',
      xgg: 'XGG'
    };
    return sizes[size] || size.toUpperCase();
  };

  const getConditionLabel = (condition: string) => {
    const conditions = {
      new: 'Novo',
      'like-new': 'Seminovo',
      good: 'Bom',
      fair: 'Regular'
    };
    return conditions[condition] || condition;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-lg">Carregando detalhes do item...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-lg">Item não encontrado.</p>
      </div>
    );
  }

  const isOwner = user && user.id === item.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <Card>
          {item.image_url && (
            <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">{item.title}</CardTitle>
            <CardDescription className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {getCategoryLabel(item.category)}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Tamanho {getSizeLabel(item.size)}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                {getConditionLabel(item.condition)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700">
                {item.description || 'Nenhuma descrição fornecida.'}
              </p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Detalhes da Doação</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{item.donor_location || 'Localização não especificada'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Publicado em {formatDate(item.created_at)}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Doado por {item.donor_name}
                </p>
              </div>
            </div>
            
            {!isOwner && (
              <div className="border-t pt-4">
                <Button 
                  onClick={handleStartChat} 
                  className="w-full"
                  disabled={chatLoading}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {chatLoading ? 'Iniciando Conversa...' : 'Conversar com Doador'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
