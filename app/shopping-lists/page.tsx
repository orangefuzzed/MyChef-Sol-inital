// Shopping Lists Page - app/shopping-lists/page.tsx
'use client';

import React from 'react';
import Header from './../components/Header';

const ShoppingListsPage: React.FC = () => {
  return (
    <div>
      <Header centralText="Shopping Lists" />
      <h1>Shopping Lists</h1>
    </div>
  );
};

export default ShoppingListsPage;