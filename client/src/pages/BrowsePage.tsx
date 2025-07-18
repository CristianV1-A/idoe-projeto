import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';

interface ClothingItem {
  id: number;
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

export function BrowsePage() {
  const [items, setItems] = React.useState<ClothingItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/clothing-items');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  const handleBack = () => {
    navigate(-1);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-lg">Carregando itens de roupa...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Explorar Doações</h1>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">Nenhum item de roupa disponível ainda.</p>
              <Link to="/add-clothing">
                <Button className="mt-4">Seja o primeiro a doar!</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <Link to={`/clothing/${item.id}`}>
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
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                        Tamanho {getSizeLabel(item.size)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{item.donor_location || 'Localização não especificada'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Publicado em {formatDate(item.created_at)}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Doado por {item.donor_name}
                    </p>
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
