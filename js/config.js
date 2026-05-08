/**
 * CONFIG - Configurações da Calculadora de Emissões de CO₂
 * Contém fatores de emissão, modos de transporte e configurações de créditos de carbono
 */

const CONFIG = {
  /**
   * Fatores de emissão em kg CO2 por km para cada modo de transporte
   */
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.089,
    truck: 0.96,
  },

  /**
   * Metadados para cada modo de transporte
   * - label: nome em português
   * - icon: emoji representativo
   * - color: código hex para interface
   */
  TRANSPORT_MODES: {
    bicycle: {
      label: "Bicicleta",
      icon: "🚲",
      color: "#10b981",
    },
    car: {
      label: "Carro",
      icon: "🚗",
      color: "#059669",
    },
    bus: {
      label: "Ônibus",
      icon: "🚌",
      color: "#34d399",
    },
    truck: {
      label: "Caminhão",
      icon: "🚛",
      color: "#ef4444",
    },
  },

  /**
   * Configurações para créditos de carbono
   * - KG_PER_CREDIT: kg CO2 neutralizados por crédito
   * - PRICE_MIN_BRL: preço mínimo em reais
   * - PRICE_MAX_BRL: preço máximo em reais
   */
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,
    PRICE_MIN_BRL: 50,
    PRICE_MAX_BRL: 150,
  },

  /**
   * Popula o datalist 'cities-list' com todas as cidades disponíveis
   * Obtém a lista de cidades do RoutesDB e cria elementos option
   */
  populateDatalist: function() {
    const cities = RoutesDB.getAllCities();
    const datalist = document.getElementById('cities-list');

    if (!datalist) {
      console.error('Datalist element with id "cities-list" not found');
      return;
    }

    // Limpa o datalist existente
    datalist.innerHTML = '';

    // Cria option para cada cidade
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      datalist.appendChild(option);
    });
  },

  /**
   * Configura o preenchimento automático da distância
   * Adiciona event listeners para inputs de origem e destino
   */
  setupDistanceAutofill: function() {
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const distanceInput = document.getElementById('distance');
    const manualCheckbox = document.getElementById('manual-distance');
    const helperText = distanceInput.nextElementSibling; // O small com helper text

    if (!originInput || !destinationInput || !distanceInput || !manualCheckbox) {
      console.error('Required form elements not found');
      return;
    }

    // Função para tentar preencher a distância
    const tryFillDistance = () => {
      if (manualCheckbox.checked) return; // Não preenche se manual estiver marcado

      const origin = originInput.value.trim();
      const destination = destinationInput.value.trim();

      if (origin && destination) {
        const distance = RoutesDB.findDistance(origin, destination);
        if (distance !== null) {
          distanceInput.value = distance;
          distanceInput.readOnly = true;
          helperText.textContent = 'Distância encontrada automaticamente';
          helperText.style.color = 'var(--primary)'; // Verde para sucesso
        } else {
          distanceInput.value = '';
          distanceInput.readOnly = true;
          helperText.textContent = 'Rota não encontrada. Marque "Inserir distância manualmente" para inserir manualmente.';
          helperText.style.color = 'var(--warning)'; // Amarelo para aviso
        }
      } else {
        distanceInput.value = '';
        helperText.textContent = 'A distância será preenchida automaticamente';
        helperText.style.color = 'var(--text-light)'; // Cinza padrão
      }
    };

    // Event listeners para inputs de origem e destino
    originInput.addEventListener('change', tryFillDistance);
    destinationInput.addEventListener('change', tryFillDistance);

    // Event listener para checkbox manual
    manualCheckbox.addEventListener('change', () => {
      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;
        distanceInput.value = '';
        helperText.textContent = 'Insira a distância manualmente em km';
        helperText.style.color = 'var(--text-light)';
      } else {
        distanceInput.readOnly = true;
        tryFillDistance(); // Tenta preencher novamente
      }
    });
  },
};