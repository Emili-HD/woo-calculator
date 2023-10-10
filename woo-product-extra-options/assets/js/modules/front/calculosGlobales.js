// calculosGlobales.js
// calculosPersonalizados
class Calculos {
    constructor() {
        this.customCalculosIniciales = [];
        this.calculosInicialesCopisteria = [];
        this.customCalculosPapeles = [];
        this.customCalculosImpresiones = [];
        this.customCalculosCortes = [];
        this.customCalculosCantos = [];
        this.customCalculosLaminados = [];
        this.customCalculosHendidos = [];
        this.calculosGrapado = [];
        this.calculosEncuadernado = [];
        this.calculosPlastificado = [];
        // this.calculosCustomTamanos = [];
        this.customTotales = [];
    }

    getCalculos() {
        return {
            customCalculosIniciales: this.customCalculosIniciales,
            calculosInicialesCopisteria: this.calculosInicialesCopisteria,
            customCalculosPapeles: this.customCalculosPapeles,
            customCalculosImpresiones: this.customCalculosImpresiones,
            customCalculosCortes: this.customCalculosCortes,
            customCalculosCantos: this.customCalculosCantos,
            customCalculosLaminados: this.customCalculosLaminados,
            customCalculosHendidos: this.customCalculosHendidos,
            calculosGrapado: this.calculosGrapado,
            calculosEncuadernado: this.calculosEncuadernado,
            calculosPlastificado: this.calculosPlastificado,
            // calculosCustomTamanos: this.calculosCustomTamanos,
            customTotales: this.customTotales,
        };
    }
}

export const calculosPersonalizados = new Calculos();
