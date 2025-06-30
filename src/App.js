import React from 'react';
import 'antd/dist/reset.css'; // Для Ant Design 5.x
// или import 'antd/dist/antd.min.css'; // Для Ant Design 4.x
import DataTable from './components/DataTable'; // Убедитесь, что файл существует

function App() {
  return (
    <div className="App">
      <DataTable />
    </div>
  );
}

export default App;
