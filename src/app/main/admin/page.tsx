// app/admin/page.tsx
'use client';

import { redirect } from 'next/navigation';

export default function AdminPage() {
  // By default, redirect to heads management
  redirect('/main/admin/heads');
}