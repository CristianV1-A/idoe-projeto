import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, MessageCircle, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            iDoe
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Compartilhe roupas, espalhe bondade, construa comunidade
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle>Doar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Compartilhe suas roupas não utilizadas com quem precisa
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Conectar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Encontre pessoas na sua comunidade que compartilham seus valores
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Conversar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Conecte-se diretamente com doadores e beneficiários
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          {user ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Bem-vindo de volta, {user.name}!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/add-clothing">
                    <Plus className="h-5 w-5 mr-2" />
                    Doar Roupas
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/browse">Explorar Doações</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/chats">Minhas Conversas</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Junte-se à nossa comunidade hoje
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/register">Começar</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Entrar</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
