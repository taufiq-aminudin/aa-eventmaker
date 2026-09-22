import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  ShieldAlert,
  CreditCard,
  Mail,
  Calendar,
  Sparkles,
  Users,
  X,
  Settings,
  RefreshCw,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { InAppNotification, NotificationCategory } from '../types';
import { NotificationService } from '../services/NotificationService';
import { useEvent } from '../context/EventContext';
import { useRouter } from '../context/RouterContext';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  const { currentUser, showToast } = useEvent();
  const { navigate } = useRouter();

  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (unreadOnly) q.set('unreadOnly', 'true');
      if (activeCategory !== 'ALL') q.set('category', activeCategory);

      const res = await fetch(`/api/notifications?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Load notifications failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, activeCategory, unreadOnly]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await NotificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    showToast('Semua notifikasi ditandai sebagai telah dibaca.');
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await NotificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleItemClick = (notification: InAppNotification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      onClose();
      navigate(notification.actionUrl);
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'SECURITY':
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'PAYMENT':
      case 'SUBSCRIPTION':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'EVENT':
      case 'INVITATION':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'RSVP':
      case 'GUEST':
      case 'CHECK_IN':
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins}m yang lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}j yang lalu`;
    const days = Math.floor(hours / 24);
    return `${days}h yang lalu`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="notification-center-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-lg">Pusat Notifikasi</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-700">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Pembaruan akun, pembayaran, RSVP, dan keamanan acara Anda
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadNotifications}
              disabled={loading}
              title="Perbarui notifikasi"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white text-xs">
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'EVENT', label: 'Acara & Undangan' },
              { id: 'RSVP', label: 'RSVP & Tamu' },
              { id: 'PAYMENT', label: 'Pembayaran' },
              { id: 'SECURITY', label: 'Keamanan' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span className="text-xs">Hanya Belum Dibaca</span>
            </label>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-1 px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Tandai Semua Dibaca</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 min-h-[300px]">
          {loading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <p className="text-sm font-medium">Memuat notifikasi...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Bell className="w-6 h-6 text-slate-300" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">Tidak Ada Notifikasi</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                {unreadOnly
                  ? 'Semua notifikasi dalam kategori ini telah dibaca.'
                  : 'Anda belum memiliki pemberitahuan baru saat ini.'}
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`p-3.5 rounded-xl transition-all flex items-start space-x-3 cursor-pointer group ${
                  notif.isRead
                    ? 'bg-white hover:bg-slate-50'
                    : 'bg-blue-50/40 hover:bg-blue-50/70 border-l-4 border-blue-600'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h5
                      className={`text-sm truncate ${
                        notif.isRead ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'
                      }`}
                    >
                      {notif.title}
                    </h5>
                    <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    {notif.actionUrl ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 group-hover:underline">
                        <span>{notif.actionLabel || 'Lihat Detail'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    ) : (
                      <span />
                    )}

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(notif.id, e)}
                          title="Tandai telah dibaca"
                          className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(notif.id, e)}
                        title="Hapus notifikasi"
                        className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => {
              onClose();
              if (onOpenSettings) onOpenSettings();
              else navigate('/settings');
            }}
            className="flex items-center space-x-1.5 text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Atur Preferensi Notifikasi & Email</span>
          </button>

          <span className="text-[11px] text-slate-400">
            AA Event Maker Real-Time Gateway
          </span>
        </div>
      </div>
    </div>
  );
};
