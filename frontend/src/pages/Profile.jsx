import React, { useContext, useState } from 'react';
import { User, Mail, Shield, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center">
            {user.first_name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user.first_name} {user.last_name}</h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-600">
              Role: {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 text-slate-700">
            <Mail className="w-5 h-5 text-sky-500" />
            <span>Email: <strong>{user.email}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <Phone className="w-5 h-5 text-sky-500" />
            <span>Phone: <strong>{user.phone_number || 'Not added'}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <Shield className="w-5 h-5 text-sky-500" />
            <span>Email Status: <strong>{user.is_email_verified ? 'Verified ✓' : 'Unverified'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
