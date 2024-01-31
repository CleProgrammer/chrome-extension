import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const c = (cl: any) => document.querySelector(cl)

  const [saveData, setSaveData] = useState<any[]>([])

  let db: any;

const openAddNote = () => {
  c('.App .note-main').style.display = 'flex'

  c('.App .app-main').scrollTop = c('.App .app-main').scrollHeight;

  const request = indexedDB.open('notes', 1);

  request.onerror = function(event:any) {
    console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
  };

  request.onsuccess = function(event:any) {
    db = event.target.result;
    console.log('Banco de dados aberto com sucesso');
    // Chamar a função para adicionar notas após o sucesso da abertura do banco de dados
    //addNote();
  };

  request.onupgradeneeded = function(event: any) {
    db = event.target.result;

    const objectStore = db.createObjectStore('note', { keyPath: 'id', autoIncrement: true });
    console.log('Upgrade do banco de dados realizado');
  };
};

const cancelAddNote = () => {
  c('.App .note-main').style.display = 'none'
  c('.App .note-main .section-add-textarea').value = ''
}

const addNote = () => {

  const openDB = () => {
    const request = indexedDB.open('notes', 1);
  
    request.onerror = function (event:any) {
      console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
    };
  
    request.onsuccess = function (event:any) {
      db = event.target.result;
      console.log('Banco de dados aberto com sucesso');
      // Chamar a função para editar dados após o sucesso da abertura do banco de dados
      addData();
    };
  
    request.onupgradeneeded = function (event:any) {
      db = event.target.result;
  
      const objectStore = db.createObjectStore('note', { keyPath: 'id', autoIncrement: true });
      console.log('Upgrade do banco de dados realizado');
    };
  };

  const addData = () => {
    const transaction = db.transaction(['note'], 'readwrite');
    const objectStore = transaction.objectStore('note');

    const fieldValue = c('.App .note-main .section-add-textarea').value; // Supondo que c('.section-add-textarea') retorna o campo correto

    const currentDate = new Date()
    const data = { fieldName: fieldValue, date: currentDate.toLocaleString('pt-BR') }; // Removendo o id, pois é autoincrementado

    const request = objectStore.add(data);

    request.onsuccess = function(event:any) {
      console.log('Dados adicionados com sucesso');
    };

    request.onerror = function(event:any) {
      console.error('Erro ao adicionar dados:', event.target.errorCode);
    };

    c('.section-add-textarea').value = ''
    c('.App .note-main').style.display = 'none'
  }
  
  openDB()
};


const editNote = (e:any) => {
  console.log( e.target.id )
  if( c(`.app-main #id${e.target.id} .buttons-note-box .button-edit`).innerHTML === '✎' ) {
    c(`.app-main #id${e.target.id} .section-note-box-textarea`).removeAttribute('readOnly')
    c(`.app-main #id${e.target.id} .buttons-note-box .button-edit`).innerHTML = '✔'
  } else {
    c(`.app-main #id${e.target.id} .section-note-box-textarea`).setAttribute('readOnly', true)
    c(`.app-main #id${e.target.id} .buttons-note-box .button-edit`).innerHTML = '✎'

    const openDB = () => {
      const request = indexedDB.open('notes', 1);
    
      request.onerror = function (event:any) {
        console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
      };
    
      request.onsuccess = function (event:any) {
        db = event.target.result;
        console.log('Banco de dados aberto com sucesso');
        // Chamar a função para editar dados após o sucesso da abertura do banco de dados
        editData();
      };
    
      request.onupgradeneeded = function (event:any) {
        db = event.target.result;
    
        const objectStore = db.createObjectStore('note', { keyPath: 'id', autoIncrement: true });
        console.log('Upgrade do banco de dados realizado');
      };
    };
    
    const editData = () => {
      const transaction = db.transaction(['note'], 'readwrite');
      const objectStore = transaction.objectStore('note');
    
      const recordToUpdate = parseInt( e.target.id ); // ID do registro que você deseja atualizar
      const currentDate = new Date()
      //const data = { fieldName: fieldValue, date: currentDate.toLocaleString('pt-BR') };
      const updatedData = { id: recordToUpdate, fieldName: c(`.app-main #id${e.target.id} .section-note-box-textarea`).value, date: currentDate.toLocaleString('pt-BR') }; // Novos valores para o registro
    
      const request = objectStore.put(updatedData);
    
      request.onsuccess = function (event:any) {
        console.log('Registro atualizado com sucesso');
      };
    
      request.onerror = function (event:any) {
        console.error('Erro ao atualizar o registro:', event.target.errorCode);
      };
    };
    
    openDB();

    
  }
}

