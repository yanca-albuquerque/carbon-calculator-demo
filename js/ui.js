/**
 * UI - Manipulação de interface e renderização de HTML
 * Contém utilitários de formatação, exibição e templates de resultados
 */

const UI = {
  /**
   * Formata número com casas decimais e separadores de milhar
   * @param {number} number
   * @param {number} decimals
   * @returns {string}
   */
  formatNumber: function(number, decimals) {
    return Number(number)
      .toFixed(decimals)
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },

  /**
   * Formata valor como moeda brasileira
   * @param {number} value
   * @returns {string}
   */
  formatCurrency: function(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  },

  /**
   * Exibe elemento removendo a classe 'hidden'
   * @param {string} elementId
   */
  showElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove('hidden');
    }
  },

  /**
   * Oculta elemento adicionando a classe 'hidden'
   * @param {string} elementId
   */
  hideElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('hidden');
    }
  },

  /**
   * Rola suavemente até um elemento identificado por ID
   * @param {string} elementId
   */
  scrollToElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  /**
   * Renderiza o cartão de resultados principais
   * @param {Object} data
   * @returns {string}
   */
  renderResults: function(data) {
    const modeMeta = CONFIG.TRANSPORT_MODES[data.mode] || {};
    const savingsHtml = data.mode !== 'car' && data.savings
      ? `
        <div class="results__card results__card--savings">
          <h3 class="results__card-title">Economia</h3>
          <p class="results__card-value">${this.formatNumber(data.savings.savedKg, 2)} kg</p>
          <p class="results__card-subtitle">${this.formatNumber(data.savings.percentage, 2)}% em relação ao carro</p>
        </div>
      `
      : '';

    return `
      <div class="results__card results__card--route">
        <h3 class="results__card-title">Rota</h3>
        <p class="results__card-text">${data.origin} → ${data.destination}</p>
      </div>
      <div class="results__card results__card--distance">
        <h3 class="results__card-title">Distância</h3>
        <p class="results__card-value">${this.formatNumber(data.distance, 0)} km</p>
      </div>
      <div class="results__card results__card--emission">
        <h3 class="results__card-title">Emissão de CO₂</h3>
        <p class="results__card-value">🌿 ${this.formatNumber(data.emission, 2)} kg</p>
      </div>
      <div class="results__card results__card--transport">
        <h3 class="results__card-title">Transporte</h3>
        <p class="results__card-text">${modeMeta.icon || ''} ${modeMeta.label || data.mode}</p>
      </div>
      ${savingsHtml}
    `;
  },

  /**
   * Renderiza a comparação entre modos de transporte
   * @param {Array} modesArray
   * @param {string} selectedMode
   * @returns {string}
   */
  renderComparison: function(modesArray, selectedMode) {
    const maxEmission = Math.max(...modesArray.map(item => item.emission), 1);

    const itemsHtml = modesArray.map(modeData => {
      const modeMeta = CONFIG.TRANSPORT_MODES[modeData.mode] || {};
      const isSelected = modeData.mode === selectedMode;
      const progress = Math.round((modeData.emission / maxEmission) * 100);
      const colorClass = progress <= 25 ? 'comparison__progress--green'
        : progress <= 75 ? 'comparison__progress--yellow'
        : progress <= 100 ? 'comparison__progress--orange'
        : 'comparison__progress--red';

      return `
        <div class="comparison__item ${isSelected ? 'comparison__item--selected' : ''}">
          <div class="comparison__item-header">
            <span class="comparison__item-icon">${modeMeta.icon || ''}</span>
            <div>
              <h4 class="comparison__item-title">${modeMeta.label || modeData.mode}</h4>
              <p class="comparison__item-stats">${this.formatNumber(modeData.emission, 2)} kg CO₂</p>
            </div>
            ${isSelected ? '<span class="comparison__item-badge">Selecionado</span>' : ''}
          </div>
          <div class="comparison__item-detail">
            <span>${this.formatNumber(modeData.percentageVsCar, 2)}% do carro</span>
            <div class="comparison__progress-bar">
              <div class="comparison__progress ${colorClass}" style="width: ${progress}%;"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="comparison__items">
        ${itemsHtml}
      </div>
      <div class="comparison__tip">
        <strong>Dica:</strong> escolher modos com menor emissão ajuda a reduzir sua pegada de carbono e economizar energia.
      </div>
    `;
  },

  /**
   * Renderiza informações de créditos de carbono
   * @param {Object} creditsData
   * @returns {string}
   */
  renderCarbonCredits: function(creditsData) {
    return `
      <div class="carbon-credits__grid">
        <div class="carbon-credits__card">
          <h3 class="carbon-credits__title">Créditos necessários</h3>
          <p class="carbon-credits__value">${this.formatNumber(creditsData.credits, 4)}</p>
          <p class="carbon-credits__helper">1 crédito = 1000 kg CO₂</p>
        </div>
        <div class="carbon-credits__card">
          <h3 class="carbon-credits__title">Preço estimado</h3>
          <p class="carbon-credits__value">${this.formatCurrency(creditsData.price.average)}</p>
          <p class="carbon-credits__helper">Faixa: ${this.formatCurrency(creditsData.price.min)} - ${this.formatCurrency(creditsData.price.max)}</p>
        </div>
      </div>
      <div class="carbon-credits__info">
        <p>Créditos de carbono ajudam a compensar emissões investindo em projetos de reflorestamento e energia renovável.</p>
      </div>
      <button class="carbon-credits__button" type="button">🛒 Compensar Emissões</button>
    `;
  },

  /**
   * Mostra estado de carregamento no botão de envio
   * @param {HTMLButtonElement} buttonElement
   */
  showLoading: function(buttonElement) {
    if (!buttonElement) return;
    buttonElement.dataset.originalText = buttonElement.innerHTML;
    buttonElement.disabled = true;
    buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
  },

  /**
   * Restaura o botão após estado de carregamento
   * @param {HTMLButtonElement} buttonElement
   */
  hideLoading: function(buttonElement) {
    if (!buttonElement) return;
    buttonElement.disabled = false;
    if (buttonElement.dataset.originalText) {
      buttonElement.innerHTML = buttonElement.dataset.originalText;
    }
  },
};
