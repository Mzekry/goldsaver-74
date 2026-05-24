
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function translateAuthError(msg: string): string {
  if (msg.includes('Invalid login credentials'))  return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
  if (msg.includes('Email not confirmed'))         return 'يرجى تأكيد بريدك الإلكتروني أولاً.';
  if (msg.includes('User already registered'))     return 'هذا البريد الإلكتروني مسجل بالفعل.';
  if (msg.includes('Password should be'))          return 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل.';
  if (msg.includes('Unable to validate'))          return 'تعذّر التحقق من البيانات، حاول مجدداً.';
  if (msg.includes('rate limit'))                  return 'طلبات كثيرة جداً، انتظر قليلاً ثم حاول.';
  if (msg.includes('network') || msg.includes('fetch')) return 'تعذّر الاتصال بالخادم، تحقق من الإنترنت.';
  return msg;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: 'تم تسجيل الدخول بنجاح',
            description: 'مرحباً بك في سجل الذهب!',
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: 'تم تسجيل الخروج',
            description: 'إلى اللقاء!',
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw new Error(error.message);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'فشل تسجيل الدخول',
        description: translateAuthError(err.message),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw new Error(error.message);
      }
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.',
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'فشل إنشاء الحساب',
        description: translateAuthError(err.message),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      navigate('/auth');
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'فشل تسجيل الخروج',
        description: translateAuthError(err.message),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'فشل تسجيل الدخول بـ Google',
        description: translateAuthError(err.message),
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      signIn, 
      signUp, 
      signOut, 
      signInWithGoogle, 
      loading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
