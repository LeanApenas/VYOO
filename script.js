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

  for (const code of validCodes) {
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result-item');
    resultDiv.textContent = `Verificando ${code}...`;
    resultsDiv.appendChild(resultDiv);

    try {
      const response = await fetch('/verificar', {
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
          resultDiv.textContent = `✅ ${code}: Código válido, mas nenhuma foto encontrada.`;
        }
      } else {
        resultDiv.classList.add('invalid');
        resultDiv.textContent = `❌ ${code}: ${data.mensagem || 'O QR Code pesquisado é inválido.'}`;
        invalidCodes.push(code);
        copyInvalidBtn.style.display = 'inline-block';
      }
    } catch (err) {
      resultDiv.classList.add('invalid');
      resultDiv.textContent = `❌ ${code}: Erro ao verificar o código.`;
      invalidCodes.push(code);
      copyInvalidBtn.style.display = 'inline-block';
    }
  }

  copyInvalidBtn.onclick = () => {
    if (invalidCodes.length === 0) {
      errorMsg.textContent = 'Nenhum código inválido para copiar.';
      return;
    }
    const invalidText = invalidCodes.sort().join('\n');
    navigator.clipboard.writeText(invalidText).then(() => {
      errorMsg.style.color = 'green';
      errorMsg.textContent = 'Códigos inválidos copiados!';
      setTimeout(() => {
        errorMsg.textContent = '';
        errorMsg.style.color = 'red';
      }, 3000);
    }).catch(err => {
      errorMsg.textContent = 'Erro ao copiar códigos inválidos.';
    });
  };
});
