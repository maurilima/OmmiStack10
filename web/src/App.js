import React, { useState, useEffect } from "react";
// import UseFormInput from './lib/UserFormInput'
import api from "./services/api";
import DevItem from "./components/DevItem";
import DevForm from "./components/DevForm";


import "./global.css";
import "./App.css";
import "./SideBar.css";
import "./Main.css";

function App() {
  const [devs, setDevs] = useState([]);
 
  

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get("/devs");
      setDevs(response.data);
    }
    loadDevs();
  }, []);


  async function handleAddDev(data) {
    const response = await api.post("/devs", data );

  
  // Evitar Duplicidade ao Adicionar na Lista 
  // com o Dev Retornado se o Mesmo ja Estiver Cadastrado    
    if (devs.find(dev => dev._id === response.data._id ) === undefined) {
        setDevs([...devs, response.data]);
    }
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit ={ handleAddDev } />
       
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
