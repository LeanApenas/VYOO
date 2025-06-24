const input = document.getElementById('qrInput');
const verifyBtn = document.getElementById('verifyBtn');
const copyInvalidBtn = document.getElementById('copyInvalidBtn');
const errorMsg = document.getElementById('errorMsg');
const resultsDiv = document.getElementById('results');

verifyBtn.addEventListener('click', async () => {
  const codes = input.value.trim().split('\n').map(code => code.trim()).filter(code => code);
  errorMsg.textContent = '';
  resultsDiv.innerHTML = '';
  copyInvalidBtn.style.display = 'none';

  if (!codes.length) {
    errorMsg.textContent = 'Por favor, insira pelo menos um código.';
    return;
  }

<<<<<<< HEAD
  // Validação do formato: começa com TDRJ e termina com 24 ou 25
=======
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
  const qrCodeRegex = /^TDRJ-[A-Z0-9]{5}(24|25)$/;
  const validCodes = [];
  const invalidCodes = [];

  codes.forEach(code => {
    if (qrCodeRegex.test(code)) {
      validCodes.push(code);
    } else {
      invalidCodes.push(code);
    }
  });

  if (invalidCodes.length > 0) {
    errorMsg.textContent = `Códigos com formato inválido: ${invalidCodes.join(', ')}`;
    copyInvalidBtn.style.display = 'inline-block';
  }

  if (!validCodes.length) {
    errorMsg.textContent = 'Nenhum código válido encontrado. Use o formato TDRJ-XXXXX24 ou TDRJ-XXXXX25.';
    copyInvalidBtn.style.display = 'inline-block';
    return;
  }

<<<<<<< HEAD
  // Processar cada código válido
=======
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
  for (const code of validCodes) {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result-item');
    resultDiv.textContent = `Verificando ${code}...`;
    resultsDiv.appendChild(resultDiv);

    try {
<<<<<<< HEAD
      const response = await fetch('http://localhost:3000/verificar', {
=======
      const response = await fetch('/verificar', {
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: code })
      });

      const data = await response.json();

      if (data.valido) {
        if (data.temFotos) {
          resultDiv.classList.add('valid-photos');
          resultDiv.textContent = `✅ ${code}: Código válido com fotos! URL: ${data.url}`;
        } else {
          resultDiv.classList.add('valid-no-photos');
<<<<<<< HEAD
          resultDiv.textContent = `✅ ${code}: Código válido, mas nenhuma foto encontrada. Detalhes: ${JSON.stringify(data.debug)}`;
=======
          resultDiv.textContent = `✅ ${code}: Código válido, mas nenhuma foto encontrada.`;
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
        }
      } else {
        resultDiv.classList.add('invalid');
        resultDiv.textContent = `❌ ${code}: ${data.mensagem || 'O QR Code pesquisado é inválido.'}`;
        invalidCodes.push(code);
        copyInvalidBtn.style.display = 'inline-block';
      }
    } catch (err) {
<<<<<<< HEAD
      console.error(`Erro ao verificar ${code}:`, err);
      resultDiv.classList.add('invalid');
      resultDiv.textContent = `❌ ${code}: Erro ao verificar o código. Tente novamente.`;
=======
      resultDiv.classList.add('invalid');
      resultDiv.textContent = `❌ ${code}: Erro ao verificar o código.`;
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
      invalidCodes.push(code);
      copyInvalidBtn.style.display = 'inline-block';
    }
  }

<<<<<<< HEAD
  // Configurar o botão de copiar códigos inválidos
=======
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
  copyInvalidBtn.onclick = () => {
    if (invalidCodes.length === 0) {
      errorMsg.textContent = 'Nenhum código inválido para copiar.';
      return;
    }
    const invalidText = invalidCodes.sort().join('\n');
    navigator.clipboard.writeText(invalidText).then(() => {
      errorMsg.style.color = 'green';
<<<<<<< HEAD
      errorMsg.textContent = 'Códigos inválidos copiados para a área de transferência!';
=======
      errorMsg.textContent = 'Códigos inválidos copiados!';
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
      setTimeout(() => {
        errorMsg.textContent = '';
        errorMsg.style.color = 'red';
      }, 3000);
    }).catch(err => {
      errorMsg.textContent = 'Erro ao copiar códigos inválidos.';
<<<<<<< HEAD
      console.error('Erro ao copiar:', err);
    });
  };
});
=======
    });
  };
});
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
