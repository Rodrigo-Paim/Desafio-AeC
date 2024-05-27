document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const addressForm = document.getElementById('address-form');
    const fetchAddressBtn = document.getElementById('fetch-address');
    const addressList = document.getElementById('address-list');
    const exportCsvBtn = document.getElementById('export-csv');
  
    const apiUrl = 'http://localhost:3000';
    let token = '';
  
    const showAddressManagement = () => {
      document.getElementById('login-register').style.display = 'none';
      document.getElementById('address-management').style.display = 'block';
    };
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
  
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        token = data.token;
        showAddressManagement();
        loadAddresses();
      } else {
        alert(data);
      }
    });
  
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
  
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password }),
      });
  
      if (response.ok) {
        alert('Registration successful');
      } else {
        alert('Registration failed');
      }
    });
  
    addressForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cep = document.getElementById('cep').value;
      const logradouro = document.getElementById('logradouro').value;
      const complemento = document.getElementById('complemento').value;
      const bairro = document.getElementById('bairro').value;
      const cidade = document.getElementById('cidade').value;
      const uf = document.getElementById('uf').value;
      const numero = document.getElementById('numero').value;
  
      await fetch(`${apiUrl}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ cep, logradouro, complemento, bairro, cidade, uf, numero }),
      });
  
      loadAddresses();
    });
  
    fetchAddressBtn.addEventListener('click', async () => {
      const cep = document.getElementById('cep').value;
      const response = await fetch(`${apiUrl}/viacep/${cep}`);
      const data = await response.json();
  
      document.getElementById('logradouro').value = data.logradouro;
      document.getElementById('bairro').value = data.bairro;
      document.getElementById('cidade').value = data.localidade;
      document.getElementById('uf').value = data.uf;
    });
  
    exportCsvBtn.addEventListener('click', async () => {
      const response = await fetch(`${apiUrl}/export/csv`, {
        headers: {
          'Authorization': token,
        },
      });
  
      const csv = await response.text();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'addresses.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  
    const loadAddresses = async () => {
      const response = await fetch(`${apiUrl}/addresses`, {
        headers: {
          'Authorization': token,
        },
      });
  
      const addresses = await response.json();
      addressList.innerHTML = '';
      addresses.forEach((address) => {
        const div = document.createElement('div');
        div.textContent = `${address.logradouro}, ${address.numero}, ${address.bairro}, ${address.cidade}, ${address.uf}, ${address.cep}`;
        addressList.appendChild(div);
      });
    };
  });
  