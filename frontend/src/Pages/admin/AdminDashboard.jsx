import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import { stackService } from '../../services/stackService';
import { getAllStackImages } from '../../services/imageService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    newsCount: 0,
    stackCount: 0,
    photoCount: 0,
    loading: true,
  });

  const [recentNews, setRecentNews] = useState([]);
  const [recentStacks, setRecentStacks] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentData();
  }, []);

  const fetchStats = async () => {
    try {
      const [newsRes, stacksRes, photosRes] = await Promise.all([
        newsService.getAllNews().catch(() => ({ data: [] })),
        stackService.getAllStacks().catch(() => ({ data: [] })),
        getAllStackImages().catch(() => ({ data: [] })),
      ]);

      setStats({
        newsCount: newsRes?.data?.length || 0,
        stackCount: stacksRes?.data?.length || 0,
        photoCount: photosRes?.data?.length || 0,
        loading: false,
      });
    } catch (error) {
      console.error('Stats yüklenemedi:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchRecentData = async () => {
    try {
      const [newsRes, stacksRes] = await Promise.all([
        newsService.getAllNews({ limit: 5 }).catch(() => ({ data: [] })),
        stackService.getAllStacks({ limit: 5 }).catch(() => ({ data: [] })),
      ]);

      setRecentNews(newsRes?.data?.slice(0, 5) || []);
      setRecentStacks(stacksRes?.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Son veriler yüklenemedi:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">🎛️ Admin Paneli</h1>
          <p className="text-gray-600 mt-2">Hoş geldiniz! Sistemdeki tüm içerikleri buradan yönetebilirsiniz.</p>
        </div>

        {/* İstatistik Kartları */}
        {stats.loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/admin/news" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Toplam Haberler</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">{stats.newsCount}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <span className="text-4xl">📰</span>
                </div>
              </div>
              <div className="mt-4 text-blue-600 font-medium hover:underline">
                Haberleri Yönet →
              </div>
            </Link>

            <Link to="/admin/stacks" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Toplam Yığınlar</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{stats.stackCount}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <span className="text-4xl">📚</span>
                </div>
              </div>
              <div className="mt-4 text-green-600 font-medium hover:underline">
                Yığınları Yönet →
              </div>
            </Link>

            <Link to="/admin/photos" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Toplam Fotoğraflar</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">{stats.photoCount}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-full">
                  <span className="text-4xl">📸</span>
                </div>
              </div>
              <div className="mt-4 text-purple-600 font-medium hover:underline">
                Fotoğrafları Yönet →
              </div>
            </Link>
          </div>
        )}

        {/* Hızlı Erişim */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Son Haberler */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">📰 Son Haberler</h2>
              <Link to="/admin/news" className="text-blue-600 hover:underline text-sm">
                Tümünü Gör →
              </Link>
            </div>
            <div className="space-y-3">
              {recentNews.length > 0 ? (
                recentNews.map((news) => (
                  <div key={news.guid} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-medium text-gray-900 text-sm">
                      {news.title?.substring(0, 60)}...
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {news.category} • {new Date(news.pubDate).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Henüz haber yok</p>
              )}
            </div>
          </div>

          {/* Son Yığınlar */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">📚 Son Yığınlar</h2>
              <Link to="/admin/stacks" className="text-green-600 hover:underline text-sm">
                Tümünü Gör →
              </Link>
            </div>
            <div className="space-y-3">
              {recentStacks.length > 0 ? (
                recentStacks.map((stack) => (
                  <div key={stack._id} className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="font-medium text-gray-900 text-sm">
                      {stack.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        stack.status === 'approved' ? 'bg-green-100 text-green-800' :
                        stack.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {stack.status === 'approved' ? 'Onaylandı' : 
                         stack.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                      </span>
                      <span>{stack.news?.length || 0} haber</span>
                      {stack.isFeatured && <span>⭐</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Henüz yığın yok</p>
              )}
            </div>
          </div>
        </div>

        {/* Hızlı İşlemler */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/news" 
              className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
              <span className="text-3xl">➕</span>
              <div>
                <div className="font-medium text-gray-900">Yeni Haber Ekle</div>
                <div className="text-sm text-gray-600">Sisteme yeni haber ekleyin</div>
              </div>
            </Link>

            <Link to="/admin/stacks"
              className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
              <span className="text-3xl">📚</span>
              <div>
                <div className="font-medium text-gray-900">Yeni Yığın Oluştur</div>
                <div className="text-sm text-gray-600">Haber yığını oluşturun</div>
              </div>
            </Link>

            <Link to="/admin/photos"
              className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
              <span className="text-3xl">📤</span>
              <div>
                <div className="font-medium text-gray-900">Fotoğraf Yükle</div>
                <div className="text-sm text-gray-600">Yığınlara fotoğraf ekleyin</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;