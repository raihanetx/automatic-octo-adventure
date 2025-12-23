'use client';

import { useState, useEffect } from 'react';

interface Admin {
  id: string;
  username: string;
}

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/verify');
      const data = await response.json();

      if (data.authenticated) {
        setIsAdmin(true);
        setAdmin(data.admin);
      } else {
        setIsAdmin(false);
        setAdmin(null);
      }
    } catch (error) {
      console.error('Admin check error:', error);
      setIsAdmin(false);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  return { isAdmin, admin, loading, checkAdminStatus };
}
