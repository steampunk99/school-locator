export const authService = {
  
  register: async (userData) => {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  },

    login: async (credentials) => {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      return data;
    },
  
    getCurrentUser: async () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to get user');
        }
        
        return response.json();
      } catch (error) {
        console.error('Get current user error:', error);
        return null;
      }
    },
  
    logout: async () => {
      // Add any cleanup API calls here if needed
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };