import React from 'react';
import Link from 'next/link';

const HomeCard = ({ title, href }) => (
  <Link href={href} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
  </Link>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">MyChef Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <HomeCard title="Recipes" href="/recipes" />
          <HomeCard title="Profile" href="/profile" />
          <HomeCard title="History" href="/history" />
          <HomeCard title="Saved" href="/saved" />
          <HomeCard title="Meal Planning" href="/meal-planning" />
          <HomeCard title="Preferences" href="/preferences" />
        </div>
      </div>
    </div>
  );
};

export default Home;