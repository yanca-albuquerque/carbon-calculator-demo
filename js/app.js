/**
 * app.js - Inicialização da aplicação e manipulação de eventos
 * Configura o autocomplete, autofill de distância e o cálculo de emissões
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializa dados e comportamentos do formulário
  CONFIG.populateDatalist();
  CONFIG.setupDistanceAutofill();

  const calculatorForm = document.getElementById('calculator-form');

  if (!calculatorForm) {
    console.error('Formulário de cálculo não encontrado.');
    return;
  }

  calculatorForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const distanceInput = document.getElementById('distance');
    const transportModeInput = document.querySelector('input[name="transport"]:checked');
    const submitButton = calculatorForm.querySelector('button[type="submit"]');

    const origin = originInput ? originInput.value.trim() : '';
    const destination = destinationInput ? destinationInput.value.trim() : '';
    const distance = distanceInput ? parseFloat(distanceInput.value) : NaN;
    const transportMode = transportModeInput ? transportModeInput.value : '';

    // Validação básica de campos obrigatórios
    if (!origin || !destination) {
      alert('Por favor, preencha origem e destino.');
      return;
    }

    if (!distance || distance <= 0) {
      alert('Por favor, informe uma distância válida maior que zero.');
      return;
    }

    if (!transportMode) {
      alert('Selecione um modo de transporte.');
      return;
    }

    if (submitButton) {
      UI.showLoading(submitButton);
    }

    UI.hideElement('results');
    UI.hideElement('comparison');
    UI.hideElement('carbon-credits');

    setTimeout(function() {
      try {
        const emission = Calculator.calculateEmission(distance, transportMode);
        const carEmission = Calculator.calculateEmission(distance, 'car');
        const savings = Calculator.calculateSavings(emission, carEmission);
        const comparisonModes = Calculator.calculateAllModes(distance);
        const credits = Calculator.calculateCarbonCredits(emission);
        const priceEstimate = Calculator.estimateCreditPrice(credits);

        const resultsHtml = UI.renderResults({
          origin: origin,
          destination: destination,
          distance: distance,
          emission: emission,
          mode: transportMode,
          savings: savings,
        });

        const comparisonHtml = UI.renderComparison(comparisonModes, transportMode);

        const carbonCreditsHtml = UI.renderCarbonCredits({
          credits: credits,
          price: priceEstimate,
        });

        const resultsContent = document.getElementById('results-content');
        const comparisonContent = document.getElementById('comparison-content');
        const carbonCreditsContent = document.getElementById('carbon-credits-content');

        if (resultsContent) {
          resultsContent.innerHTML = resultsHtml;
        }

        if (comparisonContent) {
          comparisonContent.innerHTML = comparisonHtml;
        }

        if (carbonCreditsContent) {
          carbonCreditsContent.innerHTML = carbonCreditsHtml;
        }

        UI.showElement('results');
        UI.showElement('comparison');
        UI.showElement('carbon-credits');
        UI.scrollToElement('results');
      } catch (error) {
        console.error('Erro ao calcular emissões:', error);
        alert('Ocorreu um erro ao calcular a emissão. Tente novamente.');
      } finally {
        if (submitButton) {
          UI.hideLoading(submitButton);
        }
      }
    }, 1500);
  });

  console.log('✅ Calculadora inicializada!');
});