const deleteNote = (e:any) => {
  const openDB = () => {
    const request = indexedDB.open('notes', 1);
  
    request.onerror = function (event:any) {
      console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
    };
  
    request.onsuccess = function (event:any) {
      db = event.target.result;
      console.log('Banco de dados aberto com sucesso');
      // Chamar a função para excluir dados após o sucesso da abertura do banco de dados
      deleteData();
    };
  
    request.onupgradeneeded = function (event:any) {
      db = event.target.result;
  
      const objectStore = db.createObjectStore('note', { keyPath: 'id', autoIncrement: true });
      console.log('Upgrade do banco de dados realizado');
    };
  };
  
  const deleteData = () => {
    const transaction = db.transaction(['note'], 'readwrite');
    const objectStore = transaction.objectStore('note');
  
    const recordToDelete = parseInt(e.target.id); // ID do registro que você deseja excluir
  
    const request = objectStore.delete(recordToDelete);
  
    request.onsuccess = function (event:any) {
      console.log('Registro excluído com sucesso');
    };
  
    request.onerror = function (event:any) {
      console.error('Erro ao excluir o registro:', event.target.errorCode);
    };
  };
  
  openDB();

  
}

  useEffect(() => {
    const openDB = () => {
      const request = indexedDB.open('notes', 1);

      request.onerror = function (event: any) {
        console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
      };

      request.onsuccess = function (event:any) {
        db = event.target.result;
        //console.log('Banco de dados aberto com sucesso');
        // Chamar a função para recuperar dados após o sucesso da abertura do banco de dados
        retrieveData();
      };

      request.onupgradeneeded = function (event:any) {
        db = event.target.result;

        const objectStore = db.createObjectStore('note', { keyPath: 'id', autoIncrement: true });
        console.log('Upgrade do banco de dados realizado');
      };
    };

    const retrieveData = () => {
      const transaction = db.transaction(['note'], 'readonly');
      const objectStore = transaction.objectStore('note');

      const getRequest = objectStore.getAll();

      getRequest.onsuccess = function (event:any) {
        const result = event.target.result;
        //console.log('Dados recuperados:', result);
        setSaveData( result )
      };

      getRequest.onerror = function (event:any) {
        console.error('Erro ao recuperar dados:', event.target.errorCode);
      };

    };

    openDB();
  })

  return (
    <div className="App">
      <div className='app-main'>
        { saveData.map((item:any) => (
          <div key={item.id} id={`id${item.id}`} className='note-box'>
            <div className='section-text-note'>
              <textarea className='section-note-box-textarea' readOnly>{item.fieldName}</textarea>
              <div className='date-note'>{item.date}</div>
            </div>

            <div className='buttons-note-box'>
              <div id={item.id} onClick={deleteNote}  style={{cursor: "pointer"}}>&#9851;</div>
              <div id={item.id} onClick={editNote} className='button-edit' style={{cursor: "pointer"}}>&#9998;</div>
            </div>
          </div>
        ))}

        <div className='note-main'>
          <textarea className='section-add-textarea'></textarea>
          <div className='buttons'>
            <div onClick={cancelAddNote} style={{cursor:"pointer"}}>X</div>
            <div onClick={addNote} style={{cursor:"pointer"}}>✔</div>
          </div>
        </div>
      </div>
      <div onClick={openAddNote} className='add-note'>✚</div>
    </div>
  );
}

export default App;
