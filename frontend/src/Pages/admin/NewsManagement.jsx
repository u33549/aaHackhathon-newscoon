import React, { useState, useEffect } from 'react';
import { newsService } from '../../services/newsService';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [formData, setFormData] = useState({
    guid: '', title: '', description: '', link: '', pubDate: '', image: '', category: ''
  });

  useEffect(() => { fetchNews(); }, []);
  useEffect(() => { filterNews(); }, [news, searchTerm, categoryFilter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsService.getAllNews({ limit: 1000 });
      setNews(response.data || []);
    } catch (error) {
      alert('Haberler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = [...news];
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) filtered = filtered.filter(item => item.category === categoryFilter);
    setFilteredNews(filtered);
    setCurrentPage(1);
  };

  const handleSubmit = async () => {
    try {
      if (editingNews) {
        await newsService.updateNewsByGuid(editingNews.guid, formData);
        alert('Haber güncellendi!');
      } else {
        await newsService.createNews({
          ...formData,
          guid: formData.guid || `news-${Date.now()}`,
          pubDate: formData.pubDate || new Date().toISOString()
        });
        alert('Haber eklendi!');
      }
      setShowModal(false);
      setEditingNews(null);
      resetForm();
      fetchNews();
    } catch (error) {
      alert('Hata: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      guid: newsItem.guid || '', title: newsItem.title || '', description: newsItem.description || '',
      link: newsItem.link || '', pubDate: newsItem.pubDate?.split('T')[0] || '',
      image: newsItem.image || '', category: newsItem.category || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (guid) => {
    if (!window.confirm('Bu haberi silmek istediğinize emin misiniz?')) return;
    try {
      await newsService.deleteNewsByGuid(guid);
      alert('Haber silindi!');
      fetchNews();
    } catch (error) {
      alert('Silme hatası!');
    }
  };

  const resetForm = () => {
    setFormData({ guid: '', title: '', description: '', link: '', pubDate: '', image: '', category: '' });
  };

  const categories = [...new Set(news.map(item => item.category).filter(Boolean))];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">📰 Haber Yönetimi</h1>
          <p className="text-gray-600 mt-1">Toplam {filteredNews.length} haber</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" placeholder="🔍 Haber ara..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Tüm Kategoriler</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="10">10 kayıt</option>
              <option value="20">20 kayıt</option>
              <option value="50">50 kayıt</option>
              <option value="100">100 kayıt</option>
            </select>

            <button onClick={() => { setEditingNews(null); resetForm(); setShowModal(true); }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
              ➕ Yeni Haber Ekle
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((item) => (
                    <tr key={item.guid} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {item.image && <img src={item.image} alt="" className="h-10 w-10 rounded object-cover mr-3" />}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.title?.substring(0, 60)}</div>
                            <div className="text-sm text-gray-500">{item.description?.substring(0, 80)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category || 'Genel'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.pubDate).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-4">
                          ✏️ Düzenle
                        </button>
                        <button onClick={() => handleDelete(item.guid)} className="text-red-600 hover:text-red-900">
                          🗑️ Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 mt-4 rounded-lg flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredNews.length)} / {filteredNews.length}
                </div>
                <div className="flex gap-2">
                  {[...Array(Math.min(totalPages, 10))].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingNews ? '✏️ Haber Düzenle' : '➕ Yeni Haber Ekle'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Başlık *</label>
                    <input type="text" name="title" value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Açıklama *</label>
                    <textarea name="description" value={formData.description} rows="4"
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Link *</label>
                    <input type="url" name="link" value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Kategori</label>
                      <input type="text" name="category" value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tarih</label>
                      <input type="date" name="pubDate" value={formData.pubDate}
                        onChange={(e) => setFormData({...formData, pubDate: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Görsel URL</label>
                    <input type="url" name="image" value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  {!editingNews && (
                    <div>
                      <label className="block text-sm font-medium mb-1">GUID (opsiyonel)</label>
                      <input type="text" name="guid" value={formData.guid}
                        onChange={(e) => setFormData({...formData, guid: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button onClick={handleSubmit}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                      {editingNews ? '💾 Güncelle' : '➕ Ekle'}
                    </button>
                    <button onClick={() => { setShowModal(false); setEditingNews(null); resetForm(); }}
                      className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium">
                      ❌ İptal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagement;