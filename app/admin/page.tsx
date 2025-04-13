// app/admin/page.tsx
'use client';

import Dashboard from './adminpage';

export default function AdminPage() {
  const handleSuccess = () => {
    console.log("Success!");
  };

  return (
    <div>
      <Dashboard onSuccess={handleSuccess} />
    </div>
  );
}
