import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AuthLayout from '@/Layouts/AuthLayout';
import { AlertCircle, Loader } from 'lucide-react';

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </motion.p>
      )}
    </div>
  );
}

const inputClass = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

export default function Login({ status }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('login.store'), { onFinish: () => reset('password') });
  };

  return (
    <AuthLayout
      title="Selamat datang"
      subtitle="Masuk ke akun Signify kamu"
      showRegisterLink={true}
      registerLink={route('register')}
    >
      <Head title="Login" />

      <form onSubmit={submit} className="space-y-4">
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-xs text-green-700 dark:text-green-400"
          >
            {status}
          </motion.div>
        )}

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={data.email}
            onChange={e => setData('email', e.target.value)}
            placeholder="kamu@email.com"
            autoComplete="username"
            className={inputClass}
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <input
            type="password"
            value={data.password}
            onChange={e => setData('password', e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </Field>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={processing}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm mt-2"
        >
          {processing
            ? <><Loader className="w-4 h-4 animate-spin" /> Masuk...</>
            : 'Masuk ke Akun'
          }
        </motion.button>
      </form>
    </AuthLayout>
  );
}