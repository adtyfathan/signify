import { Head, useForm } from '@inertiajs/react';
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

const inputClass =
  "w-full px-3 py-2.5 rounded-xl border border-[#6fb89d]/30 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6fb89d] focus:border-transparent transition";

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'learner',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('register.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <AuthLayout
      title="Buat akun"
      subtitle="Mulai belajar Bahasa Isyarat Indonesia"
      showRegisterLink={false}
      loginLink={route('login')}
    >
      <Head title="Register" />

      <form onSubmit={submit} className="space-y-2.5">

        {/* Name */}
        <Field label="Nama Lengkap" error={errors.name}>
          <input
            type="text"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            placeholder="Nama lengkap kamu"
            autoComplete="name"
            className={inputClass}
          />
        </Field>

        {/* Username */}
        <Field label="Username" error={errors.username}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
            <input
              type="text"
              value={data.username}
              onChange={e => setData('username', e.target.value)}
              placeholder="username_kamu"
              className={`${inputClass} pl-7`}
            />
          </div>
        </Field>

        {/* Email */}
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={data.email}
            onChange={e => setData('email', e.target.value)}
            placeholder="kamu@email.com"
            autoComplete="email"
            className={inputClass}
          />
        </Field>

        {/* Role */}
        <Field label="Status" error={errors.role}>
          <select
            value={data.role}
            onChange={e => setData('role', e.target.value)}
            className={inputClass}
          >
            <option value="learner">Pelajar (Learner)</option>
            <option value="deaf_mute">Tuli / Bisu (Deaf / Mute)</option>
          </select>
        </Field>

        {/* Password — 2 column */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" error={errors.password}>
            <input
              type="password"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              placeholder="Min. 8 karakter"
              className={inputClass}
            />
          </Field>
          <Field label="Konfirmasi" error={errors.password_confirmation}>
            <input
              type="password"
              value={data.password_confirmation}
              onChange={e => setData('password_confirmation', e.target.value)}
              placeholder="Ulangi password"
              className={inputClass}
            />
          </Field>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-[#6fb89d]/40 accent-[#6fb89d] shrink-0"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Saya setuju dengan{' '}
            <a href="#" className="text-[#6fb89d] hover:underline font-medium">Syarat & Ketentuan</a>
            {' '}dan{' '}
            <a href="#" className="text-[#6fb89d] hover:underline font-medium">Kebijakan Privasi</a>
          </span>
        </label>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={processing}
          className="w-full flex items-center justify-center gap-2 bg-[#6fb89d] hover:bg-[#5da889] disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm shadow-[#6fb89d]/30"
        >
          {processing
            ? <><Loader className="w-4 h-4 animate-spin" /> Membuat akun...</>
            : 'Buat Akun Sekarang'
          }
        </motion.button>
      </form>
    </AuthLayout>
  );
}