module.exports = app => {

    function existsOrError(value, msg) {
        if (!value) throw msg
        if (Array.isArray(value) && value.length === 0) throw msg
        if (typeof value === 'string' && !value.trim()) throw msg
    }

    function notExistsOrError(value, msg) {

        try {
            existsOrError(value, msg)
        }
        catch (msg) {
            return
        }
        throw msg
    }

    function equalsOrError(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg
    }

    function cpfValidator(value, msg) {
        var Soma;
        var Resto;
        Soma = 0;

        for (i = 1; i <= 9; i++) Soma = Soma + parseInt(value.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(value.substring(9, 10))) throw msg;

        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(value.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(value.substring(10, 11))) throw msg;
    }

    function cnpjValidator(value, msg) {

        value = value.replace(/[^\d]+/g, '');

        if (value == '') throw msg;

        if (value.length != 14)
            throw msg;


        if (value == "00000000000000" ||
            value == "11111111111111" ||
            value == "22222222222222" ||
            value == "33333333333333" ||
            value == "44444444444444" ||
            value == "55555555555555" ||
            value == "66666666666666" ||
            value == "77777777777777" ||
            value == "88888888888888" ||
            value == "99999999999999")
            throw msg;


        tamanho = value.length - 2
        numeros = value.substring(0, tamanho);
        digitos = value.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) throw msg;
        tamanho = tamanho + 1;
        numeros = value.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            throw msg;

    }

    return {
        existsOrError,
        notExistsOrError,
        equalsOrError,
        cpfValidator,
        cnpjValidator,
    };
}