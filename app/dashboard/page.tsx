'use client'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome to Scan Circle! Your login was successful.
        </p>
        
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500">QR Code and Places API integration will go here.</p>
        </div>
      </div>
    </main>
  )
}