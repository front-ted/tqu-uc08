$(document).ready(function () {
    $('#modal-introducao').modal('show');

    var items = $('.item');
    var cards = $('.card');
    var numItems = items.length;
    var radius = 105;
    var indexAtivo = 0;
    var respostasCorretasTotal = 0;
    var totalRespostas = 7;
    var respostasDadas = [];


    var respostasCorretas = [
        'Superprodução',
        'Tempo de espera',
        'Transporte',
        'Excesso de processamento',
        'Estoque',
        'Movimento',
        'Defeitos'
    ];

    var feedbackNegativoLetras = {
        'Capacitação': 'feedback-negativo-a',
        'Inovação': 'feedback-negativo-b',
        'Manutenção': 'feedback-negativo-c',
        'Flexibilidade': 'feedback-negativo-d',
        'Qualidade': 'feedback-negativo-e',
        'Padronização': 'feedback-negativo-f',
        'Treinamento': 'feedback-negativo-g'
    };


    function posicionarItens() {
        items.each(function (index) {
            var angulo = ((index - indexAtivo) / numItems) * (2 * Math.PI) + (Math.PI / 2);
            var x = Math.cos(angulo) * radius + 115;
            var y = Math.sin(angulo) * radius + 115;
            if ($(this).hasClass('ativo')) {
                y += 50;
            }
            $(this).css({
                left: x + 'px',
                top: y + 'px',
                'transform': 'rotate(0deg)',
                'transition': 'left 0.5s, top 0.5s'
            });
        });
    }

    function atualizarCardVisivel() {
        cards.hide();
        $(cards[indexAtivo]).show();
    }

    function rotacionarCarrossel(direcao) {
        indexAtivo = (indexAtivo - direcao + numItems) % numItems;
        atualizarItemAtivo();
        posicionarItens();
        atualizarCardVisivel();
        trocarImagemItem();
        $('#som-roleta')[0].play();
    }

    function atualizarItemAtivo() {
        $('.item.ativo').removeClass('ativo');
        $(items[indexAtivo]).addClass('ativo');
        trocarImagemItem();
    }

    posicionarItens();
    atualizarCardVisivel();
    trocarImagemItem();

    $('.proximo').on('click', function () {
        rotacionarCarrossel(1);
    });

    $('.anterior').on('click', function () {
        rotacionarCarrossel(-1);
    });

    items.on('click', function () {
        var indexClicado = items.index(this);
        var diferenca = indexClicado - indexAtivo;
        rotacionarCarrossel(-diferenca);
    });

    $('.card').on('click', function () {
        var indexCard = $(this).index();
        $('.div-dicas p').removeClass('ativo');
        $('.div-dicas .dica-' + (indexCard + 1)).addClass('ativo');
        $('#modal-selecionar-resposta').modal('show');
    });

    $('.btn.btn-primary.estilo-btn-resposta').on('click', function () {
        var textoBotao = $(this).text();
        var indexCard = indexAtivo;

        $('.card').eq(indexCard).find('.titulo-elemento').text(textoBotao);
        $('.card').eq(indexCard).find('.titulo-elemento').css('background-color', 'green');

        validarResposta(textoBotao, indexCard);

        $('#modal-selecionar-resposta').modal('hide');
    });

    function validarResposta(resposta, indexCard) {
        var respostaCorreta = respostasCorretas[indexCard];

        if (respostasDadas.indexOf(indexCard) === -1) {
            if (resposta === respostaCorreta) {
                $('#modal-feedback-positivo').modal('show');
                $('#som-feedback-positivo')[0].play();

                $('.modal-body p').hide();
                $('.feedback-positivo-' + (indexCard + 1)).show();


                trocarImagemCorreta(indexCard);

                respostasCorretasTotal++;

                respostasDadas.push(indexCard);

                if (respostasCorretasTotal === totalRespostas) {

                    setTimeout(function () {
                        $('#modal-final').modal('show');
                    }, 5000);
                }
            } else if (feedbackNegativoLetras[resposta]) {

                $('#modal-feedback-negativo').modal('show');

                $('.modal-body p').hide();
                $('.' + feedbackNegativoLetras[resposta]).show();

                alterarCorRemover(resposta, indexCard);
            } else {

                $('#modal-feedback-negativo').modal('show');
                $('#som-feedback-negativo')[0].play();


                $('.modal-body p').hide();
                $('.feedback-negativo-geral').show();

                alterarCorRemover(resposta, indexCard);
            }
        }
    }

    function alterarCorRemover(resposta, indexCard) {
        var tituloElemento = $('.card').eq(indexCard).find('.titulo-elemento');

    
        tituloElemento.css('background-color', 'red');

        setTimeout(function () {
            tituloElemento.text('Clique aqui');
            tituloElemento.css('background-color', '');
        }, 4000);
    }

    function trocarImagemCorreta(indexCard) {
        var item = items.eq(indexCard);
        var imgElemento = item.find('.img-elemento img');
        imgElemento.attr('src', 'assets/img/icone' + (indexCard + 1) + '-correto.png');
    }

    function trocarImagemItem() {
        items.each(function (index) {
            var imgElemento = $(this).find('.img-elemento img');
            if (respostasDadas.indexOf(index) !== -1) {

                imgElemento.attr('src', 'assets/img/icone' + (index + 1) + '-correto.png');
            } else if ($(this).hasClass('ativo')) {
                imgElemento.attr('src', 'assets/img/icone' + (index + 1) + '-ativo.png');
            } else {
                imgElemento.attr('src', 'assets/img/icone' + (index + 1) + '-inativo.png');
            }
        });
    }

    $('.btn.btn-primary.estilo-btn-resposta').on('click', function () {
        var textoBotao = $(this).text();
        var indexCard = indexAtivo;

        $('.card').eq(indexCard).find('.titulo-elemento').text(textoBotao);

        validarResposta(textoBotao, indexCard);

        $('#modal-selecionar-resposta').modal('hide');
    });

    $('.clique').on('click', function () {
        $('#som-clique')[0].play();
    });

    function resetarJogo() {
        posicionarItens();
    
        indexAtivo = 0;
        atualizarItemAtivo();
    
        atualizarCardVisivel();
    
        respostasCorretasTotal = 0;
        respostasDadas = [];
        $('.card .titulo-elemento').text('Clique aqui');
        $('.card .titulo-elemento').css('background-color', '');
        $('.div-dicas p').removeClass('ativo');

        
        trocarImagemItem();

        $('#modal-feedback-positivo').modal('hide');
        $('#modal-feedback-negativo').modal('hide');
        $('#modal-final').modal('hide');
    }

    $('#botao-jogar-novamente').on('click', function() {
        resetarJogo();
    });

